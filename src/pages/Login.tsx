import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, Shield, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [otp, setOtp] = useState('');
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      // Block admin users
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: data.user.id,
        _role: 'admin' as const,
      });
      if (isAdmin) {
        await supabase.auth.signOut();
        toast.error(language === 'vi' ? 'Vui lòng sử dụng trang đăng nhập quản trị.' : 'Please use the admin login page.');
        setLoading(false);
        return;
      }
      // Move to OTP step (do NOT navigate yet)
      setPendingUserId(data.user.id);
      setStep('otp');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUserId) return;
    setVerifying(true);

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('login_otp')
      .eq('user_id', pendingUserId)
      .maybeSingle();

    if (error) {
      toast.error(error.message);
      setVerifying(false);
      return;
    }

    if (!profile?.login_otp) {
      await supabase.auth.signOut();
      toast.error(
        language === 'vi'
          ? 'Mã OTP chưa được thiết lập. Vui lòng liên hệ quản trị viên.'
          : 'OTP not set. Please contact the administrator.'
      );
      setStep('credentials');
      setOtp('');
      setPendingUserId(null);
      setVerifying(false);
      return;
    }

    if (profile.login_otp.trim() !== otp.trim()) {
      toast.error(language === 'vi' ? 'Mã OTP không đúng' : 'Incorrect OTP');
      setOtp('');
      setVerifying(false);
      return;
    }

    toast.success(t('auth.login_success'));
    navigate('/dashboard');
    setVerifying(false);
  };

  const handleBackToCredentials = async () => {
    await supabase.auth.signOut();
    setStep('credentials');
    setOtp('');
    setPendingUserId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bank-darkBlue via-bank-blue to-bank-darkBlue flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-bank-gold/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-bank-lightBlue/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-bank-gold to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Việt Trust Bank</span>
          </Link>
        </div>

        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
          {step === 'credentials' ? (
            <>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-bank-darkBlue">{t('auth.login.title')}</CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">{t('auth.login.subtitle')}</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-bank-blue" placeholder="email@example.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">{t('auth.password')}</Label>
                      <Link to="/forgot-password" className="text-xs text-bank-blue hover:underline">{t('auth.forgot_password')}</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-bank-blue" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{language === 'vi' ? 'Đang đăng nhập...' : 'Signing in...'}</span>
                      </div>
                    ) : t('auth.login.title')}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('auth.no_account')}{' '}
                    <Link to="/signup" className="text-bank-blue font-semibold hover:underline">{t('nav.signup')}</Link>
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-bank-blue to-bank-lightBlue rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
                  <KeyRound className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-bank-darkBlue">
                  {language === 'vi' ? 'Xác minh OTP' : 'OTP Verification'}
                </CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
                  {language === 'vi'
                    ? 'Nhập mã OTP do quản trị viên cung cấp để hoàn tất đăng nhập'
                    : 'Enter the OTP code provided by the administrator to complete login'}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="otp">{language === 'vi' ? 'Mã OTP' : 'OTP Code'}</Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="••••••"
                      className="h-12 text-center tracking-[0.4em] text-lg font-mono border-gray-200 focus:border-bank-blue"
                      autoFocus
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white font-semibold" disabled={verifying || !otp}>
                    {verifying ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (language === 'vi' ? 'Xác minh' : 'Verify')}
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleBackToCredentials} className="w-full text-muted-foreground">
                    {language === 'vi' ? 'Quay lại đăng nhập' : 'Back to login'}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;

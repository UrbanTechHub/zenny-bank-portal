import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    // Block admin users from logging in via user login
    if (data.user) {
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
    }
    toast.success(t('auth.login_success'));
    navigate('/dashboard');
    setLoading(false);
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
        </Card>
      </div>
    </div>
  );
};

export default Login;

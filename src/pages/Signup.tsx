import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', fullName: '',
    phone: '', address: '', occupation: '', accountType: '', dateOfBirth: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu không khớp / Passwords do not match');
      return;
    }
    if (!formData.fullName || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin / Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            occupation: formData.occupation,
            account_type: formData.accountType,
            date_of_birth: formData.dateOfBirth,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('auth.signup_success'));
        navigate('/login');
      }
    } catch {
      toast.error('Đã xảy ra lỗi / An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bank-darkBlue via-bank-blue to-bank-darkBlue flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-bank-gold/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-bank-lightBlue/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-bank-gold to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Việt Trust Bank</span>
          </Link>
        </div>

        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-bank-darkBlue">{t('auth.signup.title')}</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">{t('auth.signup.subtitle')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{t('auth.full_name')} *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
                      className="pl-10 h-10" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{t('auth.phone')} *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)}
                      className="pl-10 h-10" required />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{t('auth.email')} *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-10 h-10" placeholder="email@example.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{t('auth.date_of_birth')}</Label>
                  <Input type="date" value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('auth.occupation')}</Label>
                  <Input value={formData.occupation} onChange={(e) => handleChange('occupation', e.target.value)}
                    className="h-10" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{t('auth.address')}</Label>
                <Input value={formData.address} onChange={(e) => handleChange('address', e.target.value)} className="h-10" />
              </div>

              <div className="space-y-1.5">
                <Label>{t('auth.account_type')}</Label>
                <Select onValueChange={(val) => handleChange('accountType', val)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={t('auth.account_type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">{t('auth.savings_account')}</SelectItem>
                    <SelectItem value="checking">{t('auth.checking_account')}</SelectItem>
                    <SelectItem value="business">{t('auth.business_account')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{t('auth.password')} *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type={showPassword ? 'text' : 'password'} value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="pl-10 pr-10 h-10" required minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{t('auth.confirm_password')} *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="password" value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="pl-10 h-10" required minLength={8} />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white font-semibold shadow-lg" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : t('auth.signup.title')}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {t('auth.has_account')}{' '}
              <Link to="/login" className="text-bank-blue font-semibold hover:underline">{t('nav.login')}</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

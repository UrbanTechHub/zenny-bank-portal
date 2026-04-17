import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bank-darkBlue via-bank-blue to-bank-darkBlue flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-bank-darkBlue">Ngân hàng Việt Trust</h1>
            <h2 className="text-xl font-semibold text-foreground mt-4">{t('auth.reset_password')}</h2>
            <p className="text-muted-foreground mt-2 text-sm">{t('auth.reset_subtitle')}</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-bank-green/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-bank-green" />
              </div>
              <p className="text-muted-foreground">Check your email for a password reset link.</p>
              <Link to="/login" className="text-bank-blue hover:underline text-sm flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" /> {t('auth.back_login')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white h-11" disabled={loading}>
                {loading ? '...' : t('auth.send_reset')}
              </Button>
              <Link to="/login" className="text-bank-blue hover:underline text-sm flex items-center justify-center gap-1 mt-4">
                <ArrowLeft className="w-4 h-4" /> {t('auth.back_login')}
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

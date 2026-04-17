import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Password updated successfully!' });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bank-darkBlue via-bank-blue to-bank-darkBlue flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-bank-darkBlue">Ngân hàng Việt Trust</h1>
            <h2 className="text-xl font-semibold text-foreground mt-4">{t('auth.new_password')}</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.new_password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirm_password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white h-11" disabled={loading}>
              {loading ? '...' : t('auth.reset_password')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const didAutoRedirect = useRef(false);

  const getAdminEmail = () => {
    const value = username.trim().toLowerCase();
    if (!value) return '';
    return value.includes('@') ? value : `${value}@admin.local`;
  };

  useEffect(() => {
    let cancelled = false;
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !cancelled && !didAutoRedirect.current) {
        const { data: hasRole } = await supabase.rpc('has_role', {
          _user_id: session.user.id, _role: 'admin' as const,
        });
        if (hasRole && !cancelled) {
          didAutoRedirect.current = true;
          navigate('/admin', { replace: true });
        }
      }
    };
    checkExistingSession();
    return () => { cancelled = true; };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = getAdminEmail();
    if (!email) { toast.error('Please enter your admin username'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error(error.message); return; }
      if (data.user) {
        const { data: hasRole } = await supabase.rpc('has_role', {
          _user_id: data.user.id, _role: 'admin' as const,
        });
        if (hasRole) {
          toast.success('Login successful');
          navigate('/admin', { replace: true });
        } else {
          toast.error('This account does not have admin privileges');
          await supabase.auth.signOut();
        }
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex bg-white rounded-xl px-4 py-2 shadow-lg shadow-red-500/20 mb-4">
            <img src="/viettrustbank-logo.png" alt="VietTrustBank" className="h-10 w-auto" />
          </span>
          <h1 className="text-2xl font-bold text-white mt-2">{t('admin.login.title')}</h1>
          <p className="text-gray-400 mt-1 text-sm">{t('admin.login.subtitle')}</p>
        </div>

        <Card className="bg-gray-800/80 backdrop-blur-xl border-gray-700 shadow-2xl">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">{t('admin.username')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input value={username} onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-red-500"
                    placeholder="admin" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-red-500"
                    required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold" disabled={loading}>
                {loading ? 'Processing...' : t('nav.login')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <a href="/login" className="text-gray-400 text-sm hover:text-white transition-colors">
            ← Back to user login
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

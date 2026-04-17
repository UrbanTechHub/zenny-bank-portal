import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Users, CreditCard, Settings, LogOut, BarChart3, Shield,
  Search, CheckCircle, XCircle,
  Activity, UserPlus, Globe, Ban, Edit, 
  ArrowUpRight, ArrowDownRight, UserCheck, Lock, ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', login_otp: '' });

  const [creditDebitUser, setCreditDebitUser] = useState<any>(null);
  const [cdAmount, setCdAmount] = useState('');
  const [cdType, setCdType] = useState<'credit' | 'debit'>('credit');
  const [cdDescription, setCdDescription] = useState('');
  const [cdDate, setCdDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAll();
    const ch1 = supabase.channel('admin-tx').on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchAll()).subscribe();
    const ch2 = supabase.channel('admin-profiles').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchAll()).subscribe();
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2); };
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [profilesRes, accountsRes, txRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('accounts').select('*'),
      supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(100),
    ]);
    setUsers(profilesRes.data || []);
    setAccounts(accountsRes.data || []);
    setAllTransactions(txRes.data || []);
    setLoading(false);
  };

  const handleLogout = async () => { await signOut(); navigate('/admin-login'); };

  const filteredUsers = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAccount = (userId: string) => accounts.find(a => a.user_id === userId);
  const formatVND = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  const pendingTx = allTransactions.filter(tx => tx.status === 'pending');

  const stats = {
    totalUsers: users.length,
    approvedUsers: users.filter(u => u.is_approved).length,
    pendingApprovals: users.filter(u => !u.is_approved).length,
    totalTransactions: allTransactions.length,
    pendingTransactions: pendingTx.length,
  };

  const handleApproveUser = async (userId: string) => {
    const { error } = await supabase.from('profiles').update({ is_approved: true }).eq('user_id', userId);
    if (error) { toast.error(error.message); return; }
    toast.success(language === 'vi' ? 'Đã duyệt tài khoản!' : 'Account approved!');
    fetchAll();
  };

  const handleSuspendUser = async (userId: string) => {
    const { error } = await supabase.from('profiles').update({ is_approved: false }).eq('user_id', userId);
    if (error) { toast.error(error.message); return; }
    toast.success(language === 'vi' ? 'Đã tạm khóa tài khoản!' : 'Account suspended!');
    fetchAll();
  };

  const handleToggleLock = async (userId: string, currentValue: boolean) => {
    const { error } = await supabase.from('profiles').update({ is_locked: !currentValue }).eq('user_id', userId);
    if (error) { toast.error(error.message); return; }
    toast.success(!currentValue
      ? (language === 'vi' ? 'Tài khoản đã bị khóa! Người dùng sẽ bị đăng xuất sau 20 giây.' : 'Account locked! User will be logged out in 20 seconds.')
      : (language === 'vi' ? 'Đã mở khóa tài khoản!' : 'Account unlocked!'));
    fetchAll();
  };

  const handleToggleTransferBlock = async (userId: string, currentValue: boolean) => {
    const { error } = await supabase.from('profiles').update({ transfer_blocked: !currentValue }).eq('user_id', userId);
    if (error) { toast.error(error.message); return; }
    toast.success(!currentValue
      ? (language === 'vi' ? 'Đã chặn chuyển tiền!' : 'Transfer blocked!')
      : (language === 'vi' ? 'Đã bỏ chặn chuyển tiền!' : 'Transfer unblocked!'));
    fetchAll();
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditForm({ full_name: user.full_name || '', phone: user.phone || '', login_otp: user.login_otp || '' });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    const { error } = await supabase.from('profiles').update({
      full_name: editForm.full_name,
      phone: editForm.phone,
      login_otp: editForm.login_otp ? editForm.login_otp.trim() : null,
    }).eq('user_id', editingUser.user_id);
    if (error) { toast.error(error.message); return; }
    toast.success(language === 'vi' ? 'Đã cập nhật!' : 'Updated!');
    setEditingUser(null);
    fetchAll();
  };

  const handleOpenCreditDebit = (user: any, type: 'credit' | 'debit') => {
    setCreditDebitUser(user);
    setCdType(type);
    setCdAmount('');
    setCdDescription('');
    setCdDate(new Date().toISOString().split('T')[0]);
  };

  const handleCreditDebit = async () => {
    if (!creditDebitUser || !cdAmount) return;
    const amount = parseInt(cdAmount);
    if (!amount || amount <= 0) { toast.error('Invalid amount'); return; }
    const acct = getAccount(creditDebitUser.user_id);
    if (!acct) { toast.error('Account not found'); return; }

    if (cdType === 'debit' && acct.balance < amount) {
      toast.error(language === 'vi' ? 'Số dư không đủ' : 'Insufficient balance');
      return;
    }

    const newBalance = cdType === 'credit' ? acct.balance + amount : acct.balance - amount;
    const { error: acctError } = await supabase.from('accounts').update({ balance: newBalance }).eq('id', acct.id);
    if (acctError) { toast.error(acctError.message); return; }

    const refNum = 'ADM' + Date.now().toString(36).toUpperCase();
    await supabase.from('transactions').insert({
      sender_id: creditDebitUser.user_id,
      sender_account: acct.account_number,
      recipient_account: acct.account_number,
      recipient_name: cdType === 'credit' ? 'Admin Credit' : 'Admin Debit',
      amount,
      description: cdDescription || (cdType === 'credit' ? 'Admin credit' : 'Admin debit'),
      reference_number: refNum,
      type: cdType,
      status: 'completed',
      created_at: cdDate ? new Date(cdDate).toISOString() : new Date().toISOString(),
    });

    toast.success(`${cdType === 'credit' ? 'Credited' : 'Debited'} ${formatVND(amount)}`);
    setCreditDebitUser(null);
    fetchAll();
  };

  const handleApproveTx = async (txId: string) => {
    const tx = allTransactions.find(t => t.id === txId);
    if (!tx) return;

    const senderAcct = accounts.find(a => a.account_number === tx.sender_account);
    if (senderAcct) {
      if (senderAcct.balance < tx.amount) {
        toast.error(language === 'vi' ? 'Người gửi không đủ số dư' : 'Sender has insufficient balance');
        return;
      }
      await supabase.from('accounts').update({ balance: senderAcct.balance - tx.amount }).eq('id', senderAcct.id);
    }

    const recipientAcct = accounts.find(a => a.account_number === tx.recipient_account);
    if (recipientAcct) {
      await supabase.from('accounts').update({ balance: recipientAcct.balance + tx.amount }).eq('id', recipientAcct.id);
      await supabase.from('transactions').update({ recipient_id: recipientAcct.user_id }).eq('id', txId);
    }

    await supabase.from('transactions').update({ status: 'completed' }).eq('id', txId);
    toast.success(language === 'vi' ? 'Giao dịch đã được duyệt!' : 'Transaction approved!');
    fetchAll();
  };

  const handleRejectTx = async (txId: string) => {
    await supabase.from('transactions').update({ status: 'rejected' }).eq('id', txId);
    toast.success(language === 'vi' ? 'Giao dịch đã bị từ chối' : 'Transaction rejected');
    fetchAll();
  };

  const statCards = [
    { title: language === 'vi' ? 'Tổng người dùng' : 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: language === 'vi' ? 'Đã duyệt' : 'Approved', value: stats.approvedUsers, icon: UserCheck, color: 'from-green-500 to-emerald-600' },
    { title: language === 'vi' ? 'Chờ duyệt' : 'Pending Approval', value: stats.pendingApprovals, icon: UserPlus, color: 'from-amber-500 to-orange-600' },
    { title: language === 'vi' ? 'Giao dịch chờ' : 'Pending Tx', value: stats.pendingTransactions, icon: Activity, color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Việt Trust Bank</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} className="text-gray-300 hover:text-white hover:bg-gray-700">
              <Globe className="w-4 h-4 mr-1" /> {language === 'vi' ? 'EN' : 'VI'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-900/30">
              <LogOut className="w-4 h-4 mr-1" /> {t('nav.logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border border-gray-700 mb-6 flex-wrap h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 mr-1" /> {language === 'vi' ? 'Tổng Quan' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm">
              <Users className="w-4 h-4 mr-1" /> {language === 'vi' ? 'Người Dùng' : 'Users'}
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm">
              <CreditCard className="w-4 h-4 mr-1" /> {language === 'vi' ? 'Giao Dịch' : 'Transactions'}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm">
              <Settings className="w-4 h-4 mr-1" /> {language === 'vi' ? 'Cài Đặt' : 'Settings'}
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, i) => (
                <Card key={i} className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{loading ? '...' : stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {pendingTx.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle className="text-amber-400">{language === 'vi' ? 'Giao dịch chờ duyệt' : 'Pending Transactions'} ({pendingTx.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingTx.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-white">{tx.recipient_name}</p>
                          <p className="text-xs text-gray-400">{tx.reference_number} · {new Date(tx.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold text-white">{formatVND(tx.amount)}</p>
                          <div className="flex gap-1">
                            <Button size="icon" className="h-7 w-7 bg-green-600 hover:bg-green-700" onClick={() => handleApproveTx(tx.id)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleRejectTx(tx.id)}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader><CardTitle className="text-white text-lg">{language === 'vi' ? 'Giao dịch gần đây' : 'Recent Transactions'}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTransactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.status === 'completed' ? 'bg-green-500/20' : tx.status === 'pending' ? 'bg-amber-500/20' : 'bg-red-500/20'}`}>
                          {tx.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-400" /> : tx.status === 'pending' ? <Activity className="w-4 h-4 text-amber-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{tx.recipient_name}</p>
                          <p className="text-xs text-gray-400">{tx.reference_number} · {new Date(tx.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{formatVND(tx.amount)}</p>
                        <p className={`text-xs ${tx.status === 'completed' ? 'text-green-400' : tx.status === 'pending' ? 'text-amber-400' : 'text-red-400'}`}>{tx.status}</p>
                      </div>
                    </div>
                  ))}
                  {allTransactions.length === 0 && <p className="text-gray-500 text-center py-4">{language === 'vi' ? 'Chưa có giao dịch' : 'No transactions'}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                placeholder={language === 'vi' ? 'Tìm kiếm người dùng...' : 'Search users...'} />
            </div>

            {editingUser && (
              <Card className="bg-gray-800 border-amber-500/50 border-2">
                <CardHeader><CardTitle className="text-amber-400">{language === 'vi' ? 'Chỉnh sửa người dùng' : 'Edit User'}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">{language === 'vi' ? 'Họ tên' : 'Full Name'}</label>
                    <Input value={editForm.full_name} onChange={(e) => setEditForm(p => ({...p, full_name: e.target.value}))} className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">{language === 'vi' ? 'Số điện thoại' : 'Phone'}</label>
                    <Input value={editForm.phone} onChange={(e) => setEditForm(p => ({...p, phone: e.target.value}))} className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {language === 'vi' ? 'Mã OTP đăng nhập' : 'Login OTP code'}
                    </label>
                    <Input
                      value={editForm.login_otp}
                      onChange={(e) => setEditForm(p => ({...p, login_otp: e.target.value}))}
                      className="bg-gray-700 border-gray-600 text-white font-mono tracking-widest"
                      placeholder={language === 'vi' ? 'Để trống để xóa' : 'Leave blank to clear'}
                    />
                    <p className="text-xs text-gray-500">
                      {language === 'vi'
                        ? 'Người dùng nhập mã này sau khi đăng nhập bằng mật khẩu.'
                        : 'User enters this code after password login.'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">{language === 'vi' ? 'Lưu' : 'Save'}</Button>
                    <Button variant="outline" onClick={() => setEditingUser(null)} className="border-gray-600 text-gray-300">{language === 'vi' ? 'Hủy' : 'Cancel'}</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {creditDebitUser && (
              <Card className="bg-gray-800 border-blue-500/50 border-2">
                <CardHeader>
                  <CardTitle className={cdType === 'credit' ? 'text-green-400' : 'text-red-400'}>
                    {cdType === 'credit' ? (language === 'vi' ? 'Nạp tiền cho' : 'Credit') : (language === 'vi' ? 'Trừ tiền từ' : 'Debit')}: {creditDebitUser.full_name || 'User'}
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    {language === 'vi' ? 'Số dư hiện tại' : 'Current balance'}: {formatVND(getAccount(creditDebitUser.user_id)?.balance || 0)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">{language === 'vi' ? 'Số tiền' : 'Amount'} (VNĐ)</label>
                    <Input type="number" value={cdAmount} onChange={(e) => setCdAmount(e.target.value)} className="bg-gray-700 border-gray-600 text-white" placeholder="0" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">{language === 'vi' ? 'Mô tả' : 'Description'}</label>
                    <Input value={cdDescription} onChange={(e) => setCdDescription(e.target.value)} className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">{language === 'vi' ? 'Ngày giao dịch' : 'Transaction Date'}</label>
                    <Input type="date" value={cdDate} onChange={(e) => setCdDate(e.target.value)} className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreditDebit} className={cdType === 'credit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
                      {cdType === 'credit' ? (language === 'vi' ? 'Nạp tiền' : 'Credit') : (language === 'vi' ? 'Trừ tiền' : 'Debit')}
                    </Button>
                    <Button variant="outline" onClick={() => setCreditDebitUser(null)} className="border-gray-600 text-gray-300">{language === 'vi' ? 'Hủy' : 'Cancel'}</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="text-left py-3 px-2 font-medium">{language === 'vi' ? 'Người dùng' : 'User'}</th>
                        <th className="text-left py-3 px-2 font-medium hidden sm:table-cell">{language === 'vi' ? 'SĐT' : 'Phone'}</th>
                        <th className="text-right py-3 px-2 font-medium hidden md:table-cell">{language === 'vi' ? 'Số dư' : 'Balance'}</th>
                        <th className="text-center py-3 px-2 font-medium">{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                        <th className="text-right py-3 px-2 font-medium">{language === 'vi' ? 'Hành động' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const acct = getAccount(user.user_id);
                        return (
                          <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {(user.full_name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-white text-sm">{user.full_name || 'Unknown'}</p>
                                  <p className="text-xs text-gray-400">{acct?.account_number || '—'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-300 hidden sm:table-cell">{user.phone || '—'}</td>
                            <td className="py-3 px-2 text-right text-gray-300 hidden md:table-cell">{acct ? formatVND(acct.balance) : '—'}</td>
                            <td className="py-3 px-2 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                  {user.is_approved ? (language === 'vi' ? 'Đã duyệt' : 'Approved') : (language === 'vi' ? 'Chờ duyệt' : 'Pending')}
                                </span>
                                {user.is_locked && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                                    {language === 'vi' ? 'Đã khóa' : 'Locked'}
                                  </span>
                                )}
                                {user.transfer_blocked && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                                    {language === 'vi' ? 'Chặn CK' : 'Blocked'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <div className="flex items-center justify-end gap-1 flex-wrap">
                                {!user.is_approved ? (
                                  <Button size="icon" className="h-7 w-7 bg-green-600 hover:bg-green-700" onClick={() => handleApproveUser(user.user_id)} title="Approve">
                                    <UserCheck className="w-3.5 h-3.5" />
                                  </Button>
                                ) : (
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-amber-400 hover:bg-amber-500/20" onClick={() => handleSuspendUser(user.user_id)} title="Suspend">
                                    <Ban className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                                <Button size="icon" variant="ghost" className={`h-7 w-7 ${user.is_locked ? 'text-red-400 hover:bg-red-500/20' : 'text-gray-400 hover:bg-gray-500/20'}`} onClick={() => handleToggleLock(user.user_id, user.is_locked)} title={user.is_locked ? 'Unlock' : 'Lock Account'}>
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className={`h-7 w-7 ${user.transfer_blocked ? 'text-orange-400 hover:bg-orange-500/20' : 'text-gray-400 hover:bg-gray-500/20'}`} onClick={() => handleToggleTransferBlock(user.user_id, user.transfer_blocked)} title={user.transfer_blocked ? 'Unblock Transfer' : 'Block Transfer'}>
                                  <Lock className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-400 hover:bg-blue-500/20" onClick={() => handleEditUser(user)} title="Edit">
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-green-400 hover:bg-green-500/20" onClick={() => handleOpenCreditDebit(user, 'credit')} title="Credit">
                                  <ArrowDownRight className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:bg-red-500/20" onClick={() => handleOpenCreditDebit(user, 'debit')} title="Debit">
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-8 text-gray-500">{language === 'vi' ? 'Không tìm thấy' : 'No users found'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-4">
            {pendingTx.length > 0 && (
              <Card className="bg-gray-800 border-amber-500/30">
                <CardHeader><CardTitle className="text-amber-400">{language === 'vi' ? 'Giao dịch chờ duyệt' : 'Pending Approval'} ({pendingTx.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                          <th className="text-left py-3 px-2 font-medium">{language === 'vi' ? 'Mã GD' : 'Ref'}</th>
                          <th className="text-left py-3 px-2 font-medium">{language === 'vi' ? 'Người nhận' : 'Recipient'}</th>
                          <th className="text-right py-3 px-2 font-medium">{language === 'vi' ? 'Số tiền' : 'Amount'}</th>
                          <th className="text-right py-3 px-2 font-medium">{language === 'vi' ? 'Hành động' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingTx.map((tx) => (
                          <tr key={tx.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                            <td className="py-3 px-2 text-gray-300 font-mono text-xs">{tx.reference_number}</td>
                            <td className="py-3 px-2">
                              <p className="text-white text-sm">{tx.recipient_name}</p>
                              <p className="text-xs text-gray-400">{tx.sender_account} → {tx.recipient_account}</p>
                            </td>
                            <td className="py-3 px-2 text-right text-white font-medium">{formatVND(tx.amount)}</td>
                            <td className="py-3 px-2 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button size="icon" className="h-7 w-7 bg-green-600 hover:bg-green-700" onClick={() => handleApproveTx(tx.id)}>
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleRejectTx(tx.id)}>
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader><CardTitle className="text-white">{language === 'vi' ? 'Tất cả giao dịch' : 'All Transactions'}</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="text-left py-3 px-2 font-medium">{language === 'vi' ? 'Mã GD' : 'Ref'}</th>
                        <th className="text-left py-3 px-2 font-medium">{language === 'vi' ? 'Chi tiết' : 'Details'}</th>
                        <th className="text-right py-3 px-2 font-medium">{language === 'vi' ? 'Số tiền' : 'Amount'}</th>
                        <th className="text-center py-3 px-2 font-medium">{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                        <th className="text-right py-3 px-2 font-medium hidden sm:table-cell">{language === 'vi' ? 'Ngày' : 'Date'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3 px-2 text-gray-300 font-mono text-xs">{tx.reference_number}</td>
                          <td className="py-3 px-2">
                            <p className="text-white text-sm">{tx.recipient_name}</p>
                            <p className="text-xs text-gray-400">{tx.type} · {tx.description || '—'}</p>
                          </td>
                          <td className="py-3 px-2 text-right text-white font-medium">{formatVND(tx.amount)}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : tx.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>{tx.status}</span>
                          </td>
                          <td className="py-3 px-2 text-right text-gray-400 text-xs hidden sm:table-cell">{new Date(tx.created_at).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      ))}
                      {allTransactions.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">{language === 'vi' ? 'Chưa có giao dịch' : 'No transactions'}</td></tr>}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle className="text-white text-lg">{language === 'vi' ? 'Hồ sơ quản trị' : 'Admin Profile'}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">A</div>
                    <div>
                      <p className="font-semibold text-white">Administrator</p>
                      <p className="text-sm text-gray-400">{language === 'vi' ? 'Quản trị viên cấp cao' : 'Super Administrator'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle className="text-white text-lg">{language === 'vi' ? 'Thống kê hệ thống' : 'System Stats'}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">{language === 'vi' ? 'Tổng người dùng' : 'Total Users'}</span><span className="text-white font-medium">{stats.totalUsers}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">{language === 'vi' ? 'Tổng giao dịch' : 'Total Transactions'}</span><span className="text-white font-medium">{stats.totalTransactions}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">{language === 'vi' ? 'Đang chờ duyệt' : 'Pending Approval'}</span><span className="text-amber-400 font-medium">{stats.pendingTransactions}</span></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

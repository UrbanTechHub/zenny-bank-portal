import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu,
  SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset, useSidebar
} from '@/components/ui/sidebar';
import {
  BarChart3, Send, History, CreditCard, User, LogOut, Bell,
  ArrowUpRight, ArrowDownRight, Globe,
  Eye, EyeOff, Printer, Check, AlertTriangle, Lock, KeyRound, QrCode, ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

/* ──────────── Sidebar Menu Content ──────────── */
const SidebarMenuContent = ({ menuItems, activeTab, onSelectTab }: { menuItems: any[]; activeTab: string; onSelectTab: (id: string) => void }) => {
  const { setOpenMobile } = useSidebar();
  const handleClick = (id: string) => {
    onSelectTab(id);
    setOpenMobile(false);
  };
  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton onClick={() => handleClick(item.id)}
            className={`w-full justify-start h-11 rounded-lg transition-all duration-200 ${activeTab === item.id ? 'bg-gradient-to-r from-bank-blue to-bank-lightBlue text-white shadow-md' : 'text-gray-300 hover:bg-gray-900/50'}`}>
            <item.icon className="w-4 h-4 mr-3" />
            <span className="text-sm font-medium">{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  // Transfer state
  const [transferType, setTransferType] = useState<'domestic' | 'international' | 'wire'>('domestic');
  const [domesticForm, setDomesticForm] = useState({ recipientName: '', recipientAccount: '', bankName: '', branchName: '', amount: '', description: '', method: 'same_bank', transferDate: new Date().toISOString().split('T')[0] });
  const [internationalForm, setInternationalForm] = useState({ recipientName: '', recipientAddress: '', recipientAccount: '', bankName: '', bankAddress: '', swiftCode: '', intermediaryBank: '', currency: 'USD', amount: '', purpose: '', feeOption: 'SHA' });
  const [wireForm, setWireForm] = useState({ recipientName: '', recipientAccount: '', bankName: '', bankAddress: '', swiftCode: '', recipientAddress: '', amount: '', currency: 'USD', purpose: '', chargesOption: 'SHA', executionType: 'normal', transferDate: new Date().toISOString().split('T')[0] });
  const [transferStep, setTransferStep] = useState<'form' | 'pin' | 'receipt'>('form');
  const [pinCode, setPinCode] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  const [hasPin, setHasPin] = useState(false);

  // PIN setup
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  const receiptRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { title: language === 'vi' ? 'Tổng quan' : 'Overview', icon: BarChart3, id: 'overview' },
    { title: language === 'vi' ? 'Chuyển tiền' : 'Transfer', icon: Send, id: 'transfer' },
    { title: language === 'vi' ? 'Lịch sử' : 'History', icon: History, id: 'history' },
    { title: language === 'vi' ? 'Thẻ' : 'Cards', icon: CreditCard, id: 'cards' },
    { title: language === 'vi' ? 'QR Thanh toán' : 'QR Payment', icon: QrCode, id: 'qr' },
    { title: language === 'vi' ? 'Hồ sơ' : 'Profile', icon: User, id: 'profile' },
  ];

  useEffect(() => {
    if (!user) return;
    fetchAll();
    // Subscribe to live updates on this user's profile so admin lock/block changes apply instantly
    const ch = supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `user_id=eq.${user.id}` },
        (payload) => setProfile(payload.new)
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  // Auto-logout if account is locked
  useEffect(() => {
    if (!profile?.is_locked) return;
    const timer = setTimeout(async () => {
      await signOut();
      navigate('/account-locked');
    }, 20000);
    return () => clearTimeout(timer);
  }, [profile?.is_locked]);

  const fetchAll = async () => {
    setLoading(true);
    const [profileRes, accountRes, txRes, pinRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user!.id).maybeSingle(),
      supabase.from('accounts').select('*').eq('user_id', user!.id).maybeSingle(),
      supabase.from('transactions').select('*').or(`sender_id.eq.${user!.id},recipient_id.eq.${user!.id}`).order('created_at', { ascending: false }).limit(50),
      supabase.from('transfer_pins').select('id').eq('user_id', user!.id).maybeSingle(),
    ]);
    setProfile(profileRes.data);
    setAccount(accountRes.data);
    setTransactions(txRes.data || []);
    setHasPin(!!pinRes.data);
    setLoading(false);
  };

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();
  const accountNumber = account?.account_number || 'N/A';
  const balance = account?.balance || 0;

  const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const hashPin = async (pin: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + user!.id);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSetPin = async () => {
    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      toast.error(language === 'vi' ? 'Mã PIN phải có đúng 6 chữ số' : 'PIN must be exactly 6 digits');
      return;
    }
    if (newPin !== confirmNewPin) {
      toast.error(language === 'vi' ? 'Mã PIN không khớp' : 'PINs do not match');
      return;
    }
    const pinHash = await hashPin(newPin);
    const { error } = hasPin
      ? await supabase.from('transfer_pins').update({ pin_hash: pinHash }).eq('user_id', user!.id)
      : await supabase.from('transfer_pins').insert({ user_id: user!.id, pin_hash: pinHash });
    if (error) { toast.error(error.message); return; }
    toast.success(language === 'vi' ? 'Đã thiết lập mã PIN!' : 'PIN set successfully!');
    setHasPin(true);
    setNewPin('');
    setConfirmNewPin('');
    setShowPinSetup(false);
  };

  const getCurrentTransferData = () => {
    if (transferType === 'domestic') {
      return { recipientName: domesticForm.recipientName, recipientAccount: domesticForm.recipientAccount, amount: domesticForm.amount, description: `[Domestic] Bank: ${domesticForm.bankName} | Branch: ${domesticForm.branchName} | Method: ${domesticForm.method} | Date: ${domesticForm.transferDate} | ${domesticForm.description}` };
    } else if (transferType === 'international') {
      return { recipientName: internationalForm.recipientName, recipientAccount: internationalForm.recipientAccount, amount: internationalForm.amount, description: `[International] Bank: ${internationalForm.bankName} | Address: ${internationalForm.bankAddress} | SWIFT: ${internationalForm.swiftCode} | Currency: ${internationalForm.currency} | Purpose: ${internationalForm.purpose} | Fee: ${internationalForm.feeOption} | Intermediary: ${internationalForm.intermediaryBank} | Recipient Address: ${internationalForm.recipientAddress}` };
    } else {
      return { recipientName: wireForm.recipientName, recipientAccount: wireForm.recipientAccount, amount: wireForm.amount, description: `[Wire/TT] Bank: ${wireForm.bankName} | Address: ${wireForm.bankAddress} | SWIFT: ${wireForm.swiftCode} | Currency: ${wireForm.currency} | Purpose: ${wireForm.purpose} | Charges: ${wireForm.chargesOption} | Execution: ${wireForm.executionType} | Date: ${wireForm.transferDate} | Recipient Address: ${wireForm.recipientAddress}` };
    }
  };

  const handleTransferSubmit = async () => {
    const modeBlocked =
      (transferType === 'domestic' && profile?.block_domestic) ||
      (transferType === 'international' && profile?.block_international) ||
      (transferType === 'wire' && profile?.block_wire);
    if (modeBlocked) {
      toast.error(language === 'vi' ? 'Chế độ chuyển tiền này đã bị chặn cho tài khoản của bạn.' : 'This transfer mode is disabled for your account.');
      return;
    }
    if (!profile?.is_approved) {
      toast.error(language === 'vi' ? 'Tài khoản chưa được duyệt. Vui lòng chờ admin phê duyệt.' : 'Account not approved. Please wait for admin approval.');
      return;
    }
    if (!hasPin) {
      toast.error(language === 'vi' ? 'Vui lòng thiết lập mã PIN trước khi chuyển tiền' : 'Please set up your transfer PIN first');
      setActiveTab('profile');
      return;
    }
    const td = getCurrentTransferData();
    const amount = parseInt(td.amount);
    if (!amount || amount <= 0) { toast.error(language === 'vi' ? 'Số tiền không hợp lệ' : 'Invalid amount'); return; }
    if (!td.recipientAccount || !td.recipientName) {
      toast.error(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : 'Please fill all required fields');
      return;
    }
    if (amount > balance) {
      toast.error(language === 'vi' ? 'Số dư không đủ' : 'Insufficient balance');
      return;
    }
    setTransferStep('pin');
  };

  const handlePinVerify = async () => {
    // Block check happens here so users can fill the form, but cannot finalize transfer
    if (profile?.transfer_blocked) {
      toast.error(language === 'vi' ? 'Chuyển tiền đã bị chặn. Vui lòng liên hệ ngân hàng.' : 'Transfer blocked. Please contact the bank.');
      return;
    }
    if (pinCode.length !== 6) {
      toast.error(language === 'vi' ? 'Vui lòng nhập đầy đủ 6 chữ số' : 'Please enter all 6 digits');
      return;
    }
    setTransferLoading(true);
    const pinHash = await hashPin(pinCode);
    const { data: pinData } = await supabase.from('transfer_pins').select('pin_hash').eq('user_id', user!.id).maybeSingle();
    if (!pinData || pinData.pin_hash !== pinHash) {
      toast.error(language === 'vi' ? 'Mã PIN không đúng' : 'Incorrect PIN');
      setTransferLoading(false);
      setPinCode('');
      return;
    }

    const td = getCurrentTransferData();
    const refNum = 'VTB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
    const amount = parseInt(td.amount);

    const { data: txData, error } = await supabase.from('transactions').insert({
      sender_id: user!.id,
      sender_account: accountNumber,
      recipient_account: td.recipientAccount,
      recipient_name: td.recipientName,
      amount,
      description: td.description,
      reference_number: refNum,
      type: transferType,
      status: 'pending',
    }).select().single();

    if (error) { toast.error(error.message); setTransferLoading(false); return; }

    setLastReceipt({
      ...txData,
      senderName: displayName,
      senderAccount: accountNumber,
      date: new Date().toLocaleString('vi-VN'),
      transferType,
    });
    setTransferStep('receipt');
    setTransferLoading(false);
    setPinCode('');
    toast.success(language === 'vi' ? 'Giao dịch đã được gửi để xử lý!' : 'Transaction submitted for processing!');
    fetchAll();
  };

  const handlePrintReceipt = () => {
    const content = receiptRef.current;
    if (!content) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Receipt</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;max-width:500px;margin:0 auto}
      .header{text-align:center;border-bottom:2px solid #0A2463;padding-bottom:16px;margin-bottom:24px}
      .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee}
      .label{color:#666;font-size:14px}.value{font-weight:600;font-size:14px}
      .amount{font-size:24px;font-weight:bold;text-align:center;color:#0A2463;margin:20px 0}
      .status{text-align:center;padding:8px;border-radius:8px;background:#FFF3CD;color:#856404;margin:16px 0}
      .footer{text-align:center;margin-top:30px;color:#666;font-size:12px}</style>
      </head><body>${content.innerHTML}<script>window.print();window.close();</script></body></html>
    `);
    win.document.close();
  };

  const resetTransfer = () => {
    setTransferStep('form');
    setDomesticForm({ recipientName: '', recipientAccount: '', bankName: '', branchName: '', amount: '', description: '', method: 'same_bank', transferDate: new Date().toISOString().split('T')[0] });
    setInternationalForm({ recipientName: '', recipientAddress: '', recipientAccount: '', bankName: '', bankAddress: '', swiftCode: '', intermediaryBank: '', currency: 'USD', amount: '', purpose: '', feeOption: 'SHA' });
    setWireForm({ recipientName: '', recipientAccount: '', bankName: '', bankAddress: '', swiftCode: '', recipientAddress: '', amount: '', currency: 'USD', purpose: '', chargesOption: 'SHA', executionType: 'normal', transferDate: new Date().toISOString().split('T')[0] });
    setLastReceipt(null);
  };

  /* ──────────── Render Sections ──────────── */

  const renderOverview = () => (
    <div className="space-y-6">
      {profile?.is_locked && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-semibold text-sm">{language === 'vi' ? 'Cảnh báo: Tài khoản sẽ bị khóa' : 'Warning: Account will be locked'}</p>
            <p className="text-red-400/70 text-xs">{language === 'vi' ? 'Phát hiện hoạt động đáng ngờ. Bạn sẽ bị đăng xuất tự động.' : 'Suspicious activity detected. You will be logged out automatically.'}</p>
          </div>
        </div>
      )}

      {/* Balance Hero — inspired by reference */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bank-darkBlue via-bank-blue to-bank-lightBlue p-6 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-20 w-56 h-56 rounded-full bg-bank-gold/20 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-semibold">
              {userInitial}
            </div>
            <div>
              <p className="text-white/70 text-xs">{t('dashboard.welcome')}</p>
              <p className="font-semibold text-sm leading-tight">{displayName}</p>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition">
            <Bell className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white/70 text-sm">{t('dashboard.total_balance')}</p>
            <button onClick={() => setShowBalance(!showBalance)} className="text-white/70 hover:text-white">
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-4xl sm:text-5xl font-bold tracking-tight">{showBalance ? formatVND(balance) : '••••••••'}</p>
          <p className="text-white/60 text-xs mt-2 font-mono">{accountNumber}</p>
          {!profile?.is_approved && (
            <div className="mt-3 inline-flex items-center gap-1 text-amber-200 text-xs bg-amber-500/15 border border-amber-300/30 rounded-full px-3 py-1">
              <AlertTriangle className="w-3 h-3" />
              {language === 'vi' ? 'Tài khoản đang chờ duyệt' : 'Account pending approval'}
            </div>
          )}
        </div>

        {/* Account filter chips */}
        <div className="relative mt-5 flex flex-wrap gap-2">
          {[
            { key: 'all', label: language === 'vi' ? 'Tất cả' : 'All accounts' },
            { key: 'checking', label: language === 'vi' ? 'Thanh toán' : 'Checking' },
            { key: 'savings', label: language === 'vi' ? 'Tiết kiệm' : 'Savings' },
          ].map((chip, i) => (
            <button
              key={chip.key}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition border ${
                i === 0
                  ? 'bg-white text-bank-darkBlue border-white shadow-sm'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick action icons row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Send, label: language === 'vi' ? 'Chuyển' : 'Transfer', id: 'transfer', color: 'from-bank-blue to-bank-lightBlue' },
          { icon: History, label: language === 'vi' ? 'Lịch sử' : 'History', id: 'history', color: 'from-purple-500 to-violet-500' },
          { icon: CreditCard, label: language === 'vi' ? 'Thẻ' : 'Cards', id: 'cards', color: 'from-bank-gold to-amber-500' },
          { icon: QrCode, label: language === 'vi' ? 'QR' : 'QR Pay', id: 'qr', color: 'from-green-500 to-emerald-500' },
        ].map((action) => (
          <button
            key={action.id}
            onClick={() => setActiveTab(action.id)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-950 border border-gray-800 hover:border-bank-lightBlue/40 hover:bg-gray-900/70 transition group"
          >
            <div className={`w-11 h-11 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-medium text-gray-300 text-center leading-tight">{action.label}</span>
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-md bg-gray-950 border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">{language === 'vi' ? 'Giao dịch gần đây' : 'Recent Transactions'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('history')} className="text-bank-lightBlue text-xs">
              {language === 'vi' ? 'Xem tất cả' : 'View all'} →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{language === 'vi' ? 'Chưa có giao dịch nào' : 'No transactions yet'}</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => {
                const isCredit = tx.recipient_id === user!.id;
                return (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCredit ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {isCredit ? <ArrowDownRight className="w-5 h-5 text-green-400" /> : <ArrowUpRight className="w-5 h-5 text-red-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">{isCredit ? tx.sender_account : tx.recipient_name}</p>
                        <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                        {isCredit ? '+' : '-'}{formatVND(tx.amount)}
                      </p>
                      <p className={`text-xs ${tx.status === 'completed' ? 'text-green-400' : tx.status === 'rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                        {tx.status === 'completed' ? (language === 'vi' ? 'Hoàn thành' : 'Completed') :
                         tx.status === 'rejected' ? (language === 'vi' ? 'Từ chối' : 'Rejected') :
                         (language === 'vi' ? 'Đang xử lý' : 'Pending')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const inputClass = "bg-black border-gray-800 text-white placeholder:text-gray-500";
  const labelClass = "text-sm font-medium text-gray-300";

  const renderDomesticForm = () => (
    <div className="space-y-4">
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Tên người nhận' : "Recipient's Full Name"} *</label><Input value={domesticForm.recipientName} onChange={e => setDomesticForm(p => ({...p, recipientName: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Số tài khoản' : 'Account Number'} *</label><Input value={domesticForm.recipientAccount} onChange={e => setDomesticForm(p => ({...p, recipientAccount: e.target.value}))} className={inputClass} placeholder="VTB-XXXXXXXX" /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Tên ngân hàng' : 'Bank Name'} *</label><Input value={domesticForm.bankName} onChange={e => setDomesticForm(p => ({...p, bankName: e.target.value}))} className={inputClass} placeholder="Vietcombank, Techcombank..." /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Chi nhánh' : 'Branch Name'}</label><Input value={domesticForm.branchName} onChange={e => setDomesticForm(p => ({...p, branchName: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Số tiền (VNĐ)' : 'Amount (VND)'} *</label><Input type="number" value={domesticForm.amount} onChange={e => setDomesticForm(p => ({...p, amount: e.target.value}))} className={inputClass} placeholder="0" />
        {account && <p className="text-xs text-gray-400">{language === 'vi' ? 'Số dư khả dụng' : 'Available'}: {formatVND(balance)}</p>}
      </div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Nội dung chuyển khoản' : 'Transfer Description'}</label><Input value={domesticForm.description} onChange={e => setDomesticForm(p => ({...p, description: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2">
        <label className={labelClass}>{language === 'vi' ? 'Phương thức' : 'Transfer Method'}</label>
        <select value={domesticForm.method} onChange={e => setDomesticForm(p => ({...p, method: e.target.value}))} className={`w-full h-10 rounded-md border px-3 ${inputClass}`}>
          <option value="same_bank">{language === 'vi' ? 'Cùng ngân hàng (tức thì)' : 'Same bank (instant)'}</option>
          <option value="napas">{language === 'vi' ? 'Liên ngân hàng (NAPAS)' : 'Interbank (NAPAS)'}</option>
        </select>
      </div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Ngày chuyển' : 'Transfer Date'}</label><Input type="date" value={domesticForm.transferDate} onChange={e => setDomesticForm(p => ({...p, transferDate: e.target.value}))} className={inputClass} /></div>
    </div>
  );

  const renderInternationalForm = () => (
    <div className="space-y-4">
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Tên người nhận' : "Recipient's Full Name"} *</label><Input value={internationalForm.recipientName} onChange={e => setInternationalForm(p => ({...p, recipientName: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Địa chỉ người nhận' : "Recipient's Address"} *</label><Input value={internationalForm.recipientAddress} onChange={e => setInternationalForm(p => ({...p, recipientAddress: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Số tài khoản / IBAN' : 'Account Number / IBAN'} *</label><Input value={internationalForm.recipientAccount} onChange={e => setInternationalForm(p => ({...p, recipientAccount: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Tên ngân hàng' : 'Bank Name'} *</label><Input value={internationalForm.bankName} onChange={e => setInternationalForm(p => ({...p, bankName: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Địa chỉ ngân hàng' : 'Bank Address'}</label><Input value={internationalForm.bankAddress} onChange={e => setInternationalForm(p => ({...p, bankAddress: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>SWIFT/BIC Code *</label><Input value={internationalForm.swiftCode} onChange={e => setInternationalForm(p => ({...p, swiftCode: e.target.value}))} className={inputClass} placeholder="e.g. BFTVVNVX" /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Ngân hàng trung gian' : 'Intermediary Bank'}</label><Input value={internationalForm.intermediaryBank} onChange={e => setInternationalForm(p => ({...p, intermediaryBank: e.target.value}))} className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className={labelClass}>{language === 'vi' ? 'Tiền tệ' : 'Currency'}</label>
          <select value={internationalForm.currency} onChange={e => setInternationalForm(p => ({...p, currency: e.target.value}))} className={`w-full h-10 rounded-md border px-3 ${inputClass}`}>
            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="JPY">JPY</option><option value="VND">VND</option>
          </select>
        </div>
        <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Số tiền' : 'Amount'} *</label><Input type="number" value={internationalForm.amount} onChange={e => setInternationalForm(p => ({...p, amount: e.target.value}))} className={inputClass} placeholder="0" /></div>
      </div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Mục đích chuyển' : 'Transfer Purpose'} *</label><Input value={internationalForm.purpose} onChange={e => setInternationalForm(p => ({...p, purpose: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2">
        <label className={labelClass}>{language === 'vi' ? 'Phí chuyển' : 'Fee Option'}</label>
        <select value={internationalForm.feeOption} onChange={e => setInternationalForm(p => ({...p, feeOption: e.target.value}))} className={`w-full h-10 rounded-md border px-3 ${inputClass}`}>
          <option value="OUR">OUR ({language === 'vi' ? 'Người gửi trả' : 'Sender pays all'})</option>
          <option value="SHA">SHA ({language === 'vi' ? 'Chia sẻ' : 'Shared'})</option>
          <option value="BEN">BEN ({language === 'vi' ? 'Người nhận trả' : 'Receiver pays'})</option>
        </select>
      </div>
    </div>
  );

  const renderWireForm = () => (
    <div className="space-y-4">
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Tên người nhận' : "Recipient's Full Name"} *</label><Input value={wireForm.recipientName} onChange={e => setWireForm(p => ({...p, recipientName: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Số tài khoản' : 'Account Number'} *</label><Input value={wireForm.recipientAccount} onChange={e => setWireForm(p => ({...p, recipientAccount: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Tên ngân hàng' : 'Bank Name'} *</label><Input value={wireForm.bankName} onChange={e => setWireForm(p => ({...p, bankName: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Địa chỉ ngân hàng' : 'Bank Address'}</label><Input value={wireForm.bankAddress} onChange={e => setWireForm(p => ({...p, bankAddress: e.target.value}))} className={inputClass} /></div>
      <div className="space-y-2"><label className={labelClass}>SWIFT/BIC Code *</label><Input value={wireForm.swiftCode} onChange={e => setWireForm(p => ({...p, swiftCode: e.target.value}))} className={inputClass} placeholder="e.g. BFTVVNVX" /></div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Địa chỉ người nhận' : "Recipient's Address"}</label><Input value={wireForm.recipientAddress} onChange={e => setWireForm(p => ({...p, recipientAddress: e.target.value}))} className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className={labelClass}>{language === 'vi' ? 'Tiền tệ' : 'Currency'}</label>
          <select value={wireForm.currency} onChange={e => setWireForm(p => ({...p, currency: e.target.value}))} className={`w-full h-10 rounded-md border px-3 ${inputClass}`}>
            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="JPY">JPY</option><option value="VND">VND</option>
          </select>
        </div>
        <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Số tiền' : 'Amount'} *</label><Input type="number" value={wireForm.amount} onChange={e => setWireForm(p => ({...p, amount: e.target.value}))} className={inputClass} placeholder="0" /></div>
      </div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Mục đích' : 'Payment Purpose'} *</label><Input value={wireForm.purpose} onChange={e => setWireForm(p => ({...p, purpose: e.target.value}))} className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className={labelClass}>{language === 'vi' ? 'Phí' : 'Charges'}</label>
          <select value={wireForm.chargesOption} onChange={e => setWireForm(p => ({...p, chargesOption: e.target.value}))} className={`w-full h-10 rounded-md border px-3 ${inputClass}`}>
            <option value="OUR">OUR</option><option value="SHA">SHA</option><option value="BEN">BEN</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClass}>{language === 'vi' ? 'Loại thực hiện' : 'Execution'}</label>
          <select value={wireForm.executionType} onChange={e => setWireForm(p => ({...p, executionType: e.target.value}))} className={`w-full h-10 rounded-md border px-3 ${inputClass}`}>
            <option value="normal">{language === 'vi' ? 'Thường' : 'Normal'}</option>
            <option value="urgent">{language === 'vi' ? 'Khẩn cấp' : 'Urgent'}</option>
          </select>
        </div>
      </div>
      <div className="space-y-2"><label className={labelClass}>{language === 'vi' ? 'Ngày chuyển' : 'Transfer Date'}</label><Input type="date" value={wireForm.transferDate} onChange={e => setWireForm(p => ({...p, transferDate: e.target.value}))} className={inputClass} /></div>
    </div>
  );

  const renderTransfer = () => (
    <div className="max-w-2xl mx-auto">
      {transferStep === 'form' && (
        <Card className="border-0 shadow-md bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white"><Send className="w-5 h-5 text-bank-lightBlue" />{language === 'vi' ? 'Chuyển tiền' : 'Transfer'}</CardTitle>
            {profile?.transfer_blocked && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-sm mt-2">
                <AlertTriangle className="w-4 h-4" />
                {language === 'vi' ? 'Chuyển tiền đã bị chặn. Vui lòng liên hệ ngân hàng.' : 'Transfer blocked. Please contact the bank.'}
              </div>
            )}
            {!profile?.transfer_blocked && !profile?.is_approved && (
              <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 p-3 rounded-lg text-sm mt-2">
                <AlertTriangle className="w-4 h-4" />
                {language === 'vi' ? 'Tài khoản chưa được duyệt. Bạn không thể chuyển tiền.' : 'Account not approved. You cannot transfer.'}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={transferType} onValueChange={(v) => setTransferType(v as any)}>
              <TabsList className="w-full bg-gray-900 border border-gray-800 p-1 h-auto grid grid-cols-3 gap-1">
                <TabsTrigger
                  value="domestic"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-bank-darkBlue data-[state=active]:to-bank-blue data-[state=active]:text-white data-[state=active]:shadow-md text-gray-400 text-xs sm:text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'vi' ? 'Nội địa' : 'Domestic'}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="international"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-bank-darkBlue data-[state=active]:to-bank-blue data-[state=active]:text-white data-[state=active]:shadow-md text-gray-400 text-xs sm:text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'vi' ? 'Quốc tế' : 'International'}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="wire"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-bank-darkBlue data-[state=active]:to-bank-blue data-[state=active]:text-white data-[state=active]:shadow-md text-gray-400 text-xs sm:text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Wire / TT</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-5 rounded-xl border border-gray-800 bg-gray-900/40 p-4 sm:p-5">
                <TabsContent value="domestic" className="mt-0">{renderDomesticForm()}</TabsContent>
                <TabsContent value="international" className="mt-0">{renderInternationalForm()}</TabsContent>
                <TabsContent value="wire" className="mt-0">{renderWireForm()}</TabsContent>
              </div>
            </Tabs>
            <Button onClick={handleTransferSubmit} disabled={!profile?.is_approved || profile?.transfer_blocked}
              className="w-full h-11 bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white font-semibold">
              <Send className="w-4 h-4 mr-2" />{language === 'vi' ? 'Tiếp tục' : 'Continue'}
            </Button>
          </CardContent>
        </Card>
      )}

      {transferStep === 'pin' && (
        <Card className="border-0 shadow-md bg-gray-950 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center text-white">
              <Lock className="w-5 h-5 text-bank-lightBlue" />
              {language === 'vi' ? 'Nhập mã PIN' : 'Enter PIN'}
            </CardTitle>
            <p className="text-sm text-gray-400 text-center mt-2">
              {language === 'vi' ? 'Nhập mã PIN 6 chữ số để xác nhận giao dịch' : 'Enter your 6-digit PIN to confirm the transaction'}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">{language === 'vi' ? 'Người nhận' : 'Recipient'}:</span><span className="font-medium text-white">{getCurrentTransferData().recipientName}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">{language === 'vi' ? 'Tài khoản' : 'Account'}:</span><span className="font-medium text-white">{getCurrentTransferData().recipientAccount}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">{language === 'vi' ? 'Số tiền' : 'Amount'}:</span><span className="font-bold text-bank-lightBlue">{formatVND(parseInt(getCurrentTransferData().amount || '0'))}</span></div>
            </div>
            <div className="flex justify-center">
              <Input type="password" maxLength={6} value={pinCode} onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em] h-14 w-48 font-mono bg-gray-900 border-gray-600 text-white"
                placeholder="••••••" autoFocus />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setTransferStep('form'); setPinCode(''); }} className="flex-1 border-gray-600 text-gray-300">
                {language === 'vi' ? 'Quay lại' : 'Back'}
              </Button>
              <Button onClick={handlePinVerify} disabled={transferLoading || pinCode.length !== 6}
                className="flex-1 bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white">
                {transferLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                  <>{language === 'vi' ? 'Xác nhận' : 'Confirm'}</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {transferStep === 'receipt' && lastReceipt && (
        <Card className="border-0 shadow-md bg-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div ref={receiptRef}>
              <div className="header text-center border-b-2 border-bank-blue pb-4 mb-6">
                <h2 className="text-xl font-bold text-white">Việt Trust Bank</h2>
                <p className="text-sm text-gray-400 mt-1">{language === 'vi' ? 'Biên Lai Giao Dịch' : 'Transaction Receipt'}</p>
              </div>
              <div className="text-center my-6">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatVND(lastReceipt.amount)}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                  {language === 'vi' ? 'Đang xử lý' : 'Processing'}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  [language === 'vi' ? 'Loại chuyển' : 'Type', lastReceipt.transferType === 'domestic' ? (language === 'vi' ? 'Nội địa' : 'Domestic') : lastReceipt.transferType === 'international' ? (language === 'vi' ? 'Quốc tế' : 'International') : 'Wire/TT'],
                  [language === 'vi' ? 'Mã giao dịch' : 'Reference', lastReceipt.reference_number],
                  [language === 'vi' ? 'Người gửi' : 'Sender', lastReceipt.senderName],
                  [language === 'vi' ? 'TK gửi' : 'From Account', lastReceipt.senderAccount],
                  [language === 'vi' ? 'Người nhận' : 'Recipient', lastReceipt.recipient_name],
                  [language === 'vi' ? 'TK nhận' : 'To Account', lastReceipt.recipient_account],
                  [language === 'vi' ? 'Thời gian' : 'Date', lastReceipt.date],
                ].map(([label, value], i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-800/50">
                    <span className="text-gray-400">{label}</span>
                    <span className="font-medium text-white font-mono">{value}</span>
                  </div>
                ))}
              </div>
              <div className="footer text-center mt-6 text-xs text-gray-500">
                <p>Việt Trust Bank © 2026</p>
                <p>{language === 'vi' ? 'Cảm ơn bạn đã sử dụng dịch vụ' : 'Thank you for using our service'}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={handlePrintReceipt} className="flex-1 border-gray-600 text-gray-300">
                <Printer className="w-4 h-4 mr-2" /> {language === 'vi' ? 'In biên lai' : 'Print Receipt'}
              </Button>
              <Button onClick={resetTransfer} className="flex-1 bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white">
                {language === 'vi' ? 'Giao dịch mới' : 'New Transfer'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderHistory = () => (
    <Card className="border-0 shadow-md bg-gray-950 border-gray-800">
      <CardHeader><CardTitle className="flex items-center gap-2 text-white"><History className="w-5 h-5 text-bank-lightBlue" />{language === 'vi' ? 'Lịch sử giao dịch' : 'Transaction History'}</CardTitle></CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-400 py-8">{language === 'vi' ? 'Chưa có giao dịch nào' : 'No transactions yet'}</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const isCredit = tx.recipient_id === user!.id;
              return (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCredit ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {isCredit ? <ArrowDownRight className="w-5 h-5 text-green-400" /> : <ArrowUpRight className="w-5 h-5 text-red-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{isCredit ? tx.sender_account : tx.recipient_name}</p>
                      <p className="text-xs text-gray-400">{tx.reference_number} · {new Date(tx.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                      {isCredit ? '+' : '-'}{formatVND(tx.amount)}
                    </p>
                    <p className={`text-xs ${tx.status === 'completed' ? 'text-green-400' : tx.status === 'rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                      {tx.status === 'completed' ? (language === 'vi' ? 'Hoàn thành' : 'Completed') :
                       tx.status === 'rejected' ? (language === 'vi' ? 'Từ chối' : 'Rejected') :
                       (language === 'vi' ? 'Đang xử lý' : 'Pending')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCards = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-bank-darkBlue via-bank-blue to-bank-lightBlue p-6 text-white relative">
          <div className="absolute top-4 right-4 opacity-20"><CreditCard className="w-20 h-20" /></div>
          <p className="text-sm text-white/70 mb-4">Việt Trust Bank</p>
          <p className="text-xl font-mono tracking-widest mb-6">•••• •••• •••• {accountNumber.slice(-4)}</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-white/60">{language === 'vi' ? 'Chủ thẻ' : 'Card Holder'}</p>
              <p className="font-semibold">{displayName.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">{language === 'vi' ? 'Hết hạn' : 'Expires'}</p>
              <p className="font-semibold">12/28</p>
            </div>
            <p className="text-lg font-bold">VISA</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderQRPayment = () => (
    <Card className="border-0 shadow-md bg-gray-950 border-gray-800 max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><QrCode className="w-5 h-5 text-bank-lightBlue" />{language === 'vi' ? 'QR Thanh Toán' : 'QR Payment'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-4">{language === 'vi' ? 'Quét mã QR để nhận thanh toán' : 'Scan QR code to receive payment'}</p>
          <div className="bg-white p-6 rounded-2xl inline-block">
            <QRCodeSVG
              value={JSON.stringify({ bank: 'VietTrustBank', account: accountNumber, name: displayName })}
              size={200}
              level="H"
              includeMargin
            />
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-white font-semibold">{displayName}</p>
            <p className="text-gray-400 text-sm font-mono">{accountNumber}</p>
            <p className="text-gray-500 text-xs">Việt Trust Bank</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderProfile = () => (
    <Card className="border-0 shadow-md max-w-lg mx-auto bg-gray-950 border-gray-800">
      <CardHeader><CardTitle className="flex items-center gap-2 text-white"><User className="w-5 h-5 text-bank-lightBlue" />{language === 'vi' ? 'Hồ sơ' : 'Profile'}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-bank-blue to-bank-lightBlue rounded-full flex items-center justify-center text-white text-2xl font-bold">{userInitial}</div>
          <div>
            <h3 className="font-semibold text-lg text-white">{displayName}</h3>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${profile?.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {profile?.is_approved ? (language === 'vi' ? 'Đã duyệt' : 'Approved') : (language === 'vi' ? 'Chờ duyệt' : 'Pending')}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">{language === 'vi' ? 'Số tài khoản' : 'Account Number'}</label>
            <Input value={accountNumber} readOnly className="bg-gray-900 border-gray-600 text-white" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">{t('auth.full_name')}</label>
            <Input defaultValue={profile?.full_name || ''} readOnly className="bg-gray-900 border-gray-600 text-white" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">{t('auth.phone')}</label>
            <Input defaultValue={profile?.phone || ''} readOnly className="bg-gray-900 border-gray-600 text-white" />
          </div>
        </div>

        {/* PIN Setup section within profile */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2"><KeyRound className="w-4 h-4 text-bank-lightBlue" />{language === 'vi' ? 'Mã PIN chuyển tiền' : 'Transfer PIN'}</h4>
          {hasPin && !showPinSetup ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-green-400" /></div>
              <div>
                <p className="text-sm text-white">{language === 'vi' ? 'Mã PIN đã được thiết lập' : 'PIN has been set up'}</p>
                <button onClick={() => setShowPinSetup(true)} className="text-xs text-bank-lightBlue hover:underline">{language === 'vi' ? 'Đổi mã PIN' : 'Change PIN'}</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">{language === 'vi' ? 'Thiết lập mã PIN 6 chữ số để xác nhận giao dịch.' : 'Set up a 6-digit PIN to confirm transactions.'}</p>
              <div className="space-y-2"><label className="text-sm text-gray-300">{language === 'vi' ? 'Mã PIN mới' : 'New PIN'}</label>
                <Input type="password" maxLength={6} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-xl tracking-[0.3em] font-mono bg-gray-900 border-gray-600 text-white" placeholder="••••••" />
              </div>
              <div className="space-y-2"><label className="text-sm text-gray-300">{language === 'vi' ? 'Xác nhận mã PIN' : 'Confirm PIN'}</label>
                <Input type="password" maxLength={6} value={confirmNewPin} onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-xl tracking-[0.3em] font-mono bg-gray-900 border-gray-600 text-white" placeholder="••••••" />
              </div>
              <Button onClick={handleSetPin} className="w-full bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white">{language === 'vi' ? 'Lưu mã PIN' : 'Save PIN'}</Button>
              {hasPin && <Button variant="ghost" onClick={() => setShowPinSetup(false)} className="w-full text-gray-400">{language === 'vi' ? 'Hủy' : 'Cancel'}</Button>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-bank-blue/30 border-t-bank-blue rounded-full animate-spin" /></div>;
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'transfer': return renderTransfer();
      case 'history': return renderHistory();
      case 'cards': return renderCards();
      case 'qr': return renderQRPayment();
      case 'profile': return renderProfile();
      default: return renderOverview();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        <Sidebar className="border-r border-gray-900 bg-black [&>div]:bg-black">
          <SidebarHeader className="p-4 border-b border-gray-900 bg-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-bank-gold to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">VTB</div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-white truncate">Việt Trust Bank</p>
                <p className="text-xs text-gray-500 truncate">{displayName}</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-3 bg-black">
            <SidebarMenuContent menuItems={menuItems} activeTab={activeTab} onSelectTab={setActiveTab} />
          </SidebarContent>
          <div className="p-3 border-t border-gray-900 bg-black space-y-1">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} className="w-full justify-start text-sm text-gray-300 hover:bg-gray-900 hover:text-white">
              <Globe className="w-4 h-4 mr-2" /> {language === 'vi' ? 'English' : 'Tiếng Việt'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-sm text-red-400 hover:text-red-300 hover:bg-red-950/40">
              <LogOut className="w-4 h-4 mr-2" /> {language === 'vi' ? 'Đăng xuất' : 'Logout'}
            </Button>
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 bg-black">
          <header className="sticky top-0 z-10 bg-black/95 backdrop-blur-md border-b border-gray-900 px-4 sm:px-6 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger className="text-gray-300 hover:text-white shrink-0" />
                <div className="hidden sm:flex w-9 h-9 bg-gradient-to-br from-bank-gold to-amber-500 rounded-lg items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                  VTB
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold text-white truncate leading-tight">
                    {menuItems.find(m => m.id === activeTab)?.title || 'Overview'}
                  </h1>
                  <p className="text-[11px] text-gray-500 truncate hidden sm:block">Việt Trust Bank · {language === 'vi' ? 'Ngân hàng số' : 'Digital Banking'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-gray-900 h-9 w-9">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-bank-gold rounded-full" />
                </Button>
                <div className="w-9 h-9 bg-gradient-to-br from-bank-blue to-bank-lightBlue rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-gray-900">
                  {userInitial}
                </div>
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">{renderContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldAlert, Phone, Mail } from 'lucide-react';

const AccountLocked = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">
          {language === 'vi' ? 'Tài Khoản Bị Khóa' : 'Account Locked'}
        </h1>
        <p className="text-lg text-red-400 font-semibold">
          {language === 'vi'
            ? 'Hoạt Động Đáng Ngờ Được Phát Hiện'
            : 'Suspicious Activity Detected'}
        </p>
        <p className="text-gray-400">
          {language === 'vi'
            ? 'Tài khoản của bạn đã bị khóa do phát hiện hoạt động đáng ngờ. Vui lòng liên hệ bộ phận hỗ trợ để được giải quyết.'
            : 'Your account has been locked due to suspicious activity. Please contact support for assistance.'}
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 text-left">
          <h3 className="text-white font-semibold text-center">
            {language === 'vi' ? 'Liên Hệ Hỗ Trợ' : 'Contact Support'}
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">{language === 'vi' ? 'Hotline' : 'Hotline'}</p>
              <p className="text-white font-medium">1900-xxxx-xxx</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Email</p>
              <p className="text-white font-medium">support@viettrusttaichinh.online</p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-xs">
          Việt Trust Bank © 2026
        </p>
      </div>
    </div>
  );
};

export default AccountLocked;

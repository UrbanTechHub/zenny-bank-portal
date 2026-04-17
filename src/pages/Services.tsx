import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Wallet, Landmark, CreditCard, BanknoteIcon, PiggyBank, ShieldCheck,
  Smartphone, DollarSign, Building, HomeIcon, Car, ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { language } = useLanguage();

  const personalServices = [
    { title: language === 'vi' ? 'Tài Khoản Ngân Hàng' : 'Bank Accounts', desc: language === 'vi' ? 'Các loại tài khoản linh hoạt với lãi suất cạnh tranh.' : 'Flexible accounts with competitive interest rates.', icon: Wallet, color: 'from-bank-blue to-bank-lightBlue' },
    { title: language === 'vi' ? 'Thẻ Tín Dụng' : 'Credit Cards', desc: language === 'vi' ? 'Thẻ tín dụng với các ưu đãi hấp dẫn và hoàn tiền.' : 'Credit cards with attractive rewards and cashback.', icon: CreditCard, color: 'from-bank-gold to-amber-300' },
    { title: language === 'vi' ? 'Vay Cá Nhân' : 'Personal Loans', desc: language === 'vi' ? 'Các khoản vay với lãi suất thấp và thủ tục đơn giản.' : 'Loans with low interest rates and simple procedures.', icon: BanknoteIcon, color: 'from-red-500 to-rose-300' },
    { title: language === 'vi' ? 'Vay Mua Nhà' : 'Mortgage', desc: language === 'vi' ? 'Giải pháp tài chính linh hoạt cho ngôi nhà mơ ước.' : 'Flexible financing for your dream home.', icon: HomeIcon, color: 'from-emerald-500 to-green-300' },
    { title: language === 'vi' ? 'Vay Mua Xe' : 'Auto Loans', desc: language === 'vi' ? 'Vay mua xe với lãi suất ưu đãi.' : 'Auto loans with preferential rates.', icon: Car, color: 'from-purple-500 to-violet-300' },
    { title: language === 'vi' ? 'Tiết Kiệm' : 'Savings', desc: language === 'vi' ? 'Chương trình tiết kiệm với lãi suất hấp dẫn.' : 'Savings programs with attractive interest rates.', icon: PiggyBank, color: 'from-pink-500 to-rose-300' },
  ];

  const businessServices = [
    { title: language === 'vi' ? 'Tài Khoản Doanh Nghiệp' : 'Business Accounts', desc: language === 'vi' ? 'Giải pháp tài khoản cho mọi quy mô doanh nghiệp.' : 'Account solutions for businesses of all sizes.', icon: Building, color: 'from-indigo-500 to-blue-300' },
    { title: language === 'vi' ? 'Vay Kinh Doanh' : 'Business Loans', desc: language === 'vi' ? 'Vốn cho sự phát triển doanh nghiệp.' : 'Capital for business growth.', icon: DollarSign, color: 'from-amber-500 to-yellow-300' },
    { title: language === 'vi' ? 'Thanh Toán Doanh Nghiệp' : 'Business Payments', desc: language === 'vi' ? 'Giải pháp thanh toán hiệu quả cho doanh nghiệp.' : 'Efficient payment solutions for businesses.', icon: Landmark, color: 'from-teal-500 to-cyan-300' },
    { title: language === 'vi' ? 'Bảo Mật Giao Dịch' : 'Transaction Security', desc: language === 'vi' ? 'Bảo mật tối đa cho mọi giao dịch.' : 'Maximum security for all transactions.', icon: ShieldCheck, color: 'from-green-500 to-emerald-300' },
    { title: language === 'vi' ? 'Ngân Hàng Di Động' : 'Mobile Banking', desc: language === 'vi' ? 'Quản lý tài chính mọi lúc, mọi nơi.' : 'Manage finances anytime, anywhere.', icon: Smartphone, color: 'from-cyan-500 to-sky-300' },
    { title: language === 'vi' ? 'Quản Lý Tài Sản' : 'Asset Management', desc: language === 'vi' ? 'Dịch vụ quản lý tài sản chuyên nghiệp.' : 'Professional asset management services.', icon: Wallet, color: 'from-orange-500 to-amber-300' },
  ];

  const ServiceCard = ({ title, desc, icon: Icon, color }: { title: string; desc: string; icon: any; color: string }) => (
    <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-bank-blue/20 hover:-translate-y-1">
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-bold text-bank-darkBlue mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{desc}</p>
      <button className="flex items-center gap-1 text-bank-blue text-sm font-medium hover:gap-2 transition-all">
        {language === 'vi' ? 'Tìm Hiểu Thêm' : 'Learn More'} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-bank-darkBlue via-bank-blue to-bank-darkBlue text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-bank-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'vi' ? 'Dịch Vụ Của Chúng Tôi' : 'Our Services'}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {language === 'vi'
              ? 'Giải pháp tài chính toàn diện cho cá nhân và doanh nghiệp'
              : 'Comprehensive financial solutions for individuals and businesses'}
          </p>
        </div>
      </section>

      {/* Personal Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-bank-darkBlue text-center mb-3">
            {language === 'vi' ? 'Dịch Vụ Cá Nhân' : 'Personal Services'}
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            {language === 'vi' ? 'Đáp ứng mọi nhu cầu tài chính cá nhân của bạn' : 'Meeting all your personal financial needs'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalServices.map((s) => <ServiceCard key={s.title} {...s} />)}
          </div>
        </div>
      </section>

      {/* Business Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-bank-darkBlue text-center mb-3">
            {language === 'vi' ? 'Dịch Vụ Doanh Nghiệp' : 'Business Services'}
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            {language === 'vi' ? 'Giải pháp tài chính chuyên nghiệp cho doanh nghiệp' : 'Professional financial solutions for businesses'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessServices.map((s) => <ServiceCard key={s.title} {...s} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;

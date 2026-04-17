import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.home': { vi: 'Trang Chủ', en: 'Home' },
  'nav.services': { vi: 'Dịch Vụ', en: 'Services' },
  'nav.about': { vi: 'Về Chúng Tôi', en: 'About Us' },
  'nav.contact': { vi: 'Liên Hệ', en: 'Contact' },
  'nav.signup': { vi: 'Đăng Ký', en: 'Sign Up' },
  'nav.login': { vi: 'Đăng Nhập', en: 'Login' },
  'nav.dashboard': { vi: 'Bảng Điều Khiển', en: 'Dashboard' },
  'nav.logout': { vi: 'Đăng Xuất', en: 'Logout' },

  // Hero
  'hero.title': { vi: 'Ngân Hàng Số Hiện Đại', en: 'Modern Digital Banking' },
  'hero.subtitle': { vi: 'Giải pháp tài chính thông minh cho cuộc sống hiện đại. An toàn, nhanh chóng và tiện lợi.', en: 'Smart financial solutions for modern life. Safe, fast, and convenient.' },
  'hero.cta': { vi: 'Bắt Đầu Ngay', en: 'Get Started' },
  'hero.learn': { vi: 'Tìm Hiểu Thêm', en: 'Learn More' },

  // Services
  'services.title': { vi: 'Dịch Vụ Của Chúng Tôi', en: 'Our Services' },
  'services.subtitle': { vi: 'Giải pháp tài chính toàn diện', en: 'Comprehensive financial solutions' },
  'services.savings': { vi: 'Tiết Kiệm', en: 'Savings' },
  'services.savings.desc': { vi: 'Lãi suất hấp dẫn, linh hoạt kỳ hạn', en: 'Attractive interest rates, flexible terms' },
  'services.loans': { vi: 'Cho Vay', en: 'Loans' },
  'services.loans.desc': { vi: 'Vay cá nhân, vay mua nhà, vay kinh doanh', en: 'Personal loans, mortgages, business loans' },
  'services.cards': { vi: 'Thẻ Ngân Hàng', en: 'Bank Cards' },
  'services.cards.desc': { vi: 'Thẻ tín dụng, thẻ ghi nợ quốc tế', en: 'Credit cards, international debit cards' },
  'services.transfer': { vi: 'Chuyển Tiền', en: 'Money Transfer' },
  'services.transfer.desc': { vi: 'Chuyển tiền nhanh, phí thấp', en: 'Fast transfers, low fees' },
  'services.investment': { vi: 'Đầu Tư', en: 'Investment' },
  'services.investment.desc': { vi: 'Quỹ đầu tư, trái phiếu, chứng khoán', en: 'Funds, bonds, securities' },
  'services.insurance': { vi: 'Bảo Hiểm', en: 'Insurance' },
  'services.insurance.desc': { vi: 'Bảo hiểm nhân thọ, phi nhân thọ', en: 'Life and non-life insurance' },

  // Advantages
  'advantages.title': { vi: 'Tại Sao Chọn Chúng Tôi', en: 'Why Choose Us' },
  'advantages.security': { vi: 'Bảo Mật Tối Đa', en: 'Maximum Security' },
  'advantages.security.desc': { vi: 'Công nghệ mã hóa tiên tiến bảo vệ mọi giao dịch', en: 'Advanced encryption technology protects every transaction' },
  'advantages.speed': { vi: 'Giao Dịch Nhanh Chóng', en: 'Fast Transactions' },
  'advantages.speed.desc': { vi: 'Xử lý giao dịch trong vài giây', en: 'Process transactions in seconds' },
  'advantages.support': { vi: 'Hỗ Trợ 24/7', en: '24/7 Support' },
  'advantages.support.desc': { vi: 'Đội ngũ hỗ trợ luôn sẵn sàng phục vụ', en: 'Support team always ready to serve' },
  'advantages.network': { vi: 'Mạng Lưới Rộng Khắp', en: 'Wide Network' },
  'advantages.network.desc': { vi: 'Hơn 500 chi nhánh và 2000 ATM trên toàn quốc', en: 'Over 500 branches and 2000 ATMs nationwide' },

  // Mobile Banking
  'mobile.title': { vi: 'Ngân Hàng Di Động', en: 'Mobile Banking' },
  'mobile.subtitle': { vi: 'Quản lý tài chính ngay trên điện thoại', en: 'Manage finances right on your phone' },
  'mobile.feature1': { vi: 'Chuyển tiền nhanh chóng', en: 'Quick money transfer' },
  'mobile.feature2': { vi: 'Thanh toán hóa đơn', en: 'Bill payment' },
  'mobile.feature3': { vi: 'Quản lý tài khoản', en: 'Account management' },
  'mobile.feature4': { vi: 'Theo dõi chi tiêu', en: 'Expense tracking' },

  // Testimonials
  'testimonials.title': { vi: 'Khách Hàng Nói Gì', en: 'What Customers Say' },

  // News
  'news.title': { vi: 'Tin Tức & Ưu Đãi', en: 'News & Offers' },
  'news.readmore': { vi: 'Đọc Thêm', en: 'Read More' },

  // CTA
  'cta.title': { vi: 'Bắt Đầu Hành Trình Tài Chính', en: 'Start Your Financial Journey' },
  'cta.subtitle': { vi: 'Mở tài khoản miễn phí ngay hôm nay', en: 'Open a free account today' },
  'cta.button': { vi: 'Mở Tài Khoản', en: 'Open Account' },

  // Footer
  'footer.about': { vi: 'Về Việt Trust', en: 'About Viet Trust' },
  'footer.about.desc': { vi: 'Ngân hàng Việt Trust - Đối tác tài chính đáng tin cậy của bạn', en: 'Viet Trust Bank - Your trusted financial partner' },
  'footer.services': { vi: 'Dịch Vụ', en: 'Services' },
  'footer.support': { vi: 'Hỗ Trợ', en: 'Support' },
  'footer.legal': { vi: 'Pháp Lý', en: 'Legal' },
  'footer.copyright': { vi: '© 2024 Ngân hàng Việt Trust. Bảo lưu mọi quyền.', en: '© 2024 Viet Trust Bank. All rights reserved.' },

  // Auth
  'auth.login.title': { vi: 'Đăng Nhập', en: 'Login' },
  'auth.login.subtitle': { vi: 'Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.', en: 'Welcome back! Please login to your account.' },
  'auth.signup.title': { vi: 'Đăng Ký Tài Khoản', en: 'Create Account' },
  'auth.signup.subtitle': { vi: 'Mở tài khoản ngân hàng trực tuyến', en: 'Open your online bank account' },
  'auth.email': { vi: 'Email', en: 'Email' },
  'auth.password': { vi: 'Mật Khẩu', en: 'Password' },
  'auth.confirm_password': { vi: 'Xác Nhận Mật Khẩu', en: 'Confirm Password' },
  'auth.full_name': { vi: 'Họ và Tên', en: 'Full Name' },
  'auth.phone': { vi: 'Số Điện Thoại', en: 'Phone Number' },
  'auth.address': { vi: 'Địa Chỉ', en: 'Address' },
  'auth.occupation': { vi: 'Nghề Nghiệp', en: 'Occupation' },
  'auth.account_type': { vi: 'Loại Tài Khoản', en: 'Account Type' },
  'auth.date_of_birth': { vi: 'Ngày Sinh', en: 'Date of Birth' },
  'auth.forgot_password': { vi: 'Quên mật khẩu?', en: 'Forgot password?' },
  'auth.no_account': { vi: 'Chưa có tài khoản?', en: "Don't have an account?" },
  'auth.has_account': { vi: 'Đã có tài khoản?', en: 'Already have an account?' },
  'auth.reset_password': { vi: 'Đặt Lại Mật Khẩu', en: 'Reset Password' },
  'auth.reset_subtitle': { vi: 'Nhập email để nhận link đặt lại mật khẩu', en: 'Enter your email to receive a password reset link' },
  'auth.new_password': { vi: 'Mật Khẩu Mới', en: 'New Password' },
  'auth.send_reset': { vi: 'Gửi Link Đặt Lại', en: 'Send Reset Link' },
  'auth.back_login': { vi: 'Quay lại đăng nhập', en: 'Back to login' },
  'auth.signup_success': { vi: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.', en: 'Sign up successful! Please check your email to verify.' },
  'auth.login_success': { vi: 'Đăng nhập thành công!', en: 'Login successful!' },
  'auth.savings_account': { vi: 'Tài Khoản Tiết Kiệm', en: 'Savings Account' },
  'auth.checking_account': { vi: 'Tài Khoản Thanh Toán', en: 'Checking Account' },
  'auth.business_account': { vi: 'Tài Khoản Doanh Nghiệp', en: 'Business Account' },

  // Dashboard
  'dashboard.welcome': { vi: 'Xin chào', en: 'Welcome' },
  'dashboard.overview': { vi: 'Tổng Quan', en: 'Overview' },
  'dashboard.accounts': { vi: 'Tài Khoản', en: 'Accounts' },
  'dashboard.transactions': { vi: 'Giao Dịch', en: 'Transactions' },
  'dashboard.settings': { vi: 'Cài Đặt', en: 'Settings' },
  'dashboard.balance': { vi: 'Số Dư', en: 'Balance' },
  'dashboard.total_balance': { vi: 'Tổng Số Dư', en: 'Total Balance' },
  'dashboard.recent_transactions': { vi: 'Giao Dịch Gần Đây', en: 'Recent Transactions' },
  'dashboard.quick_actions': { vi: 'Thao Tác Nhanh', en: 'Quick Actions' },
  'dashboard.profile': { vi: 'Hồ Sơ', en: 'Profile' },
  'dashboard.transfer': { vi: 'Chuyển Tiền', en: 'Transfer' },
  'dashboard.history': { vi: 'Lịch Sử', en: 'History' },
  'dashboard.cards': { vi: 'Thẻ Ảo', en: 'Virtual Cards' },
  'dashboard.deposit': { vi: 'Nạp Tiền', en: 'Deposit' },
  'dashboard.pay_bills': { vi: 'Thanh Toán', en: 'Pay Bills' },
  'dashboard.savings': { vi: 'Tiết Kiệm', en: 'Savings' },
  'dashboard.logout': { vi: 'Đăng Xuất', en: 'Logout' },
  'dashboard.checking': { vi: 'Tài Khoản Thanh Toán', en: 'Checking Account' },
  'dashboard.saving': { vi: 'Tài Khoản Tiết Kiệm', en: 'Savings Account' },

  // Admin
  'admin.title': { vi: 'Quản Trị Hệ Thống', en: 'System Administration' },
  'admin.login.title': { vi: 'Cổng Quản Trị', en: 'Admin Portal' },
  'admin.login.subtitle': { vi: 'Đăng nhập vào bảng điều khiển quản trị', en: 'Access the admin dashboard' },
  'admin.users': { vi: 'Quản Lý Người Dùng', en: 'User Management' },
  'admin.transactions': { vi: 'Quản Lý Giao Dịch', en: 'Transaction Management' },
  'admin.deposits': { vi: 'Quản Lý Nạp Tiền', en: 'Deposit Management' },
  'admin.content': { vi: 'Quản Lý Nội Dung', en: 'Content Management' },
  'admin.settings': { vi: 'Cài Đặt Hệ Thống', en: 'System Settings' },
  'admin.total_users': { vi: 'Tổng Người Dùng', en: 'Total Users' },
  'admin.active_users': { vi: 'Người Dùng Hoạt Động', en: 'Active Users' },
  'admin.total_transactions': { vi: 'Tổng Giao Dịch', en: 'Total Transactions' },
  'admin.revenue': { vi: 'Doanh Thu', en: 'Revenue' },
  'admin.pending': { vi: 'Đang Chờ', en: 'Pending' },
  'admin.approved': { vi: 'Đã Duyệt', en: 'Approved' },
  'admin.rejected': { vi: 'Từ Chối', en: 'Rejected' },
  'admin.username': { vi: 'Tên Đăng Nhập', en: 'Username' },

  // About
  'about.title': { vi: 'Về Chúng Tôi', en: 'About Us' },
  'about.story': { vi: 'Câu Chuyện Của Chúng Tôi', en: 'Our Story' },
  'about.vision': { vi: 'Tầm Nhìn', en: 'Our Vision' },
  'about.mission': { vi: 'Sứ Mệnh', en: 'Our Mission' },

  // Contact
  'contact.title': { vi: 'Liên Hệ Với Chúng Tôi', en: 'Contact Us' },
  'contact.subtitle': { vi: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn', en: 'We are always ready to help you' },
  'contact.send': { vi: 'Gửi Tin Nhắn', en: 'Send Message' },
  'contact.name': { vi: 'Họ và Tên', en: 'Full Name' },
  'contact.subject': { vi: 'Chủ Đề', en: 'Subject' },
  'contact.message': { vi: 'Tin Nhắn', en: 'Message' },

  // Services page
  'services.personal': { vi: 'Dịch Vụ Cá Nhân', en: 'Personal Services' },
  'services.business': { vi: 'Dịch Vụ Doanh Nghiệp', en: 'Business Services' },
  'services.learn_more': { vi: 'Tìm Hiểu Thêm', en: 'Learn More' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

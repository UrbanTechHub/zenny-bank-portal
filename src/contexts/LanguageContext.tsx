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

  // Hero (extra)
  'hero.badge': { vi: 'Dịch Vụ Ngân Hàng Hàng Đầu Việt Nam', en: "Vietnam's Leading Banking Service" },
  'hero.h1.line1': { vi: 'Tương Lai Tài Chính', en: 'The Future of Finance' },
  'hero.h1.line2': { vi: 'Bắt Đầu Từ Đây', en: 'Starts Here' },
  'hero.desc': { vi: 'Trải nghiệm thế hệ ngân hàng tiếp theo với công nghệ tiên tiến và dịch vụ cá nhân hóa phù hợp với nhu cầu của bạn.', en: 'Experience the next generation of banking with advanced technology and personalized services tailored to your needs.' },
  'hero.openAccount': { vi: 'Mở Tài Khoản', en: 'Open Account' },
  'hero.exploreServices': { vi: 'Khám Phá Dịch Vụ', en: 'Explore Services' },
  'hero.feature.online': { vi: 'Ngân Hàng Trực Tuyến', en: 'Online Banking' },
  'hero.feature.invest': { vi: 'Giải Pháp Đầu Tư', en: 'Investment Solutions' },
  'hero.feature.secure': { vi: 'Giao Dịch An Toàn', en: 'Secure Transactions' },
  'hero.feature.forex': { vi: 'Ngoại Hối', en: 'Foreign Exchange' },
  'hero.card.tier': { vi: 'Việt Trust Cao Cấp', en: 'Viet Trust Premium' },
  'hero.card.name': { vi: 'Thẻ Visa Vàng', en: 'Gold Visa Card' },
  'hero.card.number': { vi: 'Số Thẻ', en: 'Card Number' },
  'hero.card.holder': { vi: 'Chủ Thẻ', en: 'Card Holder' },
  'hero.card.expires': { vi: 'Hết Hạn', en: 'Expires' },
  'hero.card.platinum': { vi: 'Bạch Kim', en: 'Platinum' },

  // Services section (extra)
  'svc.label': { vi: 'Dịch Vụ Của Chúng Tôi', en: 'Our Services' },
  'svc.heading': { vi: 'Giải Pháp Tài Chính Toàn Diện', en: 'Comprehensive Financial Solutions' },
  'svc.subheading': { vi: 'Chúng tôi cung cấp đầy đủ các dịch vụ ngân hàng để đáp ứng mọi nhu cầu tài chính của bạn.', en: 'We provide a full range of banking services to meet all your financial needs.' },
  'svc.learnMore': { vi: 'Tìm hiểu thêm', en: 'Learn more' },
  'svc.viewAll': { vi: 'Xem Tất Cả Dịch Vụ', en: 'View All Services' },
  'svc.personal.title': { vi: 'Ngân Hàng Cá Nhân', en: 'Personal Banking' },
  'svc.personal.desc': { vi: 'Giải pháp tài chính toàn diện cho nhu cầu cá nhân của bạn.', en: 'Comprehensive financial solutions for your personal needs.' },
  'svc.business.title': { vi: 'Ngân Hàng Doanh Nghiệp', en: 'Business Banking' },
  'svc.business.desc': { vi: 'Hỗ trợ doanh nghiệp phát triển với các giải pháp linh hoạt.', en: 'Helping businesses grow with flexible solutions.' },
  'svc.cards.title': { vi: 'Thẻ Tín Dụng', en: 'Credit Cards' },
  'svc.cards.desc': { vi: 'Đa dạng thẻ tín dụng với ưu đãi hấp dẫn.', en: 'A variety of credit cards with attractive offers.' },
  'svc.loans.title': { vi: 'Cho Vay', en: 'Loans' },
  'svc.loans.desc': { vi: 'Lãi suất cạnh tranh và gói vay linh hoạt.', en: 'Competitive rates and flexible loan packages.' },
  'svc.invest.title': { vi: 'Đầu Tư', en: 'Investment' },
  'svc.invest.desc': { vi: 'Tối ưu hóa lợi nhuận với giải pháp đầu tư đa dạng.', en: 'Maximize returns with diverse investment solutions.' },
  'svc.savings.title': { vi: 'Tiết Kiệm', en: 'Savings' },
  'svc.savings.desc': { vi: 'Gửi tiết kiệm với lãi suất hấp dẫn.', en: 'Savings deposits with attractive interest rates.' },

  // Advantages section
  'adv.label': { vi: 'Tại Sao Chọn Chúng Tôi', en: 'Why Choose Us' },
  'adv.heading': { vi: 'Ưu Điểm Ngân Hàng', en: 'Our Banking Advantages' },
  'adv.desc': { vi: 'Chúng tôi cam kết mang đến trải nghiệm ngân hàng tốt nhất với dịch vụ chuyên nghiệp và công nghệ hiện đại.', en: 'We are committed to delivering the best banking experience with professional service and modern technology.' },
  'adv.point1.title': { vi: 'Lấy Khách Hàng Làm Trung Tâm', en: 'Customer-Centric' },
  'adv.point1.desc': { vi: 'Mọi quyết định đều hướng đến lợi ích tốt nhất cho khách hàng.', en: 'Every decision is made in the best interest of our customers.' },
  'adv.point2.title': { vi: 'Giải Pháp Đổi Mới', en: 'Innovative Solutions' },
  'adv.point2.desc': { vi: 'Công nghệ tiên tiến để mang lại trải nghiệm tài chính vượt trội.', en: 'Advanced technology for a superior financial experience.' },
  'adv.point3.title': { vi: 'Minh Bạch & Tin Cậy', en: 'Transparent & Reliable' },
  'adv.point3.desc': { vi: 'Cam kết minh bạch trong mọi giao dịch và dịch vụ.', en: 'Committed to transparency in every transaction and service.' },
  'adv.security.title': { vi: 'Bảo Mật Tối Đa', en: 'Maximum Security' },
  'adv.security.desc': { vi: 'Hệ thống bảo mật đa lớp tiên tiến nhất, bảo vệ tài sản và thông tin của bạn 24/7.', en: 'State-of-the-art multi-layer security protecting your assets and data 24/7.' },
  'adv.personalized.title': { vi: 'Cá Nhân Hóa', en: 'Personalized' },
  'adv.personalized.desc': { vi: 'Dịch vụ được thiết kế riêng phù hợp với nhu cầu và mục tiêu tài chính của bạn.', en: 'Services tailored to your unique needs and financial goals.' },
  'adv.fast.title': { vi: 'Nhanh & Đáng Tin', en: 'Fast & Reliable' },
  'adv.fast.desc': { vi: 'Giao dịch nhanh chóng với thời gian xử lý tối thiểu và độ tin cậy cao.', en: 'Quick transactions with minimal processing time and high reliability.' },
  'adv.global.title': { vi: 'Toàn Cầu', en: 'Global Reach' },
  'adv.global.desc': { vi: 'Kết nối tài chính toàn cầu với mạng lưới đối tác rộng khắp thế giới.', en: 'Global financial connectivity with a worldwide partner network.' },

  // Mobile banking section
  'mb.label': { vi: 'Ngân hàng số', en: 'Digital Banking' },
  'mb.heading': { vi: 'Ngân hàng trong tầm tay', en: 'Banking at Your Fingertips' },
  'mb.desc': { vi: 'Trải nghiệm tự do giao dịch mọi lúc, mọi nơi với ứng dụng ngân hàng số đầy đủ tính năng.', en: 'Enjoy the freedom to transact anytime, anywhere with our full-featured digital banking app.' },
  'mb.download': { vi: 'Tải ứng dụng', en: 'Download App' },
  'mb.secure': { vi: 'An toàn & Bảo mật', en: 'Safe & Secure' },
  'mb.feat1.title': { vi: 'Chuyển tiền tức thì', en: 'Instant Transfers' },
  'mb.feat1.desc': { vi: 'Gửi tiền cho bất kỳ ai, bất cứ lúc nào chỉ với vài thao tác.', en: 'Send money to anyone, anytime with just a few taps.' },
  'mb.feat2.title': { vi: 'Thanh toán hóa đơn', en: 'Bill Payments' },
  'mb.feat2.desc': { vi: 'Thanh toán điện, nước, internet và nhiều dịch vụ khác.', en: 'Pay electricity, water, internet and many more services.' },
  'mb.feat3.title': { vi: 'Thẻ ảo', en: 'Virtual Cards' },
  'mb.feat3.desc': { vi: 'Tạo thẻ ảo cho mua sắm online với bảo mật nâng cao.', en: 'Create virtual cards for online shopping with enhanced security.' },
  'mb.feat4.title': { vi: 'Phân tích chi tiêu', en: 'Spending Analytics' },
  'mb.feat4.desc': { vi: 'Theo dõi chi tiêu với báo cáo chi tiết và gợi ý cá nhân hóa.', en: 'Track spending with detailed reports and personalized insights.' },
  'mb.phone.brand': { vi: 'Việt Trust Bank', en: 'Viet Trust Bank' },
  'mb.phone.tagline': { vi: 'Ngân hàng số', en: 'Digital Banking' },
  'mb.phone.totalBalance': { vi: 'Tổng số dư', en: 'Total Balance' },
  'mb.phone.recent': { vi: 'Giao dịch gần đây', en: 'Recent Transactions' },
  'mb.phone.payment': { vi: 'Thanh toán', en: 'Payment' },
  'mb.phone.today': { vi: 'Hôm nay', en: 'Today' },
  'mb.phone.feature': { vi: 'Tính năng', en: 'Feature' },

  // Testimonials
  'tst.label': { vi: 'Đánh Giá Từ Khách Hàng', en: 'Customer Reviews' },
  'tst.heading': { vi: 'Khách Hàng Nói Gì Về Chúng Tôi', en: 'What Our Customers Say About Us' },
  'tst.desc': { vi: 'Lắng nghe trực tiếp từ khách hàng quý giá của chúng tôi.', en: 'Hear directly from our valued customers.' },
  'tst.customers': { vi: 'Khách hàng', en: 'Customers' },
  'tst.trustedBy': { vi: 'Được tin tưởng bởi', en: 'Trusted by' },
  'tst.customersLabel': { vi: 'Khách Hàng', en: 'Customers' },

  // News
  'news.label': { vi: 'Tin Tức & Cập Nhật', en: 'News & Updates' },
  'news.heading': { vi: 'Tin Tức Ngân Hàng Mới Nhất', en: 'Latest Banking News' },
  'news.viewAll': { vi: 'Xem Tất Cả', en: 'View All' },
  'news.read': { vi: 'Xem Thêm', en: 'Read More' },
  'news.newsletter.title': { vi: 'Luôn Cập Nhật Với Việt Trust Bank', en: 'Stay Updated With Viet Trust Bank' },
  'news.newsletter.desc': { vi: 'Đăng ký nhận bản tin để được cập nhật tin tức tài chính mới nhất.', en: 'Subscribe to our newsletter for the latest financial news.' },
  'news.newsletter.placeholder': { vi: 'Email của bạn', en: 'Your email' },
  'news.newsletter.subscribe': { vi: 'Đăng Ký', en: 'Subscribe' },
  'news.cat.business': { vi: 'Kinh Doanh', en: 'Business' },
  'news.cat.tech': { vi: 'Công Nghệ', en: 'Technology' },
  'news.cat.awards': { vi: 'Giải Thưởng', en: 'Awards' },
  'news.item1.title': { vi: 'Việt Trust Bank Ra Mắt Chương Trình Cho Vay Doanh Nghiệp Nhỏ Mới', en: 'Viet Trust Bank Launches New Small Business Loan Program' },
  'news.item1.date': { vi: '15 Tháng 5, 2023', en: 'May 15, 2023' },
  'news.item1.excerpt': { vi: 'Hỗ trợ doanh nghiệp địa phương với lãi suất cạnh tranh và các tùy chọn trả nợ linh hoạt.', en: 'Supporting local businesses with competitive rates and flexible repayment options.' },
  'news.item2.title': { vi: 'Ứng Dụng Ngân Hàng Di Động Cập Nhật Bảo Mật và Tính Năng Mới', en: 'Mobile Banking App Gets Security and Feature Updates' },
  'news.item2.date': { vi: '22 Tháng 4, 2023', en: 'April 22, 2023' },
  'news.item2.excerpt': { vi: 'Tính năng bảo mật nâng cao và các chức năng mới hiện đã có sẵn cho tất cả người dùng.', en: 'Enhanced security features and new functionality now available to all users.' },
  'news.item3.title': { vi: 'Việt Trust Bank Được Vinh Danh về Dịch Vụ Khách Hàng Xuất Sắc', en: 'Viet Trust Bank Recognized for Outstanding Customer Service' },
  'news.item3.date': { vi: '10 Tháng 3, 2023', en: 'March 10, 2023' },
  'news.item3.excerpt': { vi: 'Năm thứ ba liên tiếp giành được giải thưởng ngân hàng quốc gia danh giá.', en: 'Third consecutive year winning the prestigious national banking award.' },

  // CTA
  'cta.heading': { vi: 'Sẵn Sàng Bắt Đầu Hành Trình Tài Chính?', en: 'Ready to Start Your Financial Journey?' },
  'cta.desc': { vi: 'Mở tài khoản ngay hôm nay và trải nghiệm dịch vụ ngân hàng đẳng cấp cùng Việt Trust Bank.', en: 'Open an account today and experience world-class banking with Viet Trust Bank.' },
  'cta.benefit1': { vi: 'Mở tài khoản miễn phí trong 5 phút', en: 'Open a free account in 5 minutes' },
  'cta.benefit2': { vi: 'Không phí duy trì hàng tháng', en: 'No monthly maintenance fees' },
  'cta.benefit3': { vi: 'Lãi suất tiết kiệm cạnh tranh', en: 'Competitive savings interest rates' },
  'cta.benefit4': { vi: 'Ứng dụng ngân hàng di động 24/7', en: '24/7 mobile banking app' },
  'cta.benefit5': { vi: 'Hỗ trợ khách hàng tận tâm', en: 'Dedicated customer support' },
  'cta.openAccount': { vi: 'Mở Tài Khoản', en: 'Open Account' },
  'cta.learnMore': { vi: 'Tìm Hiểu Thêm', en: 'Learn More' },
  'cta.contactUs': { vi: 'Liên Hệ Với Chúng Tôi', en: 'Contact Us' },
  'cta.form.name': { vi: 'Họ và Tên', en: 'Full Name' },
  'cta.form.phone': { vi: 'Số Điện Thoại', en: 'Phone Number' },
  'cta.form.email': { vi: 'Email', en: 'Email' },
  'cta.form.service': { vi: 'Dịch Vụ Quan Tâm', en: 'Service of Interest' },
  'cta.form.selectService': { vi: 'Chọn dịch vụ', en: 'Select a service' },
  'cta.form.opt.personal': { vi: 'Ngân Hàng Cá Nhân', en: 'Personal Banking' },
  'cta.form.opt.business': { vi: 'Ngân Hàng Doanh Nghiệp', en: 'Business Banking' },
  'cta.form.opt.loans': { vi: 'Cho Vay', en: 'Loans' },
  'cta.form.opt.investments': { vi: 'Đầu Tư', en: 'Investments' },
  'cta.form.message': { vi: 'Tin Nhắn', en: 'Message' },
  'cta.form.messagePh': { vi: 'Nhập tin nhắn...', en: 'Enter your message...' },
  'cta.form.namePh': { vi: 'Nguyễn Văn A', en: 'John Doe' },
  'cta.form.emailPh': { vi: 'email@example.com', en: 'email@example.com' },
  'cta.form.submit': { vi: 'Gửi Yêu Cầu', en: 'Send Request' },

  // Footer
  'foot.desc': { vi: 'Đối tác ngân hàng đáng tin cậy của bạn tại Việt Nam cung cấp các giải pháp tài chính đổi mới.', en: 'Your trusted banking partner in Vietnam providing innovative financial solutions.' },
  'foot.address': { vi: '123 Đường Tài Chính, Quận 1\nTP. Hồ Chí Minh, Việt Nam', en: '123 Finance Street, District 1\nHo Chi Minh City, Vietnam' },
  'foot.connect': { vi: 'Kết nối với chúng tôi', en: 'Connect with us' },
  'foot.rights': { vi: 'Tất cả các quyền được bảo lưu.', en: 'All rights reserved.' },
  'foot.regulated': { vi: 'Được cấp phép và quản lý bởi Ngân hàng Nhà nước Việt Nam.', en: 'Licensed and regulated by the State Bank of Vietnam.' },
  'foot.cat.banking': { vi: 'Ngân Hàng', en: 'Banking' },
  'foot.cat.company': { vi: 'Công Ty', en: 'Company' },
  'foot.cat.support': { vi: 'Hỗ Trợ', en: 'Support' },
  'foot.cat.legal': { vi: 'Pháp Lý', en: 'Legal' },
  'foot.bank.personal': { vi: 'Ngân Hàng Cá Nhân', en: 'Personal Banking' },
  'foot.bank.business': { vi: 'Ngân Hàng Doanh Nghiệp', en: 'Business Banking' },
  'foot.bank.private': { vi: 'Ngân Hàng Tư Nhân', en: 'Private Banking' },
  'foot.bank.digital': { vi: 'Ngân Hàng Số', en: 'Digital Banking' },
  'foot.bank.loans': { vi: 'Vay & Thế Chấp', en: 'Loans & Mortgages' },
  'foot.co.about': { vi: 'Về Chúng Tôi', en: 'About Us' },
  'foot.co.careers': { vi: 'Tuyển Dụng', en: 'Careers' },
  'foot.co.news': { vi: 'Tin Tức & Truyền Thông', en: 'News & Media' },
  'foot.co.investors': { vi: 'Quan Hệ Nhà Đầu Tư', en: 'Investor Relations' },
  'foot.co.csr': { vi: 'Trách Nhiệm Doanh Nghiệp', en: 'Corporate Responsibility' },
  'foot.sup.help': { vi: 'Trung Tâm Trợ Giúp', en: 'Help Center' },
  'foot.sup.contact': { vi: 'Liên Hệ', en: 'Contact' },
  'foot.sup.faq': { vi: 'Câu Hỏi Thường Gặp', en: 'FAQ' },
  'foot.sup.security': { vi: 'Bảo Mật', en: 'Security' },
  'foot.sup.fraud': { vi: 'Báo Cáo Gian Lận', en: 'Report Fraud' },
  'foot.lg.terms': { vi: 'Điều Khoản & Điều Kiện', en: 'Terms & Conditions' },
  'foot.lg.privacy': { vi: 'Chính Sách Riêng Tư', en: 'Privacy Policy' },
  'foot.lg.cookies': { vi: 'Chính Sách Cookie', en: 'Cookie Policy' },
  'foot.lg.license': { vi: 'Giấy Phép Ngân Hàng', en: 'Banking License' },
  'foot.lg.fees': { vi: 'Phí & Lãi Suất', en: 'Fees & Rates' },
  'foot.bottom.privacy': { vi: 'Chính Sách Riêng Tư', en: 'Privacy Policy' },
  'foot.bottom.terms': { vi: 'Điều Khoản Dịch Vụ', en: 'Terms of Service' },
  'foot.bottom.cookies': { vi: 'Cookies', en: 'Cookies' },
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

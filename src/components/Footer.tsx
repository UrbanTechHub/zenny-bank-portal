import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

const categories = [
  { title: "Ngân Hàng", links: ["Ngân Hàng Cá Nhân", "Ngân Hàng Doanh Nghiệp", "Ngân Hàng Tư Nhân", "Ngân Hàng Số", "Vay & Thế Chấp"] },
  { title: "Công Ty", links: ["Về Chúng Tôi", "Tuyển Dụng", "Tin Tức & Truyền Thông", "Quan Hệ Nhà Đầu Tư", "Trách Nhiệm Doanh Nghiệp"] },
  { title: "Hỗ Trợ", links: ["Trung Tâm Trợ Giúp", "Liên Hệ", "Câu Hỏi Thường Gặp", "Bảo Mật", "Báo Cáo Gian Lận"] },
  { title: "Pháp Lý", links: ["Điều Khoản & Điều Kiện", "Chính Sách Riêng Tư", "Chính Sách Cookie", "Giấy Phép Ngân Hàng", "Phí & Lãi Suất"] },
];

const Footer = () => (
  <footer className="bg-bank-blue text-white">
    <div className="container mx-auto px-4 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Việt Trust Bank</h2>
            <p className="text-white/70 max-w-sm">Đối tác ngân hàng đáng tin cậy của bạn tại Việt Nam cung cấp các giải pháp tài chính đổi mới.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start"><MapPin className="w-5 h-5 text-bank-gold mr-3 mt-0.5" /><p className="text-white/70">123 Đường Tài Chính, Quận 1<br />TP. Hồ Chí Minh, Việt Nam</p></div>
            <div className="flex items-center"><Phone className="w-5 h-5 text-bank-gold mr-3" /><p className="text-white/70">+84 (28) 1234 5678</p></div>
            <div className="flex items-center"><Mail className="w-5 h-5 text-bank-gold mr-3" /><p className="text-white/70">support@viettrusttaichinh.online</p></div>
          </div>
          <div className="mt-8">
            <p className="text-white/70 mb-3">Kết nối với chúng tôi</p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (<a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-300"><Icon className="w-5 h-5" /></a>))}
            </div>
          </div>
        </div>
        {categories.map((cat, i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold mb-4">{cat.title}</h3>
            <ul className="space-y-3">
              {cat.links.map((link, j) => (<li key={j}><a href="#" className="text-white/70 hover:text-white transition-colors duration-200 inline-block relative group"><span>{link}</span><span className="absolute bottom-0 left-0 w-0 h-0.5 bg-bank-gold transition-all duration-300 group-hover:w-full" /></a></li>))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">© {new Date().getFullYear()} Việt Trust Bank. Tất cả các quyền được bảo lưu.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            {["Chính Sách Riêng Tư", "Điều Khoản Dịch Vụ", "Cookies"].map((t, i) => (<a key={i} href="#" className="text-white/60 hover:text-white text-sm transition-colors duration-200">{t}</a>))}
          </div>
        </div>
        <div className="mt-6 text-white/50 text-xs text-center"><p>Được cấp phép và quản lý bởi Ngân hàng Nhà nước Việt Nam.</p></div>
      </div>
    </div>
  </footer>
);

export default Footer;

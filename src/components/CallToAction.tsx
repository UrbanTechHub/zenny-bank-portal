import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CallToAction = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const benefits = ["Mở tài khoản miễn phí trong 5 phút", "Không phí duy trì hàng tháng", "Lãi suất tiết kiệm cạnh tranh", "Ứng dụng ngân hàng di động 24/7", "Hỗ trợ khách hàng tận tâm"];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <div id="contact" ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-bank-blue to-bank-darkBlue z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white opacity-5" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-bank-gold opacity-10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={cn("transform transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20")}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Sẵn Sàng Bắt Đầu Hành Trình Tài Chính?</h2>
            <p className="text-white/80 mb-8 text-lg leading-relaxed">Mở tài khoản ngay hôm nay và trải nghiệm dịch vụ ngân hàng đẳng cấp cùng Việt Trust Bank.</p>
            <div className="space-y-4 mb-8">
              {benefits.map((b, i) => (
                <div key={i} className={cn("flex items-center transform transition-all duration-700", isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10")} style={{ transitionDelay: `${300 + i * 150}ms` }}>
                  <CheckCircle2 className="w-5 h-5 text-bank-gold mr-3 flex-shrink-0" /><span className="text-white">{b}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="px-6 py-3 bg-bank-gold hover:bg-bank-gold/90 text-bank-blue font-semibold rounded-lg animate-shimmer bg-[linear-gradient(110deg,#FFD700,45%,#FFF3B0,55%,#FFD700)] bg-[length:200%_100%] flex items-center">Mở Tài Khoản <ArrowRight className="ml-2 w-4 h-4" /></a>
              <a href="#" className="px-6 py-3 border border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-all duration-300">Tìm Hiểu Thêm</a>
            </div>
          </div>
          <div className={cn("transform transition-all duration-1000 delay-300", isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20")}>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 relative z-10">
              <h3 className="text-2xl font-semibold text-white mb-6">Liên Hệ Với Chúng Tôi</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-white/80 mb-2 text-sm">Họ và Tên</label><input type="text" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bank-gold/50" placeholder="Nguyễn Văn A" /></div>
                  <div><label className="block text-white/80 mb-2 text-sm">Số Điện Thoại</label><input type="tel" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bank-gold/50" placeholder="+84 XXX XXX XXXX" /></div>
                </div>
                <div><label className="block text-white/80 mb-2 text-sm">Email</label><input type="email" className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bank-gold/50" placeholder="email@example.com" /></div>
                <div><label className="block text-white/80 mb-2 text-sm">Dịch Vụ Quan Tâm</label>
                  <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 focus:outline-none focus:ring-2 focus:ring-bank-gold/50">
                    <option value="" className="bg-bank-darkBlue">Chọn dịch vụ</option><option value="personal" className="bg-bank-darkBlue">Ngân Hàng Cá Nhân</option><option value="business" className="bg-bank-darkBlue">Ngân Hàng Doanh Nghiệp</option><option value="loans" className="bg-bank-darkBlue">Cho Vay</option><option value="investments" className="bg-bank-darkBlue">Đầu Tư</option>
                  </select>
                </div>
                <div><label className="block text-white/80 mb-2 text-sm">Tin Nhắn</label><textarea rows={4} className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bank-gold/50" placeholder="Nhập tin nhắn..." /></div>
                <button type="submit" className="w-full py-3 bg-bank-gold hover:bg-bank-gold/90 text-bank-blue font-semibold rounded-lg transition-all duration-300">Gửi Yêu Cầu</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;

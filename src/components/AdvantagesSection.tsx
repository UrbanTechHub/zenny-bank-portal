import { useEffect, useRef, useState } from "react";
import { Settings, Shield, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const AdvantagesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const advantages = [
    { icon: <Shield className="w-10 h-10 text-white" />, title: "Bảo Mật Tối Đa", description: "Hệ thống bảo mật đa lớp tiên tiến nhất, bảo vệ tài sản và thông tin của bạn 24/7.", color: "from-bank-blue to-bank-lightBlue" },
    { icon: <Settings className="w-10 h-10 text-white" />, title: "Cá Nhân Hóa", description: "Dịch vụ được thiết kế riêng phù hợp với nhu cầu và mục tiêu tài chính của bạn.", color: "from-bank-red to-rose-500" },
    { icon: <Zap className="w-10 h-10 text-white" />, title: "Nhanh & Đáng Tin", description: "Giao dịch nhanh chóng với thời gian xử lý tối thiểu và độ tin cậy cao.", color: "from-bank-gold to-amber-400" },
    { icon: <Globe className="w-10 h-10 text-white" />, title: "Toàn Cầu", description: "Kết nối tài chính toàn cầu với mạng lưới đối tác rộng khắp thế giới.", color: "from-bank-green to-emerald-400" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <div id="about" ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className={cn("transform transition-all duration-1000", isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20")}>
              <p className="text-bank-blue font-semibold mb-3">Tại Sao Chọn Chúng Tôi</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ưu Điểm Ngân Hàng</h2>
              <p className="text-gray-600 mb-8">Chúng tôi cam kết mang đến trải nghiệm ngân hàng tốt nhất với dịch vụ chuyên nghiệp và công nghệ hiện đại.</p>
              <div className="space-y-6">
                {[{ num: "1", title: "Lấy Khách Hàng Làm Trung Tâm", desc: "Mọi quyết định đều hướng đến lợi ích tốt nhất cho khách hàng." }, { num: "2", title: "Giải Pháp Đổi Mới", desc: "Công nghệ tiên tiến để mang lại trải nghiệm tài chính vượt trội." }, { num: "3", title: "Minh Bạch & Tin Cậy", desc: "Cam kết minh bạch trong mọi giao dịch và dịch vụ." }].map((item) => (
                  <div key={item.num} className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-bank-blue/10 flex items-center justify-center mr-4"><span className="text-3xl font-bold text-bank-blue">{item.num}</span></div>
                    <div><h3 className="font-medium mb-1">{item.title}</h3><p className="text-sm text-gray-600">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {advantages.map((adv, index) => (
                <div key={index} className={cn("feature-card rounded-xl overflow-hidden transform transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20")} style={{ transitionDelay: `${200 + index * 150}ms` }}>
                  <div className="h-full flex flex-col">
                    <div className={cn("bg-gradient-to-br p-6", adv.color)}>
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">{adv.icon}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{adv.title}</h3>
                    </div>
                    <div className="bg-white p-6 flex-1 border border-gray-100"><p className="text-gray-600">{adv.description}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvantagesSection;

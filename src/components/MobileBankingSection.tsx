import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronRight, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { title: "Chuyển tiền tức thì", description: "Gửi tiền cho bất kỳ ai, bất cứ lúc nào chỉ với vài thao tác.", icon: <Smartphone className="w-5 h-5" /> },
  { title: "Thanh toán hóa đơn", description: "Thanh toán điện, nước, internet và nhiều dịch vụ khác.", icon: <Smartphone className="w-5 h-5" /> },
  { title: "Thẻ ảo", description: "Tạo thẻ ảo cho mua sắm online với bảo mật nâng cao.", icon: <Smartphone className="w-5 h-5" /> },
  { title: "Phân tích chi tiêu", description: "Theo dõi chi tiêu với báo cáo chi tiết và gợi ý cá nhân hóa.", icon: <Smartphone className="w-5 h-5" /> },
];

const MobileBankingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature((prev) => (prev + 1) % features.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-bank-blue/5 to-bank-blue/10 z-0" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={cn("relative transform transition-all duration-1000", isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20")}>
            <div className="relative z-10 mx-auto w-[280px]">
              <div className="relative rounded-[32px] overflow-hidden border-8 border-gray-800 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 rounded-t-sm" />
                <div className="bg-white aspect-[9/19]">
                  <div className="h-full bg-bank-blue/10 p-4 flex flex-col">
                    <div className="bg-bank-blue text-white p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div><p className="text-sm font-medium">Việt Trust Bank</p><p className="text-xs opacity-70">Ngân hàng số</p></div>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">VT</div>
                      </div>
                      <div className="mt-4"><p className="text-xs opacity-70">Tổng số dư</p><p className="text-xl font-bold">42,584,000 ₫</p></div>
                    </div>
                    <div className="mt-4 flex-1 flex flex-col">
                      <div className="bg-white rounded-xl p-3 shadow-sm">
                        <div className="flex items-center justify-between"><p className="text-xs font-medium text-gray-600">Giao dịch gần đây</p><ChevronRight className="w-4 h-4 text-gray-400" /></div>
                        <div className="mt-3 space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2"><span className="text-[8px]">GD</span></div>
                                <div><p className="text-[10px] font-medium">Thanh toán</p><p className="text-[8px] text-gray-500">Hôm nay</p></div>
                              </div>
                              <p className="text-[10px] font-medium">-120,000 ₫</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 bg-white rounded-xl p-3 shadow-sm">
                        <p className="text-xs font-medium text-gray-600">{features[activeFeature].title}</p>
                        <p className="text-[9px] text-gray-500 mt-1">{features[activeFeature].description}</p>
                      </div>
                      <div className="mt-auto grid grid-cols-4 gap-2">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="bg-white rounded-lg p-2 shadow-sm text-center">
                            <div className="w-5 h-5 mx-auto mb-1 rounded-full bg-gray-100 flex items-center justify-center"><span className="text-[8px]">F{i + 1}</span></div>
                            <p className="text-[8px]">Tính năng</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 mx-auto w-16 h-1 bg-gray-700 rounded-full" />
              </div>
            </div>
          </div>
          <div>
            <div className={cn("transform transition-all duration-1000 delay-300", isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20")}>
              <p className="text-bank-blue font-semibold mb-3">Ngân hàng số</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ngân hàng trong tầm tay</h2>
              <p className="text-gray-600 mb-8">Trải nghiệm tự do giao dịch mọi lúc, mọi nơi với ứng dụng ngân hàng số đầy đủ tính năng.</p>
              <div className="space-y-6 mb-10">
                {features.map((feature, index) => (
                  <div key={index} onClick={() => setActiveFeature(index)} className={cn("feature-card p-4 rounded-xl cursor-pointer transition-all duration-300", activeFeature === index ? "bg-bank-blue text-white transform scale-[1.02]" : "bg-white hover:bg-gray-50")}>
                    <div className="flex">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mr-4", activeFeature === index ? "bg-white/20" : "bg-bank-blue/10")}>{feature.icon}</div>
                      <div>
                        <h3 className={cn("font-semibold mb-1", activeFeature === index ? "text-white" : "text-gray-900")}>{feature.title}</h3>
                        <p className={cn("text-sm", activeFeature === index ? "text-white/80" : "text-gray-600")}>{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="flex items-center justify-center h-12 px-6 bg-bank-blue text-white rounded-lg hover:bg-bank-darkBlue transition-all duration-300">Tải ứng dụng</a>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-green-500 mr-2" /><span className="text-sm text-gray-700">An toàn & Bảo mật</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBankingSection;

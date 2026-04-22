import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  { id: 1, name: "Nguyễn Văn Thành", position: "Chủ Doanh Nghiệp", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", stars: 5, content: "Việt Trust Bank đã đóng vai trò quan trọng trong việc giúp tôi mở rộng doanh nghiệp. Dịch vụ cá nhân hóa đã vượt quá mong đợi." },
  { id: 2, name: "Phạm Thị Hương", position: "Bác Sĩ", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", stars: 5, content: "Ứng dụng ngân hàng di động được thiết kế đặc biệt tốt và an toàn. Tôi có thể quản lý tài chính khi di chuyển." },
  { id: 3, name: "Trần Minh Tuấn", position: "Giáo Viên", image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", stars: 4, content: "Lãi suất cạnh tranh và tư vấn tài chính đã giúp tôi xây dựng một tương lai an toàn cho gia đình." },
  { id: 4, name: "Lê Thị Mai", position: "Chủ Cửa Hàng", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", stars: 5, content: "Dịch vụ khách hàng tại Việt Trust Bank thật xuất sắc. Họ luôn sẵn sàng hỗ trợ tài khoản doanh nghiệp nhỏ." },
  { id: 5, name: "Hoàng Quốc Bảo", position: "Kỹ sư Phần mềm", image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", stars: 5, content: "Giao diện trực quan và tính năng bảo mật vượt trội đã mang lại sự an tâm cho tôi khi quản lý tài chính." },
  { id: 6, name: "Vũ Thanh Hà", position: "Nhà tư vấn Tài chính", image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", stars: 5, content: "Các giải pháp đầu tư đa dạng và chiến lược đáng tin cậy cho khách hàng." },
];

const TestimonialsSection = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxVisibleItems = 3;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);

  const nextSlide = () => setCurrentIndex((prev) => (prev === testimonials.length - maxVisibleItems ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? testimonials.length - maxVisibleItems : prev - 1));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => { const interval = setInterval(nextSlide, 6000); return () => clearInterval(interval); }, [currentIndex]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-bank-gold/5 to-transparent rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-bank-blue/5 to-transparent rounded-full" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className={cn("transform transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <p className="text-bank-blue font-semibold mb-3">{t('tst.label')}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('tst.heading')}</h2>
            <p className="text-gray-600">{t('tst.desc')}</p>
          </div>
        </div>
        <div className={cn("flex justify-center mb-12 transition-all duration-1000", isVisible ? "opacity-100" : "opacity-0")}>
          <div className="relative inline-flex">
            {testimonials.slice(0, 5).map((t, i) => (
              <div key={t.id} className={cn("w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-md transition-all duration-300", i > 0 && "-ml-4", activeTestimonial === t.id && "transform scale-125 z-10")} style={{ zIndex: 5 - i }} onMouseEnter={() => setActiveTestimonial(t.id)} onMouseLeave={() => setActiveTestimonial(null)}>
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="ml-2 flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">+{testimonials.length - 5} {t('tst.customers')}</div>
          </div>
        </div>
        <div className="relative">
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 -translate-x-12 z-10">
            <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50"><ChevronLeft className="w-5 h-5" /></button>
          </div>
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-0 translate-x-12 z-10">
            <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * (100 / testimonials.length)}%)` }}>
              {testimonials.map((t, index) => (
                <div key={t.id} className={cn("w-full md:w-1/3 px-4 flex-shrink-0 transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{ transitionDelay: `${100 + index * 100}ms` }}>
                  <div className="h-full bg-gray-50 p-6 md:p-8 rounded-xl hover:shadow-lg transition-all duration-300 interactive-card">
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md"><img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" /></div>
                      <div><h4 className="font-semibold text-gray-900">{t.name}</h4><p className="text-sm text-gray-500">{t.position}</p></div>
                      <div className="ml-auto"><Quote className="w-8 h-8 text-bank-blue opacity-20" /></div>
                    </div>
                    <p className="text-gray-600 mb-6">"{t.content}"</p>
                    <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={cn("w-4 h-4", i < t.stars ? "text-bank-gold fill-bank-gold" : "text-gray-300")} />))}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-8 md:hidden">
            {[...Array(testimonials.length - maxVisibleItems + 1)].map((_, i) => (<button key={i} onClick={() => setCurrentIndex(i)} className={cn("w-2 h-2 mx-1 rounded-full transition-all duration-300", currentIndex === i ? "bg-bank-blue w-6" : "bg-gray-300")} />))}
          </div>
        </div>
        <div className={cn("mt-12 flex flex-wrap justify-center gap-6", isVisible ? "opacity-100" : "opacity-0")}>
          {[t('tst.trustedBy'), "500,000+", t('tst.customersLabel')].map((text, i) => (<span key={i} className={cn("text-lg font-semibold", i === 1 ? "text-bank-blue" : "text-gray-600")}>{text}</span>))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

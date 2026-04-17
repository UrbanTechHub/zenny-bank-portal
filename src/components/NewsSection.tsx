import { useEffect, useRef, useState } from "react";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const news = [
  { title: "Việt Trust Bank Ra Mắt Chương Trình Cho Vay Doanh Nghiệp Nhỏ Mới", date: "15 Tháng 5, 2023", category: "Kinh Doanh", image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", excerpt: "Hỗ trợ doanh nghiệp địa phương với lãi suất cạnh tranh và các tùy chọn trả nợ linh hoạt." },
  { title: "Ứng Dụng Ngân Hàng Di Động Cập Nhật Bảo Mật và Tính Năng Mới", date: "22 Tháng 4, 2023", category: "Công Nghệ", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", excerpt: "Tính năng bảo mật nâng cao và các chức năng mới hiện đã có sẵn cho tất cả người dùng." },
  { title: "Việt Trust Bank Được Vinh Danh về Dịch Vụ Khách Hàng Xuất Sắc", date: "10 Tháng 3, 2023", category: "Giải Thưởng", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", excerpt: "Năm thứ ba liên tiếp giành được giải thưởng ngân hàng quốc gia danh giá." },
];

const NewsCard = ({ article, index, isVisible }: { article: typeof news[0]; index: number; isVisible: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={cn("feature-card bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20")} style={{ transitionDelay: `${300 + index * 150}ms` }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative h-48 overflow-hidden">
        <img src={article.image} alt={article.title} className={cn("w-full h-full object-cover transition-transform duration-500", isHovered ? "scale-110" : "scale-100")} loading="lazy" />
        <div className="absolute top-4 left-4 px-3 py-1 bg-white text-bank-blue text-xs font-medium rounded-full flex items-center"><Tag className="w-3 h-3 mr-1" />{article.category}</div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-3"><Clock className="w-4 h-4 text-gray-400 mr-2" /><span className="text-sm text-gray-500">{article.date}</span></div>
        <h3 className="text-xl font-semibold mb-3 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 mb-4">{article.excerpt}</p>
        <a href="#" className="inline-flex items-center font-medium text-bank-blue hover:text-bank-lightBlue">Xem Thêm <ArrowRight className="ml-2 w-4 h-4" /></a>
      </div>
    </div>
  );
};

const NewsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className={cn("max-w-2xl transform transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <p className="text-bank-blue font-semibold mb-3">Tin Tức & Cập Nhật</p>
            <h2 className="text-3xl md:text-4xl font-bold">Tin Tức Ngân Hàng Mới Nhất</h2>
          </div>
          <a href="#" className="mt-4 md:mt-0 inline-flex items-center px-5 py-2 border border-bank-blue text-bank-blue rounded-lg hover:bg-bank-blue hover:text-white transition-all duration-300">Xem Tất Cả <ArrowRight className="ml-2 w-4 h-4" /></a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (<NewsCard key={index} article={article} index={index} isVisible={isVisible} />))}
        </div>
        <div className={cn("mt-16 p-6 bg-white rounded-xl shadow-sm", isVisible ? "opacity-100" : "opacity-0", "transition-all duration-700 delay-500")}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3"><div className="aspect-square rounded-xl overflow-hidden"><img src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Khách hàng" className="w-full h-full object-cover" /></div></div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">Luôn Cập Nhật Với Việt Trust Bank</h3>
              <p className="text-gray-600 mb-6">Đăng ký nhận bản tin để được cập nhật tin tức tài chính mới nhất.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="Email của bạn" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bank-blue/30 flex-1" />
                <button className="px-6 py-2 bg-bank-blue text-white rounded-lg hover:bg-bank-darkBlue transition-colors duration-300">Đăng Ký</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

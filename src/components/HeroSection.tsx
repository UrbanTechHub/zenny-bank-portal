import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wallet, Landmark, ShieldCheck, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };
    const el = heroRef.current;
    if (el) el.addEventListener("mousemove", handleMouseMove);
    return () => { if (el) el.removeEventListener("mousemove", handleMouseMove); };
  }, []);

  const featureItems = [
    { icon: <Wallet size={20} />, text: "Ngân Hàng Trực Tuyến" },
    { icon: <Landmark size={20} />, text: "Giải Pháp Đầu Tư" },
    { icon: <ShieldCheck size={20} />, text: "Giao Dịch An Toàn" },
    { icon: <DollarSign size={20} />, text: "Ngoại Hối" },
  ];

  return (
    <div ref={heroRef} className="hero-section relative overflow-hidden w-full py-32 md:py-40" style={{ "--x": `${mousePosition.x}%`, "--y": `${mousePosition.y}%` } as React.CSSProperties}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-bank-red opacity-10 animate-float" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-bank-gold opacity-10 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full bg-bank-green opacity-10 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[10%] left-[10%] w-[100px] h-[100px] bg-white opacity-5 rotate-45" />
        <div className="absolute bottom-[15%] right-[15%] w-[150px] h-[150px] bg-white opacity-5 rounded-lg rotate-12" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-white/80 text-sm">Dịch Vụ Ngân Hàng Hàng Đầu Việt Nam</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Tương Lai Tài Chính <br /><span className="text-bank-gold">Bắt Đầu Từ Đây</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">Trải nghiệm thế hệ ngân hàng tiếp theo với công nghệ tiên tiến và dịch vụ cá nhân hóa phù hợp với nhu cầu của bạn.</p>
              <div className="flex flex-wrap gap-4">
                <Button className="px-6 py-6 bg-bank-gold hover:bg-bank-gold/90 text-bank-blue font-semibold rounded-lg animate-shimmer bg-[linear-gradient(110deg,#FFD700,45%,#FFF3B0,55%,#FFD700)] bg-[length:200%_100%] flex items-center gap-2">Mở Tài Khoản <ArrowRight className="w-5 h-5" /></Button>
                <Button variant="outline" className="px-6 py-6 bg-transparent border-white text-white hover:bg-white/10 font-semibold rounded-lg">Khám Phá Dịch Vụ</Button>
              </div>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                {featureItems.map((item, index) => (
                  <motion.div key={index} className="flex items-center gap-2 text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">{item.icon}</span>
                    <span className="text-sm font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-5 relative">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-bank-gold/20 to-transparent rounded-full filter blur-3xl" />
              <div className="absolute -top-16 -right-8 z-20 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Khách hàng" className="w-full h-full object-cover" />
              </div>
              <div className="bank-card bg-gradient-to-br from-bank-blue to-bank-darkBlue p-6 md:p-8 rounded-2xl relative z-10 border border-white/10">
                <div className="flex justify-between items-start">
                  <div><p className="text-white/60 text-sm">Việt Trust Cao Cấp</p><h3 className="text-xl font-semibold text-white mt-1">Thẻ Visa Vàng</h3></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bank-gold to-yellow-500 flex items-center justify-center"><Landmark className="text-white w-6 h-6" /></div>
                </div>
                <div className="mt-10"><p className="text-white/60 text-xs">Số Thẻ</p><p className="text-white text-lg font-medium tracking-widest mt-1">**** **** **** 8529</p></div>
                <div className="mt-6 flex justify-between">
                  <div><p className="text-white/60 text-xs">Chủ Thẻ</p><p className="text-white text-base mt-1">NGUYỄN VĂN A</p></div>
                  <div><p className="text-white/60 text-xs">Hết Hạn</p><p className="text-white text-base mt-1">05/26</p></div>
                </div>
                <div className="absolute bottom-8 right-8"><svg className="w-12 h-12" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#FFD700" fillOpacity="0.2" /><circle cx="24" cy="24" r="16" fill="#FFD700" fillOpacity="0.4" /><circle cx="24" cy="24" r="12" fill="#FFD700" /></svg></div>
              </div>
              <div className="bank-card absolute top-[-20px] left-[-20px] bg-gradient-to-br from-bank-red to-pink-700 p-6 md:p-8 rounded-2xl border border-white/10 transform -rotate-6 z-0 opacity-70">
                <div className="flex justify-between items-start opacity-50">
                  <div><p className="text-white/60 text-sm">Việt Trust</p><h3 className="text-xl font-semibold text-white mt-1">Bạch Kim</h3></div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Landmark className="text-white w-6 h-6" /></div>
                </div>
              </div>
              <div className="absolute -bottom-12 -left-12 z-20 w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <img src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Nhóm khách hàng" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

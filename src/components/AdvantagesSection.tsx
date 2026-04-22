import { useEffect, useRef, useState } from "react";
import { Settings, Shield, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const AdvantagesSection = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const advantages = [
    { icon: <Shield className="w-10 h-10 text-white" />, title: t('adv.security.title'), description: t('adv.security.desc'), color: "from-bank-blue to-bank-lightBlue" },
    { icon: <Settings className="w-10 h-10 text-white" />, title: t('adv.personalized.title'), description: t('adv.personalized.desc'), color: "from-bank-red to-rose-500" },
    { icon: <Zap className="w-10 h-10 text-white" />, title: t('adv.fast.title'), description: t('adv.fast.desc'), color: "from-bank-gold to-amber-400" },
    { icon: <Globe className="w-10 h-10 text-white" />, title: t('adv.global.title'), description: t('adv.global.desc'), color: "from-bank-green to-emerald-400" },
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
              <p className="text-bank-blue font-semibold mb-3">{t('adv.label')}</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('adv.heading')}</h2>
              <p className="text-gray-600 mb-8">{t('adv.desc')}</p>
              <div className="space-y-6">
                {[{ num: "1", title: t('adv.point1.title'), desc: t('adv.point1.desc') }, { num: "2", title: t('adv.point2.title'), desc: t('adv.point2.desc') }, { num: "3", title: t('adv.point3.title'), desc: t('adv.point3.desc') }].map((item) => (
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

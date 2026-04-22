import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, CreditCard, Landmark, Wallet, PiggyBank, BanknoteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Service { id: string; title: string; description: string; icon: JSX.Element; color: string; }

const ServiceCard = ({ service, isActive, onClick, learnMore }: { service: Service; isActive: boolean; onClick: () => void; learnMore: string }) => (
  <div className={cn("feature-card cursor-pointer p-6 md:p-8 h-full", isActive ? "bg-white shadow-xl" : "bg-gray-50 hover:bg-white hover:shadow-lg")} onClick={onClick}>
    <div className={cn("rounded-2xl w-16 h-16 flex items-center justify-center text-white mb-6", service.color)}>{service.icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
    <p className="text-gray-600 mb-4">{service.description}</p>
    <button className="flex items-center text-bank-blue font-medium group">{learnMore} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" /></button>
  </div>
);

const ServicesSection = () => {
  const { t } = useLanguage();
  const services: Service[] = [
    { id: "personal", title: t('svc.personal.title'), description: t('svc.personal.desc'), icon: <Wallet className="w-10 h-10" />, color: "bg-gradient-to-br from-bank-blue to-bank-lightBlue" },
    { id: "business", title: t('svc.business.title'), description: t('svc.business.desc'), icon: <Landmark className="w-10 h-10" />, color: "bg-gradient-to-br from-bank-green to-emerald-300" },
    { id: "cards", title: t('svc.cards.title'), description: t('svc.cards.desc'), icon: <CreditCard className="w-10 h-10" />, color: "bg-gradient-to-br from-bank-gold to-amber-300" },
    { id: "loans", title: t('svc.loans.title'), description: t('svc.loans.desc'), icon: <BanknoteIcon className="w-10 h-10" />, color: "bg-gradient-to-br from-bank-red to-rose-300" },
    { id: "invest", title: t('svc.invest.title'), description: t('svc.invest.desc'), icon: <ArrowUpRight className="w-10 h-10" />, color: "bg-gradient-to-br from-purple-600 to-purple-300" },
    { id: "savings", title: t('svc.savings.title'), description: t('svc.savings.desc'), icon: <PiggyBank className="w-10 h-10" />, color: "bg-gradient-to-br from-cyan-600 to-cyan-300" },
  ];
  const [activeService, setActiveService] = useState(services[0].id);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={cn("transform transition-all duration-700 delay-100", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <p className="text-bank-blue font-semibold mb-3">{t('svc.label')}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('svc.heading')}</h2>
            <p className="text-gray-600">{t('svc.subheading')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={service.id} className={cn("transform transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20")} style={{ transitionDelay: `${150 + index * 100}ms` }}>
              <ServiceCard service={service} isActive={activeService === service.id} onClick={() => setActiveService(service.id)} learnMore={t('svc.learnMore')} />
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <a href="#" className="inline-flex items-center justify-center px-6 py-3 bg-bank-blue text-white rounded-lg hover:bg-bank-darkBlue transition-all duration-300">{t('svc.viewAll')} <ArrowRight className="ml-2 w-4 h-4" /></a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

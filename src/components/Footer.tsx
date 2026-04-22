import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const categories = [
    { title: t('foot.cat.banking'), links: [t('foot.bank.personal'), t('foot.bank.business'), t('foot.bank.private'), t('foot.bank.digital'), t('foot.bank.loans')] },
    { title: t('foot.cat.company'), links: [t('foot.co.about'), t('foot.co.careers'), t('foot.co.news'), t('foot.co.investors'), t('foot.co.csr')] },
    { title: t('foot.cat.support'), links: [t('foot.sup.help'), t('foot.sup.contact'), t('foot.sup.faq'), t('foot.sup.security'), t('foot.sup.fraud')] },
    { title: t('foot.cat.legal'), links: [t('foot.lg.terms'), t('foot.lg.privacy'), t('foot.lg.cookies'), t('foot.lg.license'), t('foot.lg.fees')] },
  ];
  return (
  <footer className="bg-bank-blue text-white">
    <div className="container mx-auto px-4 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <span className="inline-flex bg-white rounded-md px-3 py-2 mb-3 shadow-sm">
              <img src="/viettrustbank-logo.png" alt="VietTrustBank" className="h-9 w-auto" />
            </span>
            <p className="text-white/70 max-w-sm mt-3">{t('foot.desc')}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start"><MapPin className="w-5 h-5 text-bank-gold mr-3 mt-0.5" /><p className="text-white/70 whitespace-pre-line">{t('foot.address')}</p></div>
            <div className="flex items-center"><Phone className="w-5 h-5 text-bank-gold mr-3" /><p className="text-white/70">+84 (28) VIETTRUST</p></div>
            <div className="flex items-center"><Mail className="w-5 h-5 text-bank-gold mr-3" /><p className="text-white/70">support@viettrusttaichinh.online</p></div>
          </div>
          <div className="mt-8">
            <p className="text-white/70 mb-3">{t('foot.connect')}</p>
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
          <p className="text-white/60 text-sm">© {new Date().getFullYear()} Việt Trust Bank. {t('foot.rights')}</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            {[t('foot.bottom.privacy'), t('foot.bottom.terms'), t('foot.bottom.cookies')].map((label, i) => (<a key={i} href="#" className="text-white/60 hover:text-white text-sm transition-colors duration-200">{label}</a>))}
          </div>
        </div>
        <div className="mt-6 text-white/50 text-xs text-center"><p>{t('foot.regulated')}</p></div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Lock, LogOut, LayoutDashboard, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.services'), path: "/services" },
    { name: t('nav.about'), path: "/about" },
    { name: t('nav.contact'), path: "/contact" }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll and manage focus when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full", scrolled ? "bg-white py-2 md:py-3 shadow-lg" : "bg-gradient-to-r from-bank-darkBlue/95 to-bank-blue/95 backdrop-blur-sm py-3 md:py-5")}>
      <div className="container mx-auto flex items-center justify-between px-4 max-w-7xl w-full">
        <Link to="/" className="flex items-center gap-2" aria-label="VietTrustBank">
          <span className={cn("inline-flex rounded-md px-2 py-1 transition-colors", scrolled ? "bg-transparent" : "bg-white shadow-sm")}>
            <img src="/viettrustbank-logo.png" alt="VietTrustBank" className="h-7 sm:h-8 w-auto" />
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          <nav className="flex items-center space-x-1 mr-4">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} className={cn("px-3 py-2 rounded-md transition-colors duration-300 text-sm", scrolled ? "text-gray-700 hover:text-bank-blue hover:bg-gray-100" : "text-white hover:bg-white/10")}>{item.name}</Link>
            ))}
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className={cn("flex items-center gap-1", scrolled ? "text-gray-700" : "text-white hover:bg-white/10")}>
              <Globe className="w-4 h-4" /> {language === 'vi' ? 'EN' : 'VI'}
            </Button>
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}
                  className={cn("flex items-center gap-1", !scrolled && "border-white/30 text-white hover:bg-white/10")}>
                  <LayoutDashboard className="w-4 h-4" /> {t('nav.dashboard')}
                </Button>
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin')}
                    className={cn("flex items-center gap-1", !scrolled && "border-white/30 text-white hover:bg-white/10")}>
                    <Shield className="w-4 h-4" /> Admin
                  </Button>
                )}
                <Button size="sm" onClick={handleSignOut}
                  className="bg-gradient-to-r from-bank-gold to-bank-darkBlue flex items-center gap-1 text-white">
                  <LogOut className="w-4 h-4" /> {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/signup')}
                  className={cn(!scrolled && "border-white/30 text-white hover:bg-white/10")}>{t('nav.signup')}</Button>
                <Button size="sm" onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-bank-gold to-bank-darkBlue flex items-center gap-1 text-white">
                  <Lock className="w-4 h-4" /> {t('nav.login')}
                </Button>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X className={cn("w-6 h-6", scrolled ? "text-bank-blue" : "text-white")} /> : <Menu className={cn("w-6 h-6", scrolled ? "text-bank-blue" : "text-white")} />}
        </button>
      </div>
      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
        className={cn(
          "md:hidden fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileMenuOpen}
        className={cn(
          "md:hidden fixed inset-x-0 top-0 z-[60] bg-bank-darkBlue shadow-2xl transform-gpu transition-all duration-300 ease-in-out h-[100dvh]",
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3">
            <span className="inline-flex bg-white rounded-md px-2 py-1 shrink-0">
              <img src="/viettrustbank-logo.png" alt="VietTrustBank" className="h-6 w-auto" />
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 shrink-0" aria-label="Close menu">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-white">{item.name}</Link>
              ))}
              <button onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} className="text-base font-medium text-white text-left flex items-center gap-2">
                <Globe className="w-4 h-4" /> {language === 'vi' ? 'English' : 'Tiếng Việt'}
              </button>
            </nav>
          </div>
          <div className="p-4 border-t border-white/10 grid grid-cols-1 gap-3">
            {user ? (
              <>
                <Button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="w-full bg-white text-bank-darkBlue font-bold">
                  <LayoutDashboard className="w-4 h-4 mr-1" /> {t('nav.dashboard')}
                </Button>
                {isAdmin && (
                  <Button onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }} variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-transparent hover:text-white">
                    <Shield className="w-4 h-4 mr-1" /> Admin
                  </Button>
                )}
                <Button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-transparent hover:text-white">
                  <LogOut className="w-4 h-4 mr-1" /> {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-transparent hover:text-white">
                  {t('nav.signup')}
                </Button>
                <Button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-bank-gold to-amber-500 text-bank-darkBlue font-bold">
                  <Lock className="w-4 h-4 mr-1" /> {t('nav.login')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

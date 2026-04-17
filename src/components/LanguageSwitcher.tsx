import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
      className="flex items-center gap-1.5 text-sm"
    >
      <Globe className="w-4 h-4" />
      {language === 'vi' ? 'EN' : 'VI'}
    </Button>
  );
};

export default LanguageSwitcher;

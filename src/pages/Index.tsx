import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import AdvantagesSection from '../components/AdvantagesSection';
import MobileBankingSection from '../components/MobileBankingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsSection from '../components/NewsSection';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 w-full overflow-x-hidden">
      <Navbar />
      <div className="relative overflow-hidden w-full">
        <HeroSection />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full bg-bank-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-bank-blue/5 blur-3xl" />
      </div>
      <ServicesSection />
      <div className="relative w-full">
        <AdvantagesSection />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] rounded-full bg-gradient-radial from-bank-gold/5 to-transparent blur-3xl" />
      </div>
      <MobileBankingSection />
      <TestimonialsSection />
      <div className="relative overflow-hidden w-full">
        <NewsSection />
        <div className="absolute top-0 left-0 -translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-bank-red/5 blur-3xl" />
      </div>
      <CallToAction />
      <Footer />
    </main>
  );
};

export default Index;

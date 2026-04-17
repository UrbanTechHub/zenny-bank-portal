import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const Contact = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(language === 'vi' ? 'Yêu cầu đã được gửi! Chúng tôi sẽ liên hệ sớm.' : 'Request sent! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: Phone, title: language === 'vi' ? 'Điện Thoại' : 'Phone', lines: ['+84 (28) 1234 5678', '+84 (28) 8765 4321'] },
    { icon: Mail, title: 'Email', lines: ['info@viettrust.bank', 'support@viettrust.bank'] },
    { icon: MapPin, title: language === 'vi' ? 'Địa Chỉ' : 'Address', lines: [language === 'vi' ? '123 Đường Tài Chính, Quận 1' : '123 Finance Street, District 1', 'TP. Hồ Chí Minh, Việt Nam'] },
    { icon: Clock, title: language === 'vi' ? 'Giờ Làm Việc' : 'Working Hours', lines: [language === 'vi' ? 'Thứ 2 - Thứ 6: 8:00 - 17:00' : 'Mon - Fri: 8:00 - 17:00', language === 'vi' ? 'Thứ 7: 8:00 - 12:00' : 'Sat: 8:00 - 12:00'] },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-bank-darkBlue via-bank-blue to-bank-darkBlue text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-bank-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'vi' ? 'Liên Hệ Với Chúng Tôi' : 'Contact Us'}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {language === 'vi'
              ? 'Chúng tôi luôn sẵn sàng hỗ trợ bạn. Liên hệ với chúng tôi qua các kênh dưới đây hoặc ghé thăm chi nhánh gần nhất.'
              : 'We are always ready to help you. Contact us through the channels below or visit the nearest branch.'}
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-bank-darkBlue mb-6">
                {language === 'vi' ? 'Thông Tin Liên Hệ' : 'Contact Information'}
              </h2>
              {contactInfo.map((info) => (
                <div key={info.title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-bank-blue to-bank-lightBlue rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bank-darkBlue">{info.title}</h3>
                    {info.lines.map((line, i) => (
                      <p key={i} className="text-gray-600 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-bank-darkBlue mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-bank-blue" />
                {language === 'vi' ? 'Gửi Tin Nhắn' : 'Send a Message'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{language === 'vi' ? 'Họ và Tên' : 'Full Name'}</label>
                    <input name="name" value={formData.name} onChange={handleChange}
                      className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-bank-blue" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange}
                      className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-bank-blue" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{language === 'vi' ? 'Số Điện Thoại' : 'Phone'}</label>
                    <input name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-bank-blue" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{language === 'vi' ? 'Chủ Đề' : 'Subject'}</label>
                    <input name="subject" value={formData.subject} onChange={handleChange}
                      className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-bank-blue" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{language === 'vi' ? 'Tin Nhắn' : 'Message'}</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-bank-blue resize-none" required />
                </div>
                <Button type="submit" className="w-full h-11 bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white font-semibold">
                  <Send className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Gửi Tin Nhắn' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

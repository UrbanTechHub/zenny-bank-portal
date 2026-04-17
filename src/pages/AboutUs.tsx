import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Users, Award, Building, Clock, MapPin, Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutUs = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-bank-darkBlue via-bank-blue to-bank-darkBlue text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-bank-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'vi' ? 'Về Chúng Tôi' : 'About Us'}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {language === 'vi'
              ? 'Việt Trust Bank là đối tác ngân hàng đáng tin cậy của bạn, cung cấp các giải pháp tài chính toàn diện với sự kết hợp giữa giá trị truyền thống và công nghệ đổi mới.'
              : 'Viet Trust Bank is your trusted banking partner, providing comprehensive financial solutions combining traditional values with innovative technology.'}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=800" alt="Bank building" className="rounded-2xl shadow-xl w-full h-80 object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-bank-darkBlue mb-4">
                {language === 'vi' ? 'Câu Chuyện Của Chúng Tôi' : 'Our Story'}
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {language === 'vi'
                  ? 'Thành lập vào năm 2010, Việt Trust Bank bắt đầu với tầm nhìn cung cấp các dịch vụ ngân hàng hiện đại và dễ tiếp cận cho người dân Việt Nam. Từ những ngày đầu với chỉ một văn phòng nhỏ tại Hà Nội, chúng tôi đã phát triển thành một trong những tổ chức tài chính đáng tin cậy nhất trong khu vực.'
                  : 'Founded in 2010, Viet Trust Bank started with a vision to provide modern and accessible banking services for the people of Vietnam. From our humble beginnings with a small office in Hanoi, we have grown into one of the most trusted financial institutions in the region.'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {language === 'vi'
                  ? 'Sự phát triển của chúng tôi dựa trên các nguyên tắc về tính minh bạch, đổi mới và cam kết không ngừng với sự hài lòng của khách hàng.'
                  : 'Our growth is built on principles of transparency, innovation, and an unwavering commitment to customer satisfaction.'}
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  language === 'vi' ? 'Minh bạch' : 'Transparency',
                  language === 'vi' ? 'Đáng tin cậy' : 'Trustworthy',
                  language === 'vi' ? 'Đổi mới' : 'Innovation',
                  language === 'vi' ? 'Bảo mật' : 'Security'
                ].map((val) => (
                  <span key={val} className="flex items-center gap-1 bg-bank-blue/10 text-bank-blue px-3 py-1.5 rounded-full text-sm font-medium">
                    <Check className="w-4 h-4" /> {val}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-bank-blue to-bank-lightBlue rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-bank-darkBlue mb-3">
                {language === 'vi' ? 'Tầm Nhìn' : 'Our Vision'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'vi'
                  ? 'Trở thành ngân hàng hàng đầu tại Việt Nam, được biết đến với các giải pháp tài chính sáng tạo và dịch vụ khách hàng xuất sắc, góp phần vào sự phát triển bền vững của đất nước.'
                  : 'To become the leading bank in Vietnam, known for innovative financial solutions and excellent customer service, contributing to the sustainable development of the country.'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-bank-gold to-amber-500 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-bank-darkBlue mb-3">
                {language === 'vi' ? 'Sứ Mệnh' : 'Our Mission'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'vi'
                  ? 'Cung cấp các dịch vụ tài chính toàn diện, an toàn và tiện lợi, giúp khách hàng đạt được mục tiêu tài chính của họ thông qua các giải pháp ngân hàng hiện đại và đáng tin cậy.'
                  : 'To provide comprehensive, secure, and convenient financial services, helping customers achieve their financial goals through modern and reliable banking solutions.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-bank-darkBlue to-bank-blue text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: '5M+', label: language === 'vi' ? 'Khách Hàng' : 'Customers' },
              { icon: Building, value: '500+', label: language === 'vi' ? 'Chi Nhánh' : 'Branches' },
              { icon: Award, value: '15+', label: language === 'vi' ? 'Năm Kinh Nghiệm' : 'Years Experience' },
              { icon: Clock, value: '24/7', label: language === 'vi' ? 'Hỗ Trợ' : 'Support' },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-bank-gold" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;

import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, TrendingUp } from 'lucide-react';

interface HeroProps {
  language: 'vi' | 'en' | 'de';
}

export function Hero({ language }: HeroProps) {
  const translations = {
    vi: {
      badge: 'Bộ sưu tập mới 2025',
      title: 'Autumn Store',
      subtitle: 'Khám phá phong cách thời trang độc đáo với những thiết kế tinh tế và chất lượng cao',
      shopNow: 'Mua sắm ngay',
      learnMore: 'Tìm hiểu thêm',
      feature1Title: 'Sản phẩm chất lượng',
      feature1Desc: 'Tuyển chọn những sản phẩm tốt nhất với chất liệu cao cấp',
      feature2Title: 'Xu hướng mới nhất',
      feature2Desc: 'Luôn cập nhật những xu hướng thời trang mới nhất',
    },
    en: {
      badge: 'New Collection 2025',
      title: 'Autumn Store',
      subtitle: 'Discover unique fashion styles with delicate designs and high quality',
      shopNow: 'Shop Now',
      learnMore: 'Learn More',
      feature1Title: 'Quality Products',
      feature1Desc: 'Selected best products with premium materials',
      feature2Title: 'Latest Trends',
      feature2Desc: 'Always updated with the latest fashion trends',
    },
    de: {
      badge: 'Neue Kollektion 2025',
      title: 'Autumn Store',
      subtitle: 'Entdecken Sie einzigartige Modestile mit feinen Designs und hoher Qualität',
      shopNow: 'Jetzt einkaufen',
      learnMore: 'Mehr erfahren',
      feature1Title: 'Qualitätsprodukte',
      feature1Desc: 'Ausgewählte beste Produkte mit Premium-Materialien',
      feature2Title: 'Neueste Trends',
      feature2Desc: 'Immer auf dem neuesten Stand der Mode',
    },
  };

  const t = translations[language];
  return (
    <>
      {/* Hero Banner */}
      <section id="home" className="relative h-[400px] sm:h-[500px] bg-gradient-to-br from-rose-200 via-orange-100 to-amber-200">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1603805785279-da750208c094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzY0NjgzMDM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Autumn Collection"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-100/70 to-amber-100/50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-block bg-rose-500 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-3 sm:mb-4 text-sm sm:text-base">
              {t.badge}
            </div>
            <h2 className="text-gray-900 mb-3 sm:mb-4">
              {t.title}
            </h2>
            <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#products"
                className="inline-block text-center bg-rose-500 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg hover:bg-rose-600 transition-colors shadow-lg text-sm sm:text-base"
              >
                {t.shopNow}
              </a>
              <a
                href="#about"
                className="inline-block text-center bg-white/80 backdrop-blur-sm text-gray-900 px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg hover:bg-white transition-colors border border-rose-200 text-sm sm:text-base"
              >
                {t.learnMore}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-orange-100 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-rose-200">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full mb-3 sm:mb-4">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">{t.feature1Title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {t.feature1Desc}
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-rose-200">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">{t.feature2Title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {t.feature2Desc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
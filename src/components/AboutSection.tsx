import { Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AboutSectionProps {
  language: 'vi' | 'en' | 'de';
}

export function AboutSection({ language }: AboutSectionProps) {
  const translations = {
    vi: {
      title: 'Về Chúng Tôi',
      subtitle: 'Câu chuyện về một cửa hàng nhỏ xinh được tạo nên từ niềm đam mê và tình yêu',
      welcomeTitle: 'Chào Mừng Đến Với Autumn',
      para1: 'là một cửa hàng nhỏ xinh được sinh ra từ tình yêu với thời trang và mong muốn mang đến những sản phẩm chất lượng, phong cách cho mọi người.',
      para2: 'Tại Autumn, chúng tôi tin rằng mỗi món đồ đều có câu chuyện riêng và khả năng làm thay đổi ngày của bạn. Từ những chiếc áo len ấm áp đến những phụ kiện tinh tế, mỗi sản phẩm đều được chọn lọc kỹ lưỡng với sự tận tâm và yêu thương.',
      para3: 'Chúng tôi không chỉ bán hàng, mà còn xây dựng một cộng đồng những người yêu thích phong cách sống đơn giản, tinh tế và ấm áp như chính mùa thu.',
      quote: '"Mỗi sản phẩm là một lời chào, mỗi khách hàng là một người bạn"',
      feature1Title: 'Tận Tâm',
      feature1Desc: 'Chăm sóc từng chi tiết nhỏ để mang đến trải nghiệm tuyệt vời nhất cho bạn',
      feature2Title: 'Chất Lượng',
      feature2Desc: 'Sản phẩm được tuyển chọn kỹ càng, đảm bảo chất lượng và độ bền cao',
      feature3Title: 'Phong Cách',
      feature3Desc: 'Thiết kế tinh tế, phù hợp với xu hướng và phong cách riêng của bạn',
    },
    en: {
      title: 'About Us',
      subtitle: 'A story about a lovely little shop created from passion and love',
      welcomeTitle: 'Welcome to Autumn',
      para1: 'is a lovely small store born from a love of fashion and a desire to bring quality, stylish products to everyone.',
      para2: 'At Autumn, we believe that every item has its own story and the ability to change your day. From cozy sweaters to delicate accessories, each product is carefully selected with dedication and love.',
      para3: 'We don\'t just sell products, we build a community of people who love a simple, refined, and warm lifestyle like autumn itself.',
      quote: '"Every product is a greeting, every customer is a friend"',
      feature1Title: 'Dedication',
      feature1Desc: 'Caring for every small detail to bring you the best experience',
      feature2Title: 'Quality',
      feature2Desc: 'Carefully selected products, ensuring high quality and durability',
      feature3Title: 'Style',
      feature3Desc: 'Refined design, matching trends and your personal style',
    },
    de: {
      title: 'Über Uns',
      subtitle: 'Eine Geschichte über einen kleinen, charmanten Laden, der aus Leidenschaft und Liebe entstanden ist',
      welcomeTitle: 'Willkommen bei Autumn',
      para1: 'ist ein kleiner, liebevoller Laden, der aus der Liebe zur Mode und dem Wunsch entstanden ist, qualitativ hochwertige und stilvolle Produkte für alle zu bieten.',
      para2: 'Bei Autumn glauben wir, dass jedes Produkt seine eigene Geschichte hat und die Fähigkeit besitzt, Ihren Tag zu verändern. Von gemütlichen Pullovern bis hin zu zarten Accessoires wird jedes Produkt mit Hingabe und Liebe sorgfältig ausgewählt.',
      para3: 'Wir verkaufen nicht nur Produkte, sondern bauen eine Gemeinschaft von Menschen auf, die einen einfachen, raffinierten und warmen Lebensstil lieben – genau wie der Herbst selbst.',
      quote: '"Jedes Produkt ist eine Begrüßung, jeder Kunde ist ein Freund"',
      feature1Title: 'Hingabe',
      feature1Desc: 'Pflege jedes kleinen Details, um Ihnen das beste Erlebnis zu bieten',
      feature2Title: 'Qualität',
      feature2Desc: 'Sorgfältig ausgewählte Produkte mit hoher Qualität und Langlebigkeit',
      feature3Title: 'Stil',
      feature3Desc: 'Raffiniertes Design, passend zu Trends und Ihrem persönlichen Stil',
    },
  };

  const t = translations[language];

  return (
    <section id="about" className="py-12 sm:py-16 bg-gradient-to-b from-rose-50 via-orange-50 to-amber-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-rose-300 rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-orange-300 rounded-full opacity-20 blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-rose-600 mb-3 sm:mb-4">{t.title}</h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base px-4">
            {t.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-rose-200">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1760243875581-5254272fc17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYm91dGlxdWUlMjBzdG9yZXxlbnwxfHx8fDE3NjQ2ODQwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Autumn Store"
                className="w-full h-[300px] sm:h-[400px] object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-rose-400 rounded-full opacity-30 blur-3xl"></div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 sm:space-y-6 px-2">
            <h3 className="text-rose-600">{t.welcomeTitle}</h3>
            
            <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base">
              <p>
                <span className="font-semibold text-rose-600">Autumn</span> {t.para1}
              </p>
              
              <p>
                {t.para2}
              </p>
              
              <p>
                {t.para3}
              </p>
            </div>

            <div className="pt-3 sm:pt-4">
              <p className="italic text-rose-600 text-sm sm:text-base">
                {t.quote}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-rose-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h4 className="text-gray-900 mb-2">{t.feature1Title}</h4>
            <p className="text-gray-600 text-sm sm:text-base">
              {t.feature1Desc}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-rose-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h4 className="text-gray-900 mb-2">{t.feature2Title}</h4>
            <p className="text-gray-600 text-sm sm:text-base">
              {t.feature2Desc}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-rose-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h4 className="text-gray-900 mb-2">{t.feature3Title}</h4>
            <p className="text-gray-600 text-sm sm:text-base">
              {t.feature3Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
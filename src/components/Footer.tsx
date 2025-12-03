import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  language: 'vi' | 'en' | 'de';
}

export function Footer({ language }: FooterProps) {
  const translations = {
    vi: {
      tagline: 'Thời trang mùa thu cho phong cách của bạn',
      links: 'Liên kết',
      home: 'Trang chủ',
      products: 'Sản phẩm',
      about: 'Về chúng tôi',
      contact: 'Liên hệ',
      contactTitle: 'Liên hệ',
      followUs: 'Theo dõi chúng tôi',
      copyright: 'Tất cả quyền được bảo lưu.',
    },
    en: {
      tagline: 'Autumn fashion for your style',
      links: 'Links',
      home: 'Home',
      products: 'Products',
      about: 'About Us',
      contact: 'Contact',
      contactTitle: 'Contact',
      followUs: 'Follow Us',
      copyright: 'All rights reserved.',
    },
    de: {
      tagline: 'Herbstmode für Ihren Stil',
      links: 'Links',
      home: 'Startseite',
      products: 'Produkte',
      about: 'Über uns',
      contact: 'Kontakt',
      contactTitle: 'Kontakt',
      followUs: 'Folgen Sie uns',
      copyright: 'Alle Rechte vorbehalten.',
    },
  };

  const t = translations[language];

  return (
    <footer id="contact" className="bg-gray-100 text-gray-900 border-t border-rose-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-rose-600 mb-3 sm:mb-4">Autumn</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {t.tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-gray-900 mb-3 sm:mb-4">{t.links}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-600 hover:text-rose-600 transition-colors text-sm sm:text-base">
                  {t.home}
                </a>
              </li>
              <li>
                <a href="#products" className="text-gray-600 hover:text-rose-600 transition-colors text-sm sm:text-base">
                  {t.products}
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-rose-600 transition-colors text-sm sm:text-base">
                  {t.about}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-rose-600 transition-colors text-sm sm:text-base">
                  {t.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 mb-3 sm:mb-4">{t.contactTitle}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+49 17636174514</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">info@autumn.vn</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <span>Kirchstr. 13 . 48231 Warendorf</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-gray-900 mb-3 sm:mb-4">{t.followUs}</h4>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61581815586136"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-rose-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-600">
          <p className="text-sm sm:text-base">&copy; 2025 Autumn. {t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
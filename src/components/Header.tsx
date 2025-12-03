import { ShoppingCart, Menu, X, Globe, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import logo from 'figma:asset/6d399e15fde83d24f97f7525b809f5a276f36d8a.png';
import euroIcon from 'figma:asset/f332a9f9dc88f477abf57f333f82392f927791ce.png';
import { User as UserType } from './AuthModal';
import { AccountMenu } from './AccountMenu';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  language: 'vi' | 'en' | 'de';
  onLanguageChange: (lang: 'vi' | 'en' | 'de') => void;
  currentUser: UserType | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onAccountNavigate?: (page: 'orders' | 'invoices' | 'profile') => void;
  onAvatarUpdate?: (file: File) => void;
}

export function Header({ cartCount, onCartClick, language, onLanguageChange, currentUser, onAuthClick, onLogout, onAccountNavigate, onAvatarUpdate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const langs: ('vi' | 'en' | 'de')[] = ['vi', 'en', 'de'];
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    onLanguageChange(langs[nextIndex]);
  };

  const translations = {
    vi: {
      home: 'Trang chủ',
      products: 'Sản phẩm',
      about: 'Về chúng tôi',
      contact: 'Liên hệ',
      cart: 'Giỏ hàng',
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      welcome: 'Xin chào',
      greeting: 'Chúc các bạn một ngày tốt lành',
      shoppingWish: 'Chúc các bạn mua sắm ưng ý',
      happyShopping: 'Chúc các bạn mua sắm ứng ý',
    },
    en: {
      home: 'Home',
      products: 'Products',
      about: 'About Us',
      contact: 'Contact',
      cart: 'Cart',
      login: 'Login',
      logout: 'Logout',
      welcome: 'Hello',
      greeting: 'Have a wonderful day',
      shoppingWish: 'Happy shopping',
      happyShopping: 'Happy shopping to your satisfaction',
    },
    de: {
      home: 'Startseite',
      products: 'Produkte',
      about: 'Über uns',
      contact: 'Kontakt',
      cart: 'Warenkorb',
      login: 'Anmelden',
      logout: 'Abmelden',
      welcome: 'Hallo',
      greeting: 'Ich wünsche dir einen schönen Tag',
      shoppingWish: 'Viel Spaß beim Einkaufen',
      happyShopping: 'Viel Freude beim Einkaufen',
    },
  };

  const t = translations[language];

  // Flag icon components for better cross-browser support
  const FlagIcon = () => {
    if (language === 'vi') {
      return (
        <svg className="w-5 h-4" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="30" height="20" fill="#DA251D"/>
          <path d="M15 5L16.545 10.09H21.854L17.654 13.09L19.199 18.18L15 15.18L10.801 18.18L12.346 13.09L8.146 10.09H13.455L15 5Z" fill="#FFFF00"/>
        </svg>
      );
    }
    if (language === 'en') {
      return (
        <svg className="w-5 h-4" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="30" height="20" fill="#012169"/>
          <path d="M0 0L30 20M30 0L0 20" stroke="white" strokeWidth="4"/>
          <path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="2.4"/>
          <path d="M15 0V20M0 10H30" stroke="white" strokeWidth="6.67"/>
          <path d="M15 0V20M0 10H30" stroke="#C8102E" strokeWidth="4"/>
        </svg>
      );
    }
    return (
      <svg className="w-5 h-4" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="6.67" fill="#000"/>
        <rect y="6.67" width="30" height="6.67" fill="#D00"/>
        <rect y="13.33" width="30" height="6.67" fill="#FFCE00"/>
      </svg>
    );
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-rose-100">
      {/* Top Banner - Greeting */}
      <div className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 text-white py-2 sm:py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center font-medium animate-pulse text-sm sm:text-base">
            ✨ {t.greeting} ✨
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo with Notice Banner */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            <a 
              href="#admin" 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Admin Panel"
            >
              <img src={logo} alt="Autumn Store" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            </a>
            
            {/* Speech Bubble Banner - floating above logo - DESKTOP ONLY >= 1024px */}
            <div className="hidden lg:block absolute left-8 -top-12 pointer-events-none z-10">
              {/* Main bubble */}
              <div className="bg-red-500 border-3 border-orange-500 rounded-3xl px-6 py-3 shadow-xl whitespace-nowrap">
                <p className="text-white font-medium text-sm">
                  {t.happyShopping}
                </p>
              </div>
              {/* Bubble tail - bottom-left corner pointing down-left to logo */}
              <div className="absolute -bottom-3 left-2">
                <div className="relative">
                  {/* Orange border triangle - pointing down-left */}
                  <div 
                    className="w-0 h-0"
                    style={{
                      borderTop: '14px solid #f97316',
                      borderRight: '14px solid transparent',
                      borderBottom: '0px solid transparent',
                      borderLeft: '6px solid transparent',
                    }}
                  ></div>
                  {/* Red inner triangle */}
                  <div 
                    className="absolute top-0 left-0"
                    style={{
                      borderTop: '11px solid #ef4444',
                      borderRight: '11px solid transparent',
                      borderBottom: '0px solid transparent',
                      borderLeft: '4px solid transparent',
                      transform: 'translate(1px, -1px)',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <a href="#home" className="text-gray-700 hover:text-rose-600 transition-colors text-sm lg:text-base">
              {t.home}
            </a>
            <a href="#products" className="text-gray-700 hover:text-rose-600 transition-colors text-sm lg:text-base">
              {t.products}
            </a>
            <a href="#about" className="text-gray-700 hover:text-rose-600 transition-colors text-sm lg:text-base">
              {t.about}
            </a>
            <a href="#contact" className="text-gray-700 hover:text-rose-600 transition-colors text-sm lg:text-base">
              {t.contact}
            </a>
          </nav>

          {/* Language Switcher & Auth & Cart Icon */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center space-x-2 px-2 py-1 sm:px-3 sm:py-1.5 text-gray-700 hover:text-rose-600 border border-rose-200 rounded-lg hover:border-rose-400 transition-colors"
              aria-label="Đổi ngôn ngữ"
            >
              <FlagIcon />
              <span className="uppercase text-sm font-medium">{language}</span>
            </button>

            {/* Auth / Account Menu */}
            {currentUser ? (
              <div className="hidden md:block">
                <AccountMenu
                  user={{
                    email: currentUser.email,
                    name: currentUser.name,
                    phone: currentUser.phone,
                    address: currentUser.address,
                    avatar: currentUser.avatar,
                  }}
                  onLogout={onLogout}
                  onNavigate={(page) => onAccountNavigate?.(page)}
                  onAvatarUpdate={(file) => onAvatarUpdate?.(file)}
                />
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors text-sm lg:text-base"
              >
                <User className="w-4 h-4" />
                {t.login}
              </button>
            )}

            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors"
              aria-label={t.cart}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 bg-rose-50 rounded-b-lg">
            <a
              href="#home"
              className="block px-4 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.home}
            </a>
            <a
              href="#products"
              className="block px-4 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.products}
            </a>
            <a
              href="#about"
              className="block px-4 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.about}
            </a>
            <a
              href="#contact"
              className="block px-4 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.contact}
            </a>
            
            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-colors"
            >
              <FlagIcon />
              <span className="uppercase font-medium">{language}</span>
            </button>
            
            {/* Mobile Auth */}
            {currentUser ? (
              <div className="px-4 py-2 space-y-2">
                <p className="text-gray-700">{t.welcome}, {currentUser.name}</p>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onAuthClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full mx-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                <User className="w-4 h-4" />
                {t.login}
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
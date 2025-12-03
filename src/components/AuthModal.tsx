import { X, User, Mail, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3ad4bbb9`;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  language: 'vi' | 'en' | 'de';
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  street: string;
  houseNumber: string;
  addressExtra: string;
  postalCode: string;
  city: string;
  customerNumber?: string;
  avatar?: string;
}

export function AuthModal({ isOpen, onClose, onLogin, language }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    street: '',
    houseNumber: '',
    addressExtra: '',
    postalCode: '',
    city: '',
  });

  const translations = {
    vi: {
      login: 'Đăng nhập',
      register: 'Đăng ký',
      loginSubtitle: 'Chào mừng trở lại!',
      registerSubtitle: 'Tạo tài khoản miễn phí',
      switchToRegister: 'Chưa có tài khoản? Đăng ký',
      switchToLogin: 'Đã có tài khoản? Đăng nhập',
      email: 'Email',
      password: 'Mật khẩu',
      name: 'Họ và tên',
      phone: 'Số điện thoại',
      street: 'Tên đường',
      houseNumber: 'Số nhà',
      addressExtra: 'Địa chỉ đi kèm',
      postalCode: 'Mã bưu điện',
      city: 'Thành phố',
      loginButton: 'Đăng nhập',
      registerButton: 'Đăng ký',
      close: 'Đóng',
      emailPlaceholder: 'email@example.com',
      passwordPlaceholder: '••••••••',
      namePlaceholder: 'Nguyễn Văn A',
      phonePlaceholder: '+49 123 456789',
      streetPlaceholder: 'Hauptstraße',
      houseNumberPlaceholder: '123',
      addressExtraPlaceholder: 'Tầng 2, Căn hộ 5 (tùy chọn)',
      postalCodePlaceholder: '48231',
      cityPlaceholder: 'Warendorf',
    },
    en: {
      login: 'Login',
      register: 'Register',
      loginSubtitle: 'Welcome back!',
      registerSubtitle: 'Create your free account',
      switchToRegister: "Don't have an account? Register",
      switchToLogin: 'Already have an account? Login',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      phone: 'Phone Number',
      street: 'Street Name',
      houseNumber: 'House Number',
      addressExtra: 'Additional Address',
      postalCode: 'Postal Code',
      city: 'City',
      loginButton: 'Login',
      registerButton: 'Register',
      close: 'Close',
      emailPlaceholder: 'your@email.com',
      passwordPlaceholder: '••••••••',
      namePlaceholder: 'John Doe',
      phonePlaceholder: '+1 123 456789',
      streetPlaceholder: 'Main Street',
      houseNumberPlaceholder: '123',
      addressExtraPlaceholder: 'Floor 2, Apt 5 (optional)',
      postalCodePlaceholder: '12345',
      cityPlaceholder: 'New York',
    },
    de: {
      login: 'Anmelden',
      register: 'Konto eröffnen',
      loginSubtitle: 'Willkommen zurück!',
      registerSubtitle: 'Erstellen Sie Ihr kostenloses Konto',
      switchToRegister: 'Noch kein Konto? Registrieren',
      switchToLogin: 'Bereits ein Konto? Anmelden',
      email: 'E-Mail',
      password: 'Passwort',
      name: 'Vollständiger Name',
      phone: 'Telefonnummer',
      street: 'Straßenname',
      houseNumber: 'Hausnummer',
      addressExtra: 'Adresszusatz',
      postalCode: 'Postleitzahl',
      city: 'Stadt',
      loginButton: 'Anmelden',
      registerButton: 'Registrieren',
      close: 'Schließen',
      emailPlaceholder: 'ihre@email.com',
      passwordPlaceholder: '••••••••',
      namePlaceholder: 'Max Mustermann',
      phonePlaceholder: '+49 123 456789',
      streetPlaceholder: 'Hauptstraße',
      houseNumberPlaceholder: '123',
      addressExtraPlaceholder: 'Etage 2, Wohnung 5 (optional)',
      postalCodePlaceholder: '48231',
      cityPlaceholder: 'Warendorf',
    },
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        // Login using Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Login error:', error);
          const errorMessages = {
            vi: error.message.includes('Invalid') 
              ? 'Email hoặc mật khẩu không đúng. Chưa có tài khoản? Hãy đăng ký trước!'
              : 'Lỗi đăng nhập. Vui lòng thử lại.',
            en: error.message.includes('Invalid')
              ? 'Invalid email or password. No account yet? Please register first!'
              : 'Login error. Please try again.',
            de: error.message.includes('Invalid')
              ? 'Ungültige E-Mail oder Passwort. Noch kein Konto? Bitte registrieren Sie sich zuerst!'
              : 'Anmeldefehler. Bitte versuchen Sie es erneut.',
          };
          alert(errorMessages[language]);
          setIsLoading(false);
          return;
        }

        if (data.session && data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email ?? '',
            name: data.user.user_metadata.name ?? '',
            phone: data.user.user_metadata.phone ?? '',
            street: data.user.user_metadata.street ?? '',
            houseNumber: data.user.user_metadata.houseNumber ?? '',
            addressExtra: data.user.user_metadata.addressExtra ?? '',
            postalCode: data.user.user_metadata.postalCode ?? '',
            city: data.user.user_metadata.city ?? '',
            customerNumber: data.user.user_metadata.customerNumber ?? '',
            avatar: data.user.user_metadata.avatar ?? '',
          };
          
          onLogin(user);
          
          // Reset form
          setFormData({
            email: '',
            password: '',
            name: '',
            phone: '',
            street: '',
            houseNumber: '',
            addressExtra: '',
            postalCode: '',
            city: '',
          });
          onClose();
        }
      } else {
        // Register new user via server endpoint
        const response = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
            street: formData.street,
            houseNumber: formData.houseNumber,
            addressExtra: formData.addressExtra,
            postalCode: formData.postalCode,
            city: formData.city,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Signup error:', errorData);
          const errorMessages = {
            vi: errorData.error || 'Đăng ký thất bại. Vui lòng thử lại.',
            en: errorData.error || 'Registration failed. Please try again.',
            de: errorData.error || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
          };
          alert(errorMessages[language]);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        
        if (data.success && data.user) {
          // Auto-login after successful registration
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (loginError) {
            console.error('Auto-login error:', loginError);
            const errorMessages = {
              vi: 'Đăng ký thành công! Vui lòng đăng nhập.',
              en: 'Registration successful! Please log in.',
              de: 'Registrierung erfolgreich! Bitte melden Sie sich an.',
            };
            alert(errorMessages[language]);
            setIsLoginMode(true);
            setIsLoading(false);
            return;
          }

          if (loginData.session && loginData.user) {
            const user: User = {
              id: loginData.user.id,
              email: loginData.user.email ?? '',
              name: loginData.user.user_metadata.name ?? '',
              phone: loginData.user.user_metadata.phone ?? '',
              street: loginData.user.user_metadata.street ?? '',
              houseNumber: loginData.user.user_metadata.houseNumber ?? '',
              addressExtra: loginData.user.user_metadata.addressExtra ?? '',
              postalCode: loginData.user.user_metadata.postalCode ?? '',
              city: loginData.user.user_metadata.city ?? '',
              customerNumber: loginData.user.user_metadata.customerNumber ?? '',
              avatar: loginData.user.user_metadata.avatar ?? '',
            };
            
            onLogin(user);
            
            // Reset form
            setFormData({
              email: '',
              password: '',
              name: '',
              phone: '',
              street: '',
              houseNumber: '',
              addressExtra: '',
              postalCode: '',
              city: '',
            });
            onClose();
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessages = {
        vi: 'Có lỗi xảy ra. Vui lòng thử lại.',
        en: 'An error occurred. Please try again.',
        de: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      };
      alert(errorMessages[language]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-700 hover:bg-white/60 rounded-lg transition-colors"
        aria-label={t.close}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-rose-200">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-gray-900 mb-2">{isLoginMode ? t.login : t.register}</h2>
          <p className="text-gray-600">{isLoginMode ? t.loginSubtitle : t.registerSubtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field - only for registration */}
            {!isLoginMode && (
              <div>
                <label className="block text-gray-700 mb-2">{t.name}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-rose-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-rose-400 focus:outline-none transition-all"
                    placeholder={t.namePlaceholder}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-2">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-rose-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-rose-400 focus:outline-none transition-all"
                  placeholder={t.emailPlaceholder}
                />
              </div>
            </div>

            {/* Phone - only for register */}
            {!isLoginMode && (
              <div>
                <label className="block text-gray-700 mb-2">{t.phone}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-rose-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-rose-400 focus:outline-none transition-all"
                    placeholder={t.phonePlaceholder}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-2">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-rose-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-rose-400 focus:outline-none transition-all"
                  placeholder={t.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Address Fields - only for register */}
            {!isLoginMode && (
              <>
                {/* Street and House Number Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">{t.street}</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-rose-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-rose-400 focus:outline-none transition-all"
                        placeholder={t.streetPlaceholder}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">{t.houseNumber}</label>
                    <input
                      type="text"
                      required
                      value={formData.houseNumber}
                      onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-rose-400 focus:outline-none transition-all"
                      placeholder={t.houseNumberPlaceholder}
                    />
                  </div>
                </div>

                {/* Address Extra (Optional) */}
                <div>
                  <label className="block text-gray-700 mb-2">{t.addressExtra}</label>
                  <input
                    type="text"
                    value={formData.addressExtra}
                    onChange={(e) => setFormData({ ...formData, addressExtra: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-rose-400 focus:outline-none transition-all"
                    placeholder={t.addressExtraPlaceholder}
                  />
                </div>

                {/* Postal Code and City Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 mb-2">{t.postalCode}</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-rose-400 focus:outline-none transition-all"
                      placeholder={t.postalCodePlaceholder}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 mb-2">{t.city}</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-rose-400 focus:outline-none transition-all"
                      placeholder={t.cityPlaceholder}
                    />
                  </div>
                </div>
              </>
            )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-rose-500 text-white py-4 rounded-xl hover:bg-rose-600 transition-all shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (isLoginMode ? 'Đang đăng nhập...' : 'Đang đăng ký...') : (isLoginMode ? t.loginButton : t.registerButton)}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-rose-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/90 text-gray-500">hoặc</span>
          </div>
        </div>

        {/* Toggle Mode - Outside form */}
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setFormData({
                email: '',
                password: '',
                name: '',
                phone: '',
                address: '',
              });
              setShowPassword(false);
            }}
            className="w-full py-3 px-4 border-2 border-rose-500 text-rose-600 rounded-xl hover:bg-rose-50 transition-all font-medium"
          >
            {isLoginMode ? t.switchToRegister : t.switchToLogin}
          </button>
        </div>
      </div>
    </div>
  );
}
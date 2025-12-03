import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from './ProductCard';

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  language: 'vi' | 'en' | 'de';
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, language, onCheckout }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = totalQuantity >= 4 ? 0 : 6;
  const total = subtotal + shippingFee;

  const translations = {
    vi: {
      title: 'Giỏ hàng của bạn',
      empty: 'Giỏ hàng của bạn đang trống',
      subtotal: 'Tạm tính:',
      shipping: 'Phí vận chuyển:',
      free: 'Miễn phí',
      total: 'Tổng cộng:',
      freeShippingNote: 'Mua từ 4 sản phẩm để được freeship! 🚚',
      checkout: 'Thanh toán',
      decrease: 'Giảm số lượng',
      increase: 'Tăng số lượng',
      remove: 'Xóa sản phẩm',
      close: 'Đóng giỏ hàng',
    },
    en: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      subtotal: 'Subtotal:',
      shipping: 'Shipping:',
      free: 'Free',
      total: 'Total:',
      freeShippingNote: 'Buy 4+ products for free shipping! 🚚',
      checkout: 'Checkout',
      decrease: 'Decrease quantity',
      increase: 'Increase quantity',
      remove: 'Remove item',
      close: 'Close cart',
    },
    de: {
      title: 'Ihr Warenkorb',
      empty: 'Ihr Warenkorb ist leer',
      subtotal: 'Zwischensumme:',
      shipping: 'Versand:',
      free: 'Kostenlos',
      total: 'Gesamt:',
      freeShippingNote: 'Kaufen Sie 4+ Produkte für kostenlosen Versand! 🚚',
      checkout: 'Zur Kasse',
      decrease: 'Menge verringern',
      increase: 'Menge erhöhen',
      remove: 'Artikel entfernen',
      close: 'Warenkorb schließen',
    },
  };

  const t = translations[language];

  return (
    <div
      className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-white shadow-2xl flex flex-col border-l border-rose-200 transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-rose-200 bg-rose-50">
        <h2 className="text-gray-900">{t.title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-rose-100 rounded-lg transition-colors"
          aria-label={t.close}
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t.empty}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-rose-100 pb-4">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{item.name}</h3>
                  {item.selectedSize && (
                    <p className="text-gray-600 mb-1">Size: {item.selectedSize}</p>
                  )}
                  {item.selectedColor && (
                    <p className="text-gray-600 mb-1">Color: {item.selectedColor}</p>
                  )}
                  <p className="text-rose-600 mb-2">
                    €{item.price.toFixed(2)}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 hover:bg-rose-100 rounded transition-colors text-gray-700"
                      aria-label={t.decrease}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-rose-100 rounded transition-colors text-gray-700"
                      aria-label={t.increase}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors self-start text-gray-600"
                  aria-label={t.remove}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-rose-200 p-6 space-y-4 bg-rose-50">
          <div className="space-y-2">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-gray-700">
              <span>{t.subtotal}</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            
            {/* Shipping Fee */}
            <div className="flex justify-between items-center text-gray-700">
              <span>{t.shipping}</span>
              {shippingFee === 0 ? (
                <span className="text-green-600 font-semibold">{t.free}</span>
              ) : (
                <span>€{shippingFee.toFixed(2)}</span>
              )}
            </div>

            {/* Free Shipping Note */}
            {totalQuantity < 4 && (
              <div className="flex items-center gap-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-700 text-xs">
                  {t.freeShippingNote}
                </span>
              </div>
            )}
            
            {/* Divider */}
            <div className="border-t border-rose-300 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-semibold">{t.total}</span>
                <span className="text-rose-600 font-bold text-xl">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onCheckout}
            className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors"
          >
            {t.checkout}
          </button>
        </div>
      )}
    </div>
  );
}
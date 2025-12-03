import { useState } from 'react';
import { ArrowLeft, Package, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import { User } from './AuthModal';
import { CartItem } from './Cart';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface KasseProps {
  user: User;
  items: CartItem[];
  onBack: () => void;
  onPlaceOrder: (paymentMethod: 'bankTransfer' | 'paypal') => string | null;
  language: 'vi' | 'en' | 'de';
}

export function Kasse({ user, items, onBack, onPlaceOrder, language }: KasseProps) {
  const [selectedPayment, setSelectedPayment] = useState<'bankTransfer' | 'paypal'>('bankTransfer');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const orderId = `ORD-${Date.now()}`;

  const translations = {
    vi: {
      title: 'Thanh Toán',
      orderInfo: 'Thông Tin Đơn Hàng',
      orderId: 'Mã đơn hàng',
      totalItems: 'Tổng số sản phẩm',
      items: 'sản phẩm',
      customerInfo: 'Thông Tin Khách Hàng',
      name: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      shippingAddress: 'Địa chỉ giao hàng',
      orderSummary: 'Chi Tiết Đơn Hàng',
      quantity: 'SL',
      subtotal: 'Tạm tính',
      shipping: 'Phí vận chuyển',
      free: 'Miễn phí',
      total: 'Tổng cộng',
      paymentMethod: 'Phương Thức Thanh Toán',
      cod: 'Thanh toán khi nhận hàng (COD)',
      bankTransfer: 'Chuyển khoản ngân hàng',
      paypal: 'PayPal',
      placeOrder: 'Đặt Hàng',
      back: 'Quay lại',
    },
    en: {
      title: 'Checkout',
      orderInfo: 'Order Information',
      orderId: 'Order ID',
      totalItems: 'Total items',
      items: 'items',
      customerInfo: 'Customer Information',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      shippingAddress: 'Shipping Address',
      orderSummary: 'Order Summary',
      quantity: 'Qty',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free',
      total: 'Total',
      paymentMethod: 'Payment Method',
      cod: 'Cash on Delivery (COD)',
      bankTransfer: 'Bank Transfer',
      paypal: 'PayPal',
      placeOrder: 'Place Order',
      back: 'Back',
    },
    de: {
      title: 'Kasse',
      orderInfo: 'Bestellinformationen',
      orderId: 'Bestellnummer',
      totalItems: 'Gesamtartikel',
      items: 'Artikel',
      customerInfo: 'Kundeninformationen',
      name: 'Vollständiger Name',
      email: 'E-Mail',
      phone: 'Telefonnummer',
      shippingAddress: 'Lieferadresse',
      orderSummary: 'Bestellübersicht',
      quantity: 'Menge',
      subtotal: 'Zwischensumme',
      shipping: 'Versand',
      free: 'Kostenlos',
      total: 'Gesamt',
      paymentMethod: 'Zahlungsmethode',
      cod: 'Nachnahme (COD)',
      bankTransfer: 'Banküberweisung',
      paypal: 'PayPal',
      placeOrder: 'Bestellung aufgeben',
      back: 'Zurück',
    },
  };

  const t = translations[language];

  // Check if address is complete
  const isAddressComplete = user.street && user.houseNumber && user.postalCode && user.city;

  const handlePlaceOrder = () => {
    if (!isAddressComplete) {
      alert('Vui lòng cập nhật đầy đủ địa chỉ giao hàng trong Thông tin cá nhân trước khi đặt hàng!');
      return;
    }
    onPlaceOrder(selectedPayment);
    // Receipt will be shown automatically by App.tsx
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t.back}
        </button>

        {/* Title */}
        <h1 className="text-gray-900 mb-8">{t.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer & Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info Card */}
            <div className="bg-white backdrop-blur-sm rounded-xl shadow-sm p-6 border border-rose-200">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-rose-600" />
                {t.orderInfo}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">{t.orderId}</p>
                  <p className="text-gray-900">{orderId}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t.totalItems}</p>
                  <p className="text-gray-900">{totalItems} {t.items}</p>
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white backdrop-blur-sm rounded-xl shadow-sm p-6 border border-rose-200">
              <h3 className="text-gray-900 mb-4">{t.customerInfo}</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-rose-600 mt-0.5" />
                  <div>
                    <p className="text-gray-600">{t.email}</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-rose-600 mt-0.5" />
                  <div>
                    <p className="text-gray-600">{t.phone}</p>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-600">{t.shippingAddress}</p>
                    {isAddressComplete ? (
                      <p className="text-gray-900">
                        {user.street} {user.houseNumber}
                        {user.addressExtra && <><br />{user.addressExtra}</>}
                        <br />{user.postalCode} {user.city}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <p className="text-red-600 font-medium mb-2">⚠️ Chưa cập nhật địa chỉ</p>
                        <p className="text-sm text-gray-600">
                          Vui lòng vào <strong>Thông tin cá nhân</strong> để cập nhật địa chỉ giao hàng đầy đủ.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white backdrop-blur-sm rounded-xl shadow-sm p-6 border border-rose-200">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-600" />
                {t.paymentMethod}
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-rose-200 rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'bankTransfer'}
                    onChange={() => setSelectedPayment('bankTransfer')}
                    className="w-4 h-4 text-rose-600"
                  />
                  <span className="text-gray-900">{t.bankTransfer}</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-rose-200 rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'paypal'}
                    onChange={() => setSelectedPayment('paypal')}
                    className="w-4 h-4 text-rose-600"
                  />
                  <span className="text-gray-900">{t.paypal}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white backdrop-blur-sm rounded-xl shadow-sm p-6 border border-rose-200 sticky top-20">
              <h3 className="text-gray-900 mb-4">{t.orderSummary}</h3>

              {/* Items List */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate">{item.name}</p>
                      {item.selectedSize && (
                        <p className="text-gray-600">Size: {item.selectedSize}</p>
                      )}
                      {item.selectedColor && (
                        <p className="text-gray-600">Màu: {item.selectedColor}</p>
                      )}
                      <p className="text-gray-600">
                        {t.quantity}: {item.quantity}
                      </p>
                      <p className="text-rose-600">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-rose-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>{t.subtotal}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t.shipping}</span>
                  <span className="text-green-600">{t.free}</span>
                </div>
                <div className="flex justify-between text-gray-900 pt-2 border-t border-rose-200">
                  <span>{t.total}</span>
                  <span className="text-rose-600">€{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Address Warning */}
              {!isAddressComplete && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-800">
                  <p className="font-semibold mb-1">⚠️ Địa chỉ chưa đầy đủ</p>
                  <p className="text-sm">
                    Vui lòng cập nhật địa chỉ giao hàng trong <strong>Thông tin cá nhân</strong> trước khi đặt hàng.
                  </p>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!isAddressComplete}
                className={`w-full py-3 rounded-lg transition-colors mt-6 ${
                  isAddressComplete 
                    ? 'bg-rose-500 text-white hover:bg-rose-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t.placeOrder}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
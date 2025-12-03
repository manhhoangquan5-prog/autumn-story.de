import { CheckCircle, Download, ArrowLeft, Package, User as UserIcon, CreditCard, Building2 } from 'lucide-react';
import { User } from './AuthModal';
import { CartItem } from './Cart';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReceiptProps {
  orderId: string;
  user: User;
  items: CartItem[];
  paymentMethod: 'bankTransfer' | 'paypal';
  language: 'vi' | 'en' | 'de';
  onBackToHome: () => void;
}

export function Receipt({ orderId, user, items, paymentMethod, language, onBackToHome }: ReceiptProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = totalQuantity >= 4 ? 0 : 6;
  const total = subtotal + shippingFee;
  
  const orderDate = new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : language === 'en' ? 'en-US' : 'de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const translations = {
    vi: {
      title: 'Đơn Hàng Thành Công',
      subtitle: 'Cảm ơn bạn đã mua hàng tại Autumn Store!',
      orderConfirmation: 'Đơn hàng của bạn đã được xác nhận',
      receipt: 'Biên Lai',
      orderId: 'Mã đơn hàng',
      orderDate: 'Ngày đặt hàng',
      customerInfo: 'Thông Tin Khách Hàng',
      name: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      address: 'Địa chỉ giao hàng',
      orderDetails: 'Chi Tiết Đơn Hàng',
      product: 'Sản phẩm',
      quantity: 'Số lượng',
      price: 'Đơn giá',
      subtotal: 'Thành tiền',
      orderSubtotal: 'Tạm tính',
      shipping: 'Phí vận chuyển',
      free: 'Miễn phí',
      total: 'Tổng cộng',
      paymentInfo: 'Thông Tin Thanh Toán',
      paymentMethod: 'Phương thức thanh toán',
      bankTransfer: 'Chuyển khoản ngân hàng',
      paypal: 'PayPal',
      recipientName: 'Tên người nhận',
      accountNumber: 'Số tài khoản',
      paypalEmail: 'Email PayPal',
      bankName: 'Ngân hàng',
      pleaseTransfer: 'Vui lòng chuyển khoản đúng số tiền',
      transferNote: 'Nội dung chuyển khoản',
      noteContent: `Thanh toán đơn hàng ${orderId}`,
      backToHome: 'Quay lại trang chủ',
      downloadReceipt: 'Tải biên lai',
      color: 'Màu',
      size: 'Kích thước',
    },
    en: {
      title: 'Order Successful',
      subtitle: 'Thank you for shopping at Autumn Store!',
      orderConfirmation: 'Your order has been confirmed',
      receipt: 'Receipt',
      orderId: 'Order ID',
      orderDate: 'Order Date',
      customerInfo: 'Customer Information',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      address: 'Shipping Address',
      orderDetails: 'Order Details',
      product: 'Product',
      quantity: 'Quantity',
      price: 'Unit Price',
      subtotal: 'Subtotal',
      orderSubtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free',
      total: 'Total',
      paymentInfo: 'Payment Information',
      paymentMethod: 'Payment Method',
      bankTransfer: 'Bank Transfer',
      paypal: 'PayPal',
      recipientName: 'Recipient Name',
      accountNumber: 'Account Number',
      paypalEmail: 'PayPal Email',
      bankName: 'Bank',
      pleaseTransfer: 'Please transfer the exact amount',
      transferNote: 'Transfer Note',
      noteContent: `Payment for order ${orderId}`,
      backToHome: 'Back to Home',
      downloadReceipt: 'Download Receipt',
      color: 'Color',
      size: 'Size',
    },
    de: {
      title: 'Bestellung Erfolgreich',
      subtitle: 'Vielen Dank für Ihren Einkauf bei Autumn Store!',
      orderConfirmation: 'Ihre Bestellung wurde bestätigt',
      receipt: 'Rechnung',
      orderId: 'Bestellnummer',
      orderDate: 'Bestelldatum',
      customerInfo: 'Kundeninformationen',
      name: 'Vollständiger Name',
      email: 'E-Mail',
      phone: 'Telefonnummer',
      address: 'Lieferadresse',
      orderDetails: 'Bestelldetails',
      product: 'Produkt',
      quantity: 'Menge',
      price: 'Stückpreis',
      subtotal: 'Zwischensumme',
      orderSubtotal: 'Zwischensumme',
      shipping: 'Versand',
      free: 'Kostenlos',
      total: 'Gesamt',
      paymentInfo: 'Zahlungsinformationen',
      paymentMethod: 'Zahlungsmethode',
      bankTransfer: 'Banküberweisung',
      paypal: 'PayPal',
      recipientName: 'Empfängername',
      accountNumber: 'Kontonummer',
      paypalEmail: 'PayPal E-Mail',
      bankName: 'Bank',
      pleaseTransfer: 'Bitte überweisen Sie den genauen Betrag',
      transferNote: 'Verwendungszweck',
      noteContent: `Zahlung für Bestellung ${orderId}`,
      backToHome: 'Zurück zur Startseite',
      downloadReceipt: 'Rechnung herunterladen',
      color: 'Farbe',
      size: 'Größe',
    },
  };

  const t = translations[language];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8 print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600 text-lg">{t.subtitle}</p>
          <p className="text-rose-600 font-medium mt-2">{t.orderConfirmation}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6 print:hidden">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backToHome}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors ml-auto"
          >
            <Download className="w-5 h-5" />
            {t.downloadReceipt}
          </button>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-xl shadow-lg border border-rose-200 overflow-hidden print:shadow-none print:border-2">
          {/* Receipt Header */}
          <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Autumn Store</h2>
            <p className="text-rose-100">{t.receipt}</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-gray-600 text-sm mb-1">{t.orderId}</p>
                <p className="text-gray-900 font-semibold">{orderId}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{t.orderDate}</p>
                <p className="text-gray-900 font-semibold">{orderDate}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-rose-600" />
                {t.customerInfo}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">{t.name}</p>
                  <p className="text-gray-900 font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">{t.email}</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">{t.phone}</p>
                  <p className="text-gray-900 font-medium">{user.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">{t.address}</p>
                  <p className="text-gray-900 font-medium">
                    {user.street} {user.houseNumber}
                    {user.addressExtra && <><br />{user.addressExtra}</>}
                    <br />{user.postalCode} {user.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-rose-600" />
                {t.orderDetails}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-rose-50 border-b border-rose-200">
                    <tr>
                      <th className="text-left p-3 text-gray-700">{t.product}</th>
                      <th className="text-center p-3 text-gray-700">{t.quantity}</th>
                      <th className="text-right p-3 text-gray-700">{t.price}</th>
                      <th className="text-right p-3 text-gray-700">{t.subtotal}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="text-gray-900 font-medium">{item.name}</p>
                              {item.selectedColor && (
                                <p className="text-gray-600 text-xs">
                                  {t.color}: {item.selectedColor}
                                </p>
                              )}
                              {item.selectedSize && (
                                <p className="text-gray-600 text-xs">
                                  {t.size}: {item.selectedSize}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center text-gray-900">{item.quantity}</td>
                        <td className="p-3 text-right text-gray-900">€{item.price.toFixed(2)}</td>
                        <td className="p-3 text-right text-gray-900 font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-rose-300 bg-rose-50">
                    <tr>
                      <td colSpan={3} className="p-3 text-right text-gray-700">
                        {t.orderSubtotal}
                      </td>
                      <td className="p-3 text-right text-gray-900 font-medium">
                        €{subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="p-3 text-right text-gray-700">
                        {t.shipping}
                      </td>
                      <td className="p-3 text-right text-gray-900 font-medium">
                        {shippingFee === 0 ? (
                          <span className="text-green-600 font-semibold">{t.free}</span>
                        ) : (
                          `€${shippingFee.toFixed(2)}`
                        )}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-rose-400">
                      <td colSpan={3} className="p-3 text-right text-gray-900 font-bold">
                        {t.total}
                      </td>
                      <td className="p-3 text-right text-rose-600 font-bold text-lg">
                        €{total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                {paymentMethod === 'paypal' ? (
                  <CreditCard className="w-5 h-5 text-rose-600" />
                ) : (
                  <Building2 className="w-5 h-5 text-rose-600" />
                )}
                {t.paymentInfo}
              </h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{t.paymentMethod}</p>
                  <p className="text-gray-900 font-semibold">
                    {paymentMethod === 'paypal' ? t.paypal : t.bankTransfer}
                  </p>
                </div>

                {paymentMethod === 'paypal' ? (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{t.paypalEmail}</p>
                    <p className="text-gray-900 font-mono bg-white px-4 py-2 rounded border border-amber-300">
                      manhhoangquan5@gmail.com
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">{t.recipientName}</p>
                      <p className="text-gray-900 font-semibold">Hoang Quan Manh</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">IBAN</p>
                      <p className="text-gray-900 font-mono bg-white px-4 py-2 rounded border border-amber-300">
                        DE21 3123 1232 13
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">BIC</p>
                      <p className="text-gray-900 font-mono bg-white px-4 py-2 rounded border border-amber-300">
                        HYVEDEMMXXX
                      </p>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-amber-300">
                  <p className="text-rose-600 font-semibold mb-2">{t.pleaseTransfer}</p>
                  <div className="flex justify-between items-center bg-white px-4 py-3 rounded border border-rose-300">
                    <span className="text-gray-700">{t.total}</span>
                    <span className="text-rose-600 font-bold text-xl">€{total.toFixed(2)}</span>
                  </div>
                </div>

                {paymentMethod === 'bankTransfer' && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{t.transferNote}</p>
                    <p className="text-gray-900 font-mono bg-white px-4 py-2 rounded border border-amber-300">
                      {t.noteContent}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

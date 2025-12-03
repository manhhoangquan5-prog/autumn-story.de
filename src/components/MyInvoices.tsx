import { FileText, Download, ArrowLeft, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { Order } from './types';

interface MyInvoicesProps {
  orders: Order[];
  userEmail: string;
  onBack: () => void;
}

export function MyInvoices({ orders, userEmail, onBack }: MyInvoicesProps) {
  // Filter orders for this user
  const userOrders = orders.filter(order => order.email === userEmail);

  const handleDownloadInvoice = (order: Order) => {
    // Create invoice content
    const invoiceContent = `
==========================================
          HÓA ĐƠN - AUTUMN STORE
==========================================

Mã đơn hàng: #${order.id}
Ngày đặt: ${new Date(order.orderDate).toLocaleString('vi-VN')}

------------------------------------------
THÔNG TIN KHÁCH HÀNG
------------------------------------------
Tên: ${order.customerName}
Email: ${order.email}
Số điện thoại: ${order.phone}
Địa chỉ: ${order.street} ${order.houseNumber}${order.addressExtra ? ', ' + order.addressExtra : ''}
         ${order.postalCode} ${order.city}

------------------------------------------
CHI TIẾT ĐơN HÀNG
------------------------------------------
${order.items.map((item, index) => `
${index + 1}. ${item.name}
   - Màu sắc: ${item.selectedColor || 'N/A'}
   - Kích thước: ${item.selectedSize || 'N/A'}
   - Số lượng: ${item.quantity}
   - Đơn giá: €${item.price.toFixed(2)}
   - Thành tiền: €${(item.price * item.quantity).toFixed(2)}
`).join('\n')}

------------------------------------------
Tạm tính: €${(order.subtotal || 0).toFixed(2)}
Phí vận chuyển: ${(order.shippingFee || 0) === 0 ? 'Miễn phí (€0.00)' : `€${(order.shippingFee || 0).toFixed(2)}`}
------------------------------------------
TỔNG CỘNG: €${(order.total || 0).toFixed(2)}
------------------------------------------

Phương thức thanh toán: ${order.paymentMethod === 'bankTransfer' ? 'Chuyển khoản ngân hàng' : 'PayPal'}
Trạng thái: ${getStatusText(order.status)}

==========================================
     Cảm ơn quý khách đã mua hàng!
     Website: autumn-story.de
==========================================
    `;

    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function getStatusText(status: Order['status']) {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đã gửi đi';
      case 'in_transit_germany': return 'Đang vận chuyển qua Đức';
      case 'received': return 'Đã nhận đơn';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }

  function getStatusColor(status: Order['status']) {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-4 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-gray-900 mb-2">Hóa đơn của tôi</h1>
          <p className="text-gray-600">
            Tổng số: <span className="font-semibold text-rose-600">{userOrders.length}</span> hóa đơn
          </p>
        </div>

        {/* Invoices List */}
        {userOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-rose-200">
            <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 font-semibold mb-2">Chưa có hóa đơn</h3>
            <p className="text-gray-600">Bạn chưa có hóa đơn nào.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-rose-200 hover:shadow-md transition-all overflow-hidden group"
              >
                {/* Invoice Header */}
                <div className="bg-gradient-to-r from-rose-100 via-orange-50 to-yellow-50 p-4 border-b border-rose-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold font-mono">#{order.id}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Invoice Body */}
                <div className="p-4 space-y-3">
                  {/* Customer Info - Compact */}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-3 h-3 text-rose-600" />
                      <span className="truncate">{order.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-3 h-3 text-rose-600" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-3 h-3 text-rose-600 mt-1 flex-shrink-0" />
                      <span className="line-clamp-2">
                        {order.street} {order.houseNumber}
                        {order.addressExtra && `, ${order.addressExtra}`}, {order.postalCode} {order.city}
                      </span>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="pt-3 border-t border-rose-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm">Số sản phẩm:</span>
                      <span className="text-gray-900 font-semibold">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold">Tổng tiền:</span>
                      <span className="text-rose-600 font-bold text-xl">€{(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-rose-600 to-orange-500 text-white rounded-xl hover:from-rose-700 hover:to-orange-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg group"
                  >
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    Tải hóa đơn
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

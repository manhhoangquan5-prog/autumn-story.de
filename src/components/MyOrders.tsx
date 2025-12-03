import { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Calendar, CreditCard, MapPin, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Order } from './types';

interface MyOrdersProps {
  orders: Order[];
  userEmail: string;
  onBack: () => void;
}

export function MyOrders({ orders, userEmail, onBack }: MyOrdersProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Filter orders for this user
  const userOrders = orders.filter(order => order.email === userEmail);

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'in_transit_germany':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'received':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đã gửi đi';
      case 'in_transit_germany':
        return 'Đang vận chuyển qua Đức';
      case 'received':
        return 'Đã nhận đơn';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: Order['paymentMethod']) => {
    return method === 'bankTransfer' ? 'Chuyển khoản ngân hàng' : 'PayPal';
  };

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
          <h1 className="text-gray-900 mb-2">Đơn đặt hàng của tôi</h1>
          <p className="text-gray-600">
            Tổng số: <span className="font-semibold text-rose-600">{userOrders.length}</span> đơn hàng
          </p>
        </div>

        {/* Orders List */}
        {userOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-rose-200">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 font-semibold mb-2">Chưa có đơn hàng</h3>
            <p className="text-gray-600">Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-rose-200 hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-rose-50 transition-colors"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Order ID */}
                        <div className="bg-rose-600 text-white px-4 py-2 rounded-xl font-mono font-bold shrink-0">
                          #{order.id}
                        </div>

                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>

                        {/* Date */}
                        <div className="hidden md:flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                        </div>

                        {/* Items Count */}
                        <div className="hidden lg:flex items-center gap-2 text-gray-600">
                          <Package className="w-4 h-4" />
                          <span className="text-sm">{totalItems} sản phẩm</span>
                        </div>
                      </div>

                      {/* Total & Expand */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-gray-600 text-sm">Tổng tiền</p>
                          <p className="text-rose-600 font-bold text-xl">€{(order.total || 0).toFixed(2)}</p>
                        </div>
                        <button className="text-rose-600 p-2 hover:bg-rose-100 rounded-lg transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Mobile Info */}
                    <div className="mt-3 md:hidden flex flex-wrap gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>{totalItems} sản phẩm</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-rose-200 bg-gray-50 p-6">
                      <div className="space-y-6">
                        {/* Shipping Info */}
                        <div className="bg-white rounded-xl p-4 border border-rose-200">
                          <h4 className="text-gray-900 font-semibold mb-3">Thông tin giao hàng</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-rose-600 mt-0.5" />
                              <div>
                                <p className="text-gray-600">Địa chỉ:</p>
                                <p className="text-gray-900 font-medium">
                                  {order.street} {order.houseNumber}
                                  {order.addressExtra && <><br />{order.addressExtra}</>}
                                  <br />{order.postalCode} {order.city}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <CreditCard className="w-4 h-4 text-rose-600 mt-0.5" />
                              <div>
                                <p className="text-gray-600">Thanh toán:</p>
                                <p className="text-gray-900 font-medium">{getPaymentMethodText(order.paymentMethod)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Products List */}
                        <div className="bg-white rounded-xl border border-rose-200 overflow-hidden">
                          <div className="p-4 bg-rose-50 border-b border-rose-200">
                            <h4 className="text-gray-900 font-semibold">Chi tiết sản phẩm</h4>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                              <div key={index} className="p-4 flex gap-4">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-900 font-semibold mb-2">{item.name}</p>
                                  <div className="flex flex-wrap gap-2 text-sm mb-2">
                                    {item.selectedColor && (
                                      <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded-full text-xs">
                                        {item.selectedColor}
                                      </span>
                                    )}
                                    {item.selectedSize && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                        {item.selectedSize}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Số lượng: {item.quantity}</span>
                                    <span className="text-rose-600 font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="p-4 bg-rose-50 space-y-2">
                            <div className="flex justify-between items-center text-gray-700">
                              <span>Tạm tính:</span>
                              <span className="font-medium">€{(order.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-700">
                              <span>Phí vận chuyển:</span>
                              {(order.shippingFee || 0) === 0 ? (
                                <span className="text-green-600 font-semibold">Miễn phí</span>
                              ) : (
                                <span className="font-medium">€{(order.shippingFee || 0).toFixed(2)}</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center border-t border-rose-300 pt-2">
                              <span className="text-gray-900 font-bold">TỔNG CỘNG:</span>
                              <span className="text-rose-600 font-bold text-xl">€{(order.total || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

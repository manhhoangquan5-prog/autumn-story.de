import { Package, MapPin, Phone, Mail, Calendar, CreditCard, ChevronDown, ChevronUp, Trash2, Truck, Save } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  addressExtra?: string;
  postalCode: string;
  city: string;
  orderDate: string;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedSize?: string;
    selectedColor?: string;
  }[];
  total: number;
  paymentMethod: 'bankTransfer' | 'paypal';
  status: 'pending' | 'processing' | 'shipped' | 'in_transit_germany' | 'received' | 'completed' | 'cancelled';
  trackingNumber?: string;
}

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status']) => void;
  onDeleteOrder?: (orderId: string) => void;
  onUpdateTrackingNumber?: (orderId: string, trackingNumber: string) => void;
}

export function OrderManagement({ orders, onUpdateOrderStatus, onDeleteOrder, onUpdateTrackingNumber }: OrderManagementProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('');

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, newStatus);
    }
  };

  const handleDeleteClick = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingOrderId(orderId);
  };

  const confirmDelete = () => {
    if (deletingOrderId && onDeleteOrder) {
      onDeleteOrder(deletingOrderId);
      setDeletingOrderId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingOrderId(null);
  };

  const handleEditTracking = (orderId: string, currentTracking: string = '') => {
    setEditingTrackingId(orderId);
    setTrackingNumberInput(currentTracking);
  };

  const handleSaveTracking = (orderId: string) => {
    if (onUpdateTrackingNumber) {
      onUpdateTrackingNumber(orderId, trackingNumberInput);
    }
    setEditingTrackingId(null);
    setTrackingNumberInput('');
  };

  const handleCancelTracking = () => {
    setEditingTrackingId(null);
    setTrackingNumberInput('');
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

  const statusOptions: { value: Order['status']; label: string }[] = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đã gửi đi' },
    { value: 'in_transit_germany', label: 'Đang vận chuyển qua Đức' },
    { value: 'received', label: 'Đã nhận đơn' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const getPaymentMethodText = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'bankTransfer':
        return 'Chuyển khoản ngân hàng';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900">Quản Lý Đơn Hàng</h2>
          <p className="text-gray-600">Tổng số: {orders.length} đơn hàng</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-rose-200">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-rose-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Summary Header - Always Visible */}
                <div
                  className="p-6 cursor-pointer hover:bg-rose-50 transition-colors"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Order ID - PROMINENT */}
                      <div className="bg-rose-600 text-white px-4 py-2 rounded-lg font-mono font-bold">
                        #{order.id}
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order.id, e.target.value as Order['status']);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-400 ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      {/* Date */}
                      <div className="hidden md:flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{new Date(order.orderDate).toLocaleString('vi-VN')}</span>
                      </div>

                      {/* Customer Name */}
                      <div className="hidden lg:flex items-center gap-2 text-gray-700">
                        <Package className="w-4 h-4 text-rose-600" />
                        <span className="font-medium">{order.customerName}</span>
                      </div>
                    </div>

                    {/* Total, Delete & Expand Button */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-gray-600 text-sm">Tổng tiền</p>
                        <p className="text-rose-600 font-bold text-xl">€{order.total.toFixed(2)}</p>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeleteClick(order.id, e)}
                        className="text-red-600 p-2 hover:bg-red-100 rounded-lg transition-colors group"
                        title="Xóa đơn hàng"
                      >
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                      
                      {/* Expand Button */}
                      <button className="text-rose-600 p-2 hover:bg-rose-100 rounded-lg transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Info on Mobile */}
                  <div className="mt-3 md:hidden space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-3 h-3" />
                      <span>{order.customerName}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-rose-200 bg-gray-50">
                    <div className="p-6 space-y-6">
                      {/* Customer Info Section */}
                      <div className="bg-white rounded-lg p-4 border border-rose-200">
                        <h4 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                          <Package className="w-5 h-5 text-rose-600" />
                          Thông tin khách hàng
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-600">Email:</p>
                              <p className="text-gray-900 font-medium break-all">{order.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-600">Số điện thoại:</p>
                              <p className="text-gray-900 font-medium">{order.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 md:col-span-2">
                            <MapPin className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-600">Địa chỉ giao hàng:</p>
                              <p className="text-gray-900 font-medium break-words">
                                {order.street} {order.houseNumber}
                                {order.addressExtra && <><br />{order.addressExtra}</>}
                                <br />{order.postalCode} {order.city}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CreditCard className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-600">Phương thức thanh toán:</p>
                              <p className="text-gray-900 font-medium">{getPaymentMethodText(order.paymentMethod)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 md:col-span-2 mt-3 pt-3 border-t border-rose-200">
                            <Truck className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-600 mb-2">Sendungsnummer (Mã vận chuyển):</p>
                              {editingTrackingId === order.id ? (
                                <div className="flex flex-wrap items-center gap-2">
                                  <input
                                    type="text"
                                    value={trackingNumberInput}
                                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                                    placeholder="Nhập mã vận chuyển..."
                                    className="flex-1 min-w-[200px] px-3 py-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveTracking(order.id)}
                                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                                  >
                                    <Save className="w-4 h-4" />
                                    Lưu
                                  </button>
                                  <button
                                    onClick={handleCancelTracking}
                                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                  {order.trackingNumber ? (
                                    <span className="font-mono bg-green-100 text-green-800 px-3 py-1.5 rounded-lg border border-green-300">
                                      {order.trackingNumber}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic">Chưa cập nhật</span>
                                  )}
                                  <button
                                    onClick={() => handleEditTracking(order.id, order.trackingNumber)}
                                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm"
                                  >
                                    {order.trackingNumber ? 'Sửa' : 'Thêm mã'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Products Table */}
                      <div className="bg-white rounded-lg border border-rose-200 overflow-hidden">
                        <div className="p-4 bg-rose-50 border-b border-rose-200">
                          <h4 className="text-gray-900 font-semibold">
                            Chi Tiết Sản Phẩm ({totalItems} sản phẩm)
                          </h4>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="text-left p-3 text-gray-700 font-semibold">Sản phẩm</th>
                                <th className="text-center p-3 text-gray-700 font-semibold">Màu sắc</th>
                                <th className="text-center p-3 text-gray-700 font-semibold">Kích thước</th>
                                <th className="text-center p-3 text-gray-700 font-semibold">Số lượng</th>
                                <th className="text-right p-3 text-gray-700 font-semibold">Đơn giá</th>
                                <th className="text-right p-3 text-gray-700 font-semibold">Thành tiền</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {order.items.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="p-3">
                                    <div className="flex items-center gap-3">
                                      <ImageWithFallback
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                      />
                                      <span className="text-gray-900 font-medium">{item.name}</span>
                                    </div>
                                  </td>
                                  <td className="p-3 text-center">
                                    {item.selectedColor ? (
                                      <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm">
                                        {item.selectedColor}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    {item.selectedSize ? (
                                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                        {item.selectedSize}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg font-semibold text-gray-900">
                                      {item.quantity}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right text-gray-900 font-medium">
                                    €{item.price.toFixed(2)}
                                  </td>
                                  <td className="p-3 text-right text-rose-600 font-bold">
                                    €{(item.price * item.quantity).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="border-t-2 border-rose-300 bg-rose-50">
                              <tr>
                                <td colSpan={5} className="p-4 text-right text-gray-900 font-bold text-lg">
                                  TỔNG CỘNG:
                                </td>
                                <td className="p-4 text-right text-rose-600 font-bold text-xl">
                                  €{order.total.toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-200">
                          {order.items.map((item, index) => (
                            <div key={index} className="p-4 space-y-3">
                              <div className="flex gap-3">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-900 font-semibold mb-2">{item.name}</p>
                                  <div className="space-y-1 text-sm">
                                    {item.selectedColor && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Màu:</span>
                                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-xs">
                                          {item.selectedColor}
                                        </span>
                                      </div>
                                    )}
                                    {item.selectedSize && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Size:</span>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                          {item.selectedSize}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-600">Số lượng:</span>
                                      <span className="font-semibold text-gray-900">{item.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-600">Đơn giá:</span>
                                      <span className="font-medium text-gray-900">€{item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                                      <span className="text-gray-600">Thành tiền:</span>
                                      <span className="font-bold text-rose-600">
                                        €{(item.price * item.quantity).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="p-4 bg-rose-50 flex justify-between items-center">
                            <span className="text-gray-900 font-bold text-lg">TỔNG CỘNG:</span>
                            <span className="text-rose-600 font-bold text-xl">€{order.total.toFixed(2)}</span>
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

      {/* Delete Confirmation Modal */}
      {deletingOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-gray-900 font-bold text-xl">Xác nhận xóa đơn hàng</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa đơn hàng <span className="font-mono font-bold text-rose-600">#{deletingOrderId}</span>?
              <br />
              <span className="text-red-600 font-semibold">Hành động này không thể hoàn tác!</span>
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Xóa đơn hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

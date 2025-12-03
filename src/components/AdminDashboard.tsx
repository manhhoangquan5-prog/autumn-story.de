import { useState } from 'react';
import { LogOut, Plus, Edit2, Trash2, Package, ShoppingBag, Users } from 'lucide-react';
import { Product } from './ProductCard';
import { ProductForm } from './ProductForm';
import adminLogo from 'figma:asset/fd9d31dbbfcf1ed378625d46d334eaeaa4273f24.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Order, OrderManagement } from './OrderManagement';
import { CustomerManagement } from './CustomerManagement';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: number | string, product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: number | string) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status']) => void;
  onDeleteOrder?: (orderId: string) => void;
  onUpdateTrackingNumber?: (orderId: string, trackingNumber: string) => void;
  onLogout: () => void;
}

export function AdminDashboard({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateTrackingNumber,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers'>('products');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    onAddProduct(productData);
    setShowForm(false);
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      setShowForm(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-md border-b border-rose-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={adminLogo} alt="Admin Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Quản lý sản phẩm Autumn Store</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-rose-600 border border-rose-200 rounded-lg hover:border-rose-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-rose-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Tổng sản phẩm</p>
                <p className="text-gray-900">{products.length}</p>
              </div>
              <div className="bg-rose-100 p-3 rounded-lg">
                <Package className="w-8 h-8 text-rose-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-rose-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Tổng đơn hàng</p>
                <p className="text-gray-900">{orders.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ShoppingBag className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-rose-200">
          <button
            onClick={() => {
              setActiveTab('products');
              setShowForm(false);
              setEditingProduct(null);
            }}
            className={`px-6 py-3 transition-colors ${
              activeTab === 'products'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-600 hover:text-rose-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>Quản lý sản phẩm</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              setShowForm(false);
              setEditingProduct(null);
            }}
            className={`px-6 py-3 transition-colors ${
              activeTab === 'orders'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-600 hover:text-rose-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Quản lý đơn hàng</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('customers');
              setShowForm(false);
              setEditingProduct(null);
            }}
            className={`px-6 py-3 transition-colors ${
              activeTab === 'customers'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-600 hover:text-rose-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Quản lý khách hàng</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <>
            {/* Action Button */}
            {!showForm && (
              <div className="mb-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2"
                >
              <Plus className="w-5 h-5" />
              <span>Thêm sản phẩm mới</span>
            </button>
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-rose-200">
            <h2 className="text-gray-900 mb-6">
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <ProductForm
              initialProduct={editingProduct || undefined}
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-rose-200">
          <div className="px-6 py-4 border-b border-rose-200">
            <h2 className="text-gray-900">Danh sách sản phẩm</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mb-4">
                <Package className="w-8 h-8 text-rose-400" />
              </div>
              <p className="text-gray-500">Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-rose-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700">Hình ảnh</th>
                    <th className="px-6 py-3 text-left text-gray-700">Tên sản phẩm</th>
                    <th className="px-6 py-3 text-left text-gray-700">Danh mục</th>
                    <th className="px-6 py-3 text-left text-gray-700">Màu sắc</th>
                    <th className="px-6 py-3 text-left text-gray-700">Kích thước</th>
                    <th className="px-6 py-3 text-left text-gray-700">Giá</th>
                    <th className="px-6 py-3 text-right text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-rose-50/50">
                      <td className="px-6 py-4">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{product.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{product.colors || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{product.sizes || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">
                          €{product.price.toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            aria-label="Chỉnh sửa"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                                onDeleteProduct(product.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <OrderManagement 
            orders={orders} 
            onUpdateOrderStatus={onUpdateOrderStatus}
            onDeleteOrder={onDeleteOrder}
            onUpdateTrackingNumber={onUpdateTrackingNumber}
          />
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <CustomerManagement />
        )}
      </main>
    </div>
  );
}
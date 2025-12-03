import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Product } from './ProductCard';

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export function ProductForm({ initialProduct, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    price: initialProduct?.price || 0,
    image: initialProduct?.image || '',
    category: initialProduct?.category || '',
    description: (initialProduct as any)?.description || '',
    colors: initialProduct?.colors || '',
    sizes: initialProduct?.sizes || '',
  });
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'upload'>('upload');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Lỗi khi tải ảnh lên');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none"
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-700 mb-2">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none"
            placeholder="VD: Áo len, Giày, Phụ kiện..."
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-gray-700 mb-2">
            Giá (EUR) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="sizes" className="block text-gray-700 mb-2">
            Kích thước <span className="text-red-500">*</span>
          </label>
          <input
            id="sizes"
            name="sizes"
            type="text"
            value={formData.sizes}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none"
            placeholder="VD: S, M, L, XL..."
            required
          />
        </div>

        <div>
          <label htmlFor="colors" className="block text-gray-700 mb-2">
            Màu sắc <span className="text-red-500">*</span>
          </label>
          <input
            id="colors"
            name="colors"
            type="text"
            value={formData.colors}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none"
            placeholder="VD: Đỏ, Xanh, Trắng..."
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none"
            placeholder="Mô tả sản phẩm (tùy chọn)"
            rows={3}
          />
        </div>

      </div>

      {/* Image Upload Section */}
      <div className="border-t pt-6">
        <label className="block text-gray-700 mb-3">
          Hình ảnh sản phẩm <span className="text-red-500">*</span>
        </label>

        {/* Toggle between Upload and URL */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setImageUploadMethod('upload')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              imageUploadMethod === 'upload'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-rose-600'
            }`}
          >
            Tải ảnh lên
          </button>
          <button
            type="button"
            onClick={() => setImageUploadMethod('url')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              imageUploadMethod === 'url'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-rose-600'
            }`}
          >
            Nhập URL
          </button>
        </div>

        {imageUploadMethod === 'upload' ? (
          <div>
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-rose-600 hover:bg-rose-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="mb-2 text-gray-700">
                  <span className="font-semibold">Click để tải ảnh lên</span> hoặc kéo thả
                </p>
                <p className="text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
              </div>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {isUploading && (
              <p className="text-rose-600 mt-2">Đang tải ảnh lên...</p>
            )}
          </div>
        ) : (
          <div>
            <input
              id="imageUrl"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600 focus:border-transparent outline-none"
              placeholder="https://example.com/image.jpg"
              required={imageUploadMethod === 'url'}
            />
          </div>
        )}
      </div>

      {/* Image Preview */}
      {formData.image && (
        <div>
          <p className="text-gray-700 mb-2">Xem trước hình ảnh:</p>
          <img
            src={formData.image}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-lg border border-gray-300"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
          {formData.image && (
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
              className="mt-2 text-red-600 hover:text-red-700 transition-colors"
            >
              Xóa hình ảnh
            </button>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors"
        >
          {initialProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}

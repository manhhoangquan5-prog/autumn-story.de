import { ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

export interface Product {
  id: number | string; // Support both numeric and UUID string IDs
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string; // Mô tả sản phẩm
  colors?: string; // Danh sách màu sắc (VD: "Đỏ, Xanh, Vàng")
  sizes?: string; // Danh sách kích thước (VD: "S, M, L, XL")
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const colorOptions = product.colors?.split(',').map(c => c.trim()).filter(Boolean) || [];
  const sizeOptions = product.sizes?.split(',').map(s => s.trim()).filter(Boolean) || [];
  
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(sizeOptions[0] || '');

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedSize);
  };

  return (
    <div className="bg-white border border-rose-200 rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
      <div className="relative h-80 overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-rose-500 text-white px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="text-gray-900 mb-2">{product.name}</h3>
        
        {/* Color Selection */}
        {colorOptions.length > 0 && (
          <div>
            <p className="text-gray-700 mb-2">Màu sắc:</p>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    selectedColor === color
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-rose-500'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {sizeOptions.length > 0 && (
          <div>
            <p className="text-gray-700 mb-2">Kích thước:</p>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded-lg border transition-all ${
                    selectedSize === size
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-rose-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-rose-600">€{product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2"
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
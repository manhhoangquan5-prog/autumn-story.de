import { ProductCard, Product } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  language: 'vi' | 'en' | 'de';
}

export function ProductGrid({ products, onAddToCart, language }: ProductGridProps) {
  const translations = {
    vi: {
      title: 'Sản Phẩm Nổi Bật',
      subtitle: 'Khám phá những sản phẩm thời trang mới nhất',
      empty: 'Chưa có sản phẩm',
      emptyDesc: 'Sản phẩm sẽ được cập nhật sớm',
    },
    en: {
      title: 'Featured Products',
      subtitle: 'Discover the latest fashion products',
      empty: 'No products yet',
      emptyDesc: 'Products will be updated soon',
    },
    de: {
      title: 'Beliebte Produkte',
      subtitle: 'Entdecken Sie die neuesten Modeprodukte',
      empty: 'Noch keine Produkte',
      emptyDesc: 'Produkte werden bald aktualisiert',
    },
  };

  const t = translations[language];

  return (
    <section id="products" className="py-12 sm:py-16 bg-gradient-to-b from-rose-50 via-orange-50 to-amber-50 relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(244 114 182) 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-rose-600 mb-3 sm:mb-4">{t.title}</h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base px-4">
            {t.subtitle}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-gray-900 mb-2">{t.empty}</h3>
            <p className="text-gray-600">
              {t.emptyDesc}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
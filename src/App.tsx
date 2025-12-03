import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { AuthModal, User } from './components/AuthModal';
import { Kasse } from './components/Kasse';
import { Receipt } from './components/Receipt';
import { Order } from './components/types';
import { AboutSection } from './components/AboutSection';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { Cart, CartItem } from './components/Cart';
import { Product } from './components/ProductCard';
import { MyOrders } from './components/MyOrders';
import { MyInvoices } from './components/MyInvoices';
import { MyProfile } from './components/MyProfile';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3ad4bbb9`;

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [language, setLanguage] = useState<'vi' | 'en' | 'de'>('vi');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [accountPage, setAccountPage] = useState<'orders' | 'invoices' | 'profile' | null>(null);
  const [lastOrder, setLastOrder] = useState<{
    orderId: string;
    items: CartItem[];
    paymentMethod: 'bankTransfer' | 'paypal';
  } | null>(null);

  // Load products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await fetch(`${API_URL}/products`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch products:', response.statusText);
          // Fallback to localStorage
          const savedProducts = localStorage.getItem('autumnStoreProducts');
          if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
          }
          return;
        }

        const data = await response.json();
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          // Also save to localStorage as backup
          localStorage.setItem('autumnStoreProducts', JSON.stringify(data.products));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to localStorage
        const savedProducts = localStorage.getItem('autumnStoreProducts');
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        }
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Load orders from API on mount (admin only)
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAdminLoggedIn) return;
      
      try {
        setIsLoadingOrders(true);
        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch orders:', response.statusText);
          // Fallback to localStorage
          const savedOrders = localStorage.getItem('autumnStoreOrders');
          if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
          }
          return;
        }

        const data = await response.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
          // Also save to localStorage as backup
          localStorage.setItem('autumnStoreOrders', JSON.stringify(data.orders));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to localStorage
        const savedOrders = localStorage.getItem('autumnStoreOrders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAdminLoggedIn]);

  // Check for existing Supabase session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata.name ?? '',
          phone: session.user.user_metadata.phone ?? '',
          street: session.user.user_metadata.street ?? '',
          houseNumber: session.user.user_metadata.houseNumber ?? '',
          addressExtra: session.user.user_metadata.addressExtra ?? '',
          postalCode: session.user.user_metadata.postalCode ?? '',
          city: session.user.user_metadata.city ?? '',
          customerNumber: session.user.user_metadata.customerNumber ?? '',
        };
        setCurrentUser(user);
        setAccessToken(session.access_token);
        localStorage.setItem('autumnStoreUser', JSON.stringify(user));
      }
    };

    checkSession();
  }, []);

  // Check if current path is admin
  useEffect(() => {
    const checkAdminPath = () => {
      const path = window.location.hash;
      setIsAdminMode(path === '#admin');
    };

    checkAdminPath();
    window.addEventListener('hashchange', checkAdminPath);
    return () => window.removeEventListener('hashchange', checkAdminPath);
  }, []);

  const handleAddToCart = (product: Product, selectedColor?: string, selectedSize?: string) => {
    setCartItems((prevItems) => {
      // Check if the same product with same color and size exists
      const existingItem = prevItems.find(
        (item) => 
          item.id === product.id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
      );
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1, selectedColor, selectedSize }];
    });
    
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number | string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      console.log('🔄 Adding product:', productData);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          let errorText;
          try {
            errorText = await response.text();
            console.error('❌ Server error response:', errorText);
          } catch (e) {
            console.error('❌ Could not read error response:', e);
            errorText = 'Unknown error';
          }
          throw new Error(`Failed to add product: ${response.status} - ${errorText}`);
        }

        let data;
        try {
          data = await response.json();
          console.log('✅ Server response:', data);
        } catch (e) {
          console.error('❌ Could not parse JSON response:', e);
          throw new Error('Invalid JSON response from server');
        }
        
        if (data.success && data.product) {
          console.log('✅ Product added successfully:', data.product);
          setProducts((prev) => [...prev, data.product]);
          localStorage.setItem('autumnStoreProducts', JSON.stringify([...products, data.product]));
          alert('✅ Sản phẩm đã được thêm thành công!');
        } else {
          console.warn('⚠️ Unexpected response format:', data);
          throw new Error('Unexpected response format from server');
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.error('❌ Request timeout after 30 seconds');
          throw new Error('Request timeout - server took too long to respond');
        }
        throw fetchError;
      }
    } catch (error: any) {
      console.error('❌ Error adding product:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      
      alert(`❌ Lỗi khi thêm sản phẩm: ${error.message}\n\nSản phẩm sẽ được lưu tạm thời trên trình duyệt.`);
      
      // Fallback to local state
      const newProduct: Product = {
        id: Date.now(),
        ...productData,
      };
      console.log('📝 Falling back to local product:', newProduct);
      setProducts((prev) => [...prev, newProduct]);
      localStorage.setItem('autumnStoreProducts', JSON.stringify([...products, newProduct]));
    }
  };

  const handleUpdateProduct = async (id: number | string, productData: Omit<Product, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const data = await response.json();
      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? data.product : product
          )
        );
        const updatedProducts = products.map((product) =>
          product.id === id ? data.product : product
        );
        localStorage.setItem('autumnStoreProducts', JSON.stringify(updatedProducts));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      // Fallback to local state
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { id, ...productData } : product
        )
      );
      const updatedProducts = products.map((product) =>
        product.id === id ? { id, ...productData } : product
      );
      localStorage.setItem('autumnStoreProducts', JSON.stringify(updatedProducts));
    }
  };

  const handleDeleteProduct = async (id: number | string) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts((prev) => prev.filter((product) => product.id !== id));
      const updatedProducts = products.filter((product) => product.id !== id);
      localStorage.setItem('autumnStoreProducts', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error deleting product:', error);
      // Fallback to local state
      setProducts((prev) => prev.filter((product) => product.id !== id));
      const updatedProducts = products.filter((product) => product.id !== id);
      localStorage.setItem('autumnStoreProducts', JSON.stringify(updatedProducts));
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    window.location.hash = '';
  };

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('autumnStoreUser', JSON.stringify(user));
    
    // Get access token
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setAccessToken(session.access_token);
    }
    
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setAccessToken('');
    setShowCheckout(false);
    localStorage.removeItem('autumnStoreUser');
  };

  const handleCheckout = () => {
    if (currentUser) {
      setShowCheckout(true);
      setIsCartOpen(false);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Update via API
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        console.log(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        console.error('Failed to update order status:', response.statusText);
        // Still update local state as fallback
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        localStorage.setItem('autumnStoreOrders', JSON.stringify(
          orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // Fallback to local update
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      localStorage.setItem('autumnStoreOrders', JSON.stringify(
        orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
      ));
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders(prev => prev.filter(order => order.id !== orderId));
      const updatedOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('autumnStoreOrders', JSON.stringify(updatedOrders));
      console.log(`Order ${orderId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting order:', error);
      // Fallback to local state
      setOrders(prev => prev.filter(order => order.id !== orderId));
      const updatedOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('autumnStoreOrders', JSON.stringify(updatedOrders));
    }
  };

  const handleUpdateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/tracking`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber }),
      });

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, trackingNumber } : order
        ));
        console.log(`Order ${orderId} tracking number updated to ${trackingNumber}`);
      } else {
        console.error('Failed to update tracking number:', response.statusText);
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, trackingNumber } : order
        ));
        localStorage.setItem('autumnStoreOrders', JSON.stringify(
          orders.map(order => order.id === orderId ? { ...order, trackingNumber } : order)
        ));
      }
    } catch (error) {
      console.error('Error updating tracking number:', error);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, trackingNumber } : order
      ));
      localStorage.setItem('autumnStoreOrders', JSON.stringify(
        orders.map(order => order.id === orderId ? { ...order, trackingNumber } : order)
      ));
    }
  };

  const handleAccountNavigate = (page: 'orders' | 'invoices' | 'profile') => {
    setAccountPage(page);
  };

  const handleAvatarUpdate = async (file: File) => {
    if (!currentUser) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', currentUser.id);

      const response = await fetch(`${API_URL}/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      if (data.success && data.avatarUrl) {
        const updatedUser = { ...currentUser, avatar: data.avatarUrl };
        setCurrentUser(updatedUser);
        localStorage.setItem('autumnStoreUser', JSON.stringify(updatedUser));
        console.log('Avatar uploaded successfully:', data.avatarUrl);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      // Create object URL as fallback
      const objectUrl = URL.createObjectURL(file);
      const updatedUser = { ...currentUser, avatar: objectUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem('autumnStoreUser', JSON.stringify(updatedUser));
    }
  };

  const handleUpdateProfile = async (data: { name: string; phone: string; street: string; houseNumber: string; addressExtra: string; postalCode: string; city: string }) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${API_URL}/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const responseData = await response.json();
      if (responseData.success) {
        const updatedUser = { ...currentUser, ...data };
        setCurrentUser(updatedUser);
        localStorage.setItem('autumnStoreUser', JSON.stringify(updatedUser));
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Fallback to local state
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem('autumnStoreUser', JSON.stringify(updatedUser));
    }
  };

  const handlePlaceOrder = async (paymentMethod: 'bankTransfer' | 'paypal') => {
    if (currentUser && cartItems.length > 0) {
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const shippingFee = totalQuantity >= 4 ? 0 : 6;
      const total = subtotal + shippingFee;

      const orderData = {
        customerName: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        street: currentUser.street,
        houseNumber: currentUser.houseNumber,
        addressExtra: currentUser.addressExtra,
        postalCode: currentUser.postalCode,
        city: currentUser.city,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.selectedSize,
          color: item.selectedColor,
        })),
        subtotal,
        shippingFee,
        total,
        paymentMethod,
      };

      try {
        const response = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error('Failed to place order');
        }

        const data = await response.json();
        if (data.success && data.order) {
          setOrders(prev => [data.order, ...prev]);
          setCartItems([]);
          setShowCheckout(false);
          setLastOrder({
            orderId: data.order.id,
            items: cartItems,
            paymentMethod,
          });
          setShowReceipt(true);
          return data.order.id;
        }
      } catch (error) {
        console.error('Error placing order:', error);
        // Fallback to local state
        const newOrder: Order = {
          id: `ORD-${Date.now().toString().slice(-8)}`,
          customerName: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          address: currentUser.address,
          orderDate: new Date().toISOString(),
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            size: item.selectedSize,
            color: item.selectedColor,
          })),
          total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          paymentMethod,
          status: 'pending'
        };

        setOrders(prev => [newOrder, ...prev]);
        localStorage.setItem('autumnStoreOrders', JSON.stringify([newOrder, ...orders]));
        setCartItems([]);
        setShowCheckout(false);
        setLastOrder({
          orderId: newOrder.id,
          items: cartItems,
          paymentMethod,
        });
        setShowReceipt(true);
        return newOrder.id;
      }
    }
    return null;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Admin Mode
  if (isAdminMode) {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }

    return (
      <AdminDashboard
        products={products}
        orders={orders}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onUpdateTrackingNumber={handleUpdateTrackingNumber}
        onLogout={handleAdminLogout}
      />
    );
  }

  // Checkout Mode
  if (showCheckout && currentUser) {
    return (
      <Kasse
        user={currentUser}
        items={cartItems}
        onBack={() => setShowCheckout(false)}
        onPlaceOrder={handlePlaceOrder}
        language={language}
      />
    );
  }

  // Receipt Mode - Full screen after order success
  if (showReceipt && lastOrder && currentUser) {
    return (
      <Receipt
        orderId={lastOrder.orderId}
        user={currentUser}
        items={lastOrder.items}
        paymentMethod={lastOrder.paymentMethod}
        onBackToHome={() => setShowReceipt(false)}
        language={language}
      />
    );
  }

  // Account Pages
  if (accountPage && currentUser) {
    if (accountPage === 'orders') {
      return (
        <MyOrders
          orders={orders}
          userEmail={currentUser.email}
          onBack={() => setAccountPage(null)}
        />
      );
    }

    if (accountPage === 'invoices') {
      return (
        <MyInvoices
          orders={orders}
          userEmail={currentUser.email}
          onBack={() => setAccountPage(null)}
        />
      );
    }

    if (accountPage === 'profile') {
      return (
        <MyProfile
          user={currentUser}
          accessToken={accessToken}
          onBack={() => setAccountPage(null)}
          onUpdateProfile={handleUpdateProfile}
          onAvatarUpdate={handleAvatarUpdate}
        />
      );
    }
  }

  // Customer Mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {/* Main Content - Full Width */}
      <Header 
        cartCount={totalItems} 
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        language={language}
        onLanguageChange={setLanguage}
        currentUser={currentUser}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onAccountNavigate={handleAccountNavigate}
        onAvatarUpdate={handleAvatarUpdate}
      />
      <Hero language={language} />
      <AboutSection language={language} />
      <ProductGrid products={products} onAddToCart={handleAddToCart} language={language} />
      <Footer language={language} />

      {/* Cart Sidebar - Fixed Position */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        language={language}
        onCheckout={handleCheckout}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        language={language}
      />
    </div>
  );
}
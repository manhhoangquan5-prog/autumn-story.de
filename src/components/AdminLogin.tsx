import { useState } from 'react';
import { Lock, ArrowLeft, Home } from 'lucide-react';
import adminLogo from 'figma:asset/fd9d31dbbfcf1ed378625d46d334eaeaa4273f24.png';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication (in production, use proper backend authentication)
    if (username === 'admin' && password === 'admin123') {
      onLogin();
      setError('');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  const handleBackToHome = () => {
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center px-4">
      {/* Back to Home Button - Top Left */}
      <button
        onClick={handleBackToHome}
        className="fixed top-6 left-6 flex items-center gap-2 text-rose-600 hover:text-rose-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all border border-rose-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay về trang chủ</span>
      </button>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-rose-200">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img src={adminLogo} alt="Admin Logo" className="h-20 w-20 object-contain" />
          </div>
          <h2 className="text-gray-900 mb-2">Đăng nhập Admin</h2>
          <p className="text-gray-600">Autumn Store - Quản trị viên</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Lock className="w-5 h-5" />
            <span>Đăng nhập</span>
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500">
          <p>Demo: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}
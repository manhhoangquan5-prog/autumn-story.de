import { useState, useRef, useEffect } from 'react';
import { User, ShoppingBag, FileText, Settings, LogOut, Camera, Upload } from 'lucide-react';
import defaultAvatar from 'figma:asset/ac3b742a140378b6be66fdec1c0c8fabaaa09c1c.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface AccountUser {
  email: string;
  name: string;
  phone: string;
  address: string;
  avatar?: string;
}

interface AccountMenuProps {
  user: AccountUser;
  onLogout: () => void;
  onNavigate: (page: 'orders' | 'invoices' | 'profile') => void;
  onAvatarUpdate: (file: File) => void;
}

export function AccountMenu({ user, onLogout, onNavigate, onAvatarUpdate }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    setIsOpen(!isOpen);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpdate(file);
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const menuItems = [
    {
      icon: ShoppingBag,
      label: 'Đơn đặt hàng',
      onClick: () => {
        onNavigate('orders');
        setIsOpen(false);
      },
    },
    {
      icon: FileText,
      label: 'Hóa đơn',
      onClick: () => {
        onNavigate('invoices');
        setIsOpen(false);
      },
    },
    {
      icon: Settings,
      label: 'Thông tin cá nhân',
      onClick: () => {
        onNavigate('profile');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <div
        className="relative cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleAvatarClick}
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-rose-300 hover:border-rose-500 transition-all shadow-md hover:shadow-lg">
          <ImageWithFallback
            src={user.avatar || defaultAvatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          
          {/* Hover Overlay with Upload Icon */}
          <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Upload Button (visible on hover) */}
        {isHovering && (
          <button
            onClick={handleUploadClick}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-rose-600 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-700 transition-colors"
            title="Upload avatar"
          >
            <Upload className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden z-50 animate-fadeIn">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-rose-100 via-orange-50 to-yellow-50 p-4 border-b border-rose-200">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                <ImageWithFallback
                  src={user.avatar || defaultAvatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-semibold truncate">Xin chào, {user.name}</p>
                <p className="text-gray-600 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-rose-50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                  <item.icon className="w-5 h-5 text-rose-600" />
                </div>
                <span className="text-gray-700 font-medium group-hover:text-rose-600 transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <div className="border-t border-rose-200 p-2">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors rounded-lg group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-red-600 font-semibold">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

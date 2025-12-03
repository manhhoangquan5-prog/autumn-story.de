import { useState } from 'react';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Camera, CreditCard } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import defaultAvatar from 'figma:asset/ac3b742a140378b6be66fdec1c0c8fabaaa09c1c.png';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MyProfileProps {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    street: string;
    houseNumber: string;
    addressExtra: string;
    postalCode: string;
    city: string;
    customerNumber?: string;
    avatar?: string;
  };
  accessToken: string;
  onBack: () => void;
  onUpdateProfile: (data: { name: string; phone: string; street: string; houseNumber: string; addressExtra: string; postalCode: string; city: string }) => void;
  onAvatarUpdate: (file: File) => void;
}

export function MyProfile({ user, accessToken, onBack, onUpdateProfile, onAvatarUpdate }: MyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    street: user.street,
    houseNumber: user.houseNumber,
    addressExtra: user.addressExtra,
    postalCode: user.postalCode,
    city: user.city,
  });

  const handleSave = async () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: user.phone,
      street: user.street,
      houseNumber: user.houseNumber,
      addressExtra: user.addressExtra,
      postalCode: user.postalCode,
      city: user.city,
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarUpdate(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-4 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-gray-900 mb-2">Thông tin cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-200 overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-rose-100 via-orange-50 to-yellow-50 p-8 text-center border-b border-rose-200">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <ImageWithFallback
                  src={user.avatar || defaultAvatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-rose-700 transition-colors group"
              >
                <Camera className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <h2 className="text-gray-900 font-bold mt-4">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <User className="w-4 h-4 text-rose-600" />
                  Họ và tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 border border-gray-200">
                    {user.name}
                  </div>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Mail className="w-4 h-4 text-rose-600" />
                  Email
                </label>
                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600 border border-gray-200 cursor-not-allowed">
                  {user.email}
                  <span className="ml-2 text-xs text-gray-500">(không thể thay đổi)</span>
                </div>
              </div>

              {/* Customer ID Field (Read-only) */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <CreditCard className="w-4 h-4 text-rose-600" />
                  Số khách hàng cá nhân
                </label>
                <div className="px-4 py-3 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl border-2 border-rose-300">
                  {user.customerNumber ? (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-mono tracking-wider text-lg">{user.customerNumber}</span>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">(tự động tạo)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500">Đang tạo mã...</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-1">
                  Mã được tạo dựa trên thành phố trong địa chỉ của bạn (2 ký tự thành phố + 6 số ngẫu nhiên)
                </p>
              </div>

              {/* Phone Field */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Phone className="w-4 h-4 text-rose-600" />
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 border border-gray-200">
                    {user.phone || 'Chưa có thông tin'}
                  </div>
                )}
              </div>

              {/* Address Section */}
              <div className="space-y-4 p-4 bg-gradient-to-br from-rose-50/50 to-orange-50/50 rounded-xl border border-rose-200">
                <h3 className="flex items-center gap-2 text-gray-800 font-semibold">
                  <MapPin className="w-5 h-5 text-rose-600" />
                  Địa chỉ giao hàng
                </h3>

                {/* Street and House Number */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Tên đường</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                        placeholder="Hauptstraße"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white rounded-xl text-gray-900 border border-gray-200">
                        {user.street || 'Chưa có thông tin'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Số nhà</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.houseNumber}
                        onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                        placeholder="123"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white rounded-xl text-gray-900 border border-gray-200">
                        {user.houseNumber || '-'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Extra */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Địa chỉ đi kèm (tùy chọn)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.addressExtra}
                      onChange={(e) => setFormData({ ...formData, addressExtra: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                      placeholder="Tầng 2, Căn hộ 5"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-white rounded-xl text-gray-900 border border-gray-200">
                      {user.addressExtra || '-'}
                    </div>
                  )}
                </div>

                {/* Postal Code and City */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Mã bưu điện</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                        placeholder="48231"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white rounded-xl text-gray-900 border border-gray-200">
                        {user.postalCode || '-'}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Thành phố</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                        placeholder="Warendorf"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white rounded-xl text-gray-900 border border-gray-200">
                        {user.city || '-'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-500 text-white rounded-xl hover:from-rose-700 hover:to-orange-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Save className="w-5 h-5" />
                    Lưu thay đổi
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-500 text-white rounded-xl hover:from-rose-700 hover:to-orange-600 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Chỉnh sửa thông tin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
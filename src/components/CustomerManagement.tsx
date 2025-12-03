import { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Customer {
  id: string;
  customerId: string;
  email: string;
  name: string;
  phone: string;
  houseNumber: string;
  street: string;
  addressExtra: string;
  postalCode: string;
  city: string;
  createdAt: string;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ad4bbb9/admin/customers`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      } else {
        console.error('Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const search = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.customerId?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.city?.toLowerCase().includes(search)
    );
  });

  const formatAddress = (customer: Customer) => {
    const parts = [];
    if (customer.street && customer.houseNumber) {
      parts.push(`${customer.street} ${customer.houseNumber}`);
    }
    if (customer.addressExtra) {
      parts.push(customer.addressExtra);
    }
    if (customer.postalCode && customer.city) {
      parts.push(`${customer.postalCode} ${customer.city}`);
    }
    return parts.join(', ') || 'Chưa cập nhật';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-100 rounded-lg">
            <Users className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Quản lý khách hàng</h2>
            <p className="text-gray-600">Tổng số: {customers.length} khách hàng</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, mã KH..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-full sm:w-80"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-200">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-900">Mã KH</th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">Tên</th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">Email</th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">SĐT</th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">Địa chỉ</th>
                <th className="px-6 py-4 text-left font-medium text-gray-900">Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Không tìm thấy khách hàng phù hợp' : 'Chưa có khách hàng nào'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-rose-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono px-3 py-1 bg-rose-100 text-rose-700 rounded-full">
                        {customer.customerId || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {customer.name || 'Chưa cập nhật'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{customer.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 max-w-xs">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{formatAddress(customer)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(customer.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            {searchTerm ? 'Không tìm thấy khách hàng phù hợp' : 'Chưa có khách hàng nào'}
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white rounded-lg shadow-md p-4 space-y-3 border border-gray-200 hover:border-rose-300 transition-colors"
            >
              {/* Customer ID Badge */}
              <div className="flex items-center justify-between">
                <span className="font-mono px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">
                  {customer.customerId || 'N/A'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(customer.createdAt)}
                </span>
              </div>

              {/* Name */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {customer.name || 'Chưa cập nhật'}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="break-all">{customer.email}</span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{customer.phone || 'N/A'}</span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{formatAddress(customer)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

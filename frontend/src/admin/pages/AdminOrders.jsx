import React, { useMemo, useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAllOrders, updateOrderStatus } from '../api/adminApi';
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  X,
  Clipboard,
  Phone,
  RefreshCcw,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'sonner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      toast.error('Помилка завантаження замовлень');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Статус оновлено');
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      toast.error('Помилка оновлення статусу');
      console.error(error);
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleCopy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} скопійовано`);
    } catch (error) {
      toast.error('Не вдалося скопіювати');
      console.error(error);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Очікує', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
      confirmed: { label: 'Підтверджено', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle },
      processing: { label: 'Обробляється', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Package },
      shipped: { label: 'Відправлено', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Truck },
      delivered: { label: 'Доставлено', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      cancelled: { label: 'Скасовано', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle }
    };
    return statusMap[status] || statusMap.pending;
  };

  const statusStats = useMemo(() => {
    return orders.reduce((acc, order) => {
      acc.total += 1;
      acc.revenue += order.totalAmount;
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {
      total: 0,
      revenue: 0,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          order.customerName.toLowerCase().includes(search.toLowerCase()) ||
          order.customerPhone.includes(search) ||
          order.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? order.status === statusFilter : true;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'amount_asc':
            return a.totalAmount - b.totalAmount;
          case 'amount_desc':
            return b.totalAmount - a.totalAmount;
          case 'date_asc':
            return new Date(a.createdAt) - new Date(b.createdAt);
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
  }, [orders, search, sortBy, statusFilter]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Замовлення</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Управління замовленнями клієнтів
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Всього замовлень</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusStats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Виручка</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {statusStats.revenue.toFixed(0)} грн
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Очікують</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statusStats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Доставлено</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statusStats.delivered}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: '', label: 'Всі', count: statusStats.total },
                { key: 'pending', label: 'Очікує', count: statusStats.pending },
                { key: 'confirmed', label: 'Підтверджено', count: statusStats.confirmed },
                { key: 'processing', label: 'Обробляється', count: statusStats.processing },
                { key: 'shipped', label: 'Відправлено', count: statusStats.shipped },
                { key: 'delivered', label: 'Доставлено', count: statusStats.delivered },
                { key: 'cancelled', label: 'Скасовано', count: statusStats.cancelled }
              ].map((status) => (
                <button
                  key={status.key || 'all'}
                  onClick={() => setStatusFilter(status.key)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    statusFilter === status.key
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-400'
                  }`}
                >
                  {status.label} · {status.count}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Пошук за ім'ям, телефоном або ID"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Всі статуси</option>
                <option value="pending">Очікує</option>
                <option value="confirmed">Підтверджено</option>
                <option value="processing">Обробляється</option>
                <option value="shipped">Відправлено</option>
                <option value="delivered">Доставлено</option>
                <option value="cancelled">Скасовано</option>
              </select>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="date_desc">Новіші спочатку</option>
                    <option value="date_asc">Старіші спочатку</option>
                    <option value="amount_desc">Сума: спадання</option>
                    <option value="amount_asc">Сума: зростання</option>
                  </select>
                </div>
                <button
                  onClick={loadOrders}
                  className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <RefreshCcw size={18} className="mr-2" />
                  Оновити
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                data-testid={`order-card-${order.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        #{order.id.substring(0, 8)}
                      </h3>
                      <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon size={14} className="mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Клієнт:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Телефон:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{order.customerPhone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Дата:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(order.createdAt).toLocaleDateString('uk-UA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {order.deliveryMethod === 'nova_poshta' ? 'Нова Пошта' : 'Самовивіз'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {order.paymentMethod === 'cash_on_delivery' ? 'Накладений платіж' : 'Оплата карткою'}
                      </span>
                      {order.notes && (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                          Є примітка
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {order.totalAmount.toFixed(0)} грн
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.items.length} товар(ів)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    data-testid={`status-select-${order.id}`}
                  >
                    <option value="pending">Очікує</option>
                    <option value="confirmed">Підтверджено</option>
                    <option value="processing">Обробляється</option>
                    <option value="shipped">Відправлено</option>
                    <option value="delivered">Доставлено</option>
                    <option value="cancelled">Скасовано</option>
                  </select>
                  <button
                    onClick={() => openDetails(order)}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    data-testid={`view-order-${order.id}`}
                  >
                    <Eye size={18} className="mr-2" />
                    Деталі
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 dark:text-gray-400">Замовлень не знайдено</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Замовлення #{selectedOrder.id.substring(0, 8)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Створено {new Date(selectedOrder.createdAt).toLocaleString('uk-UA')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy('ID замовлення', selectedOrder.id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Clipboard size={16} />
                  Copy ID
                </button>
                <button
                  onClick={closeDetails}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Інформація про клієнта</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ім'я:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Телефон:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                    >
                      <Phone size={16} />
                      Зателефонувати
                    </a>
                    <button
                      onClick={() => handleCopy('Телефон', selectedOrder.customerPhone)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Clipboard size={16} />
                      Скопіювати телефон
                    </button>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.customerEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Доставка та оплата</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Спосіб доставки:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.deliveryMethod === 'nova_poshta' ? 'Нова Пошта' : 'Самовивіз'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Спосіб оплати:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.paymentMethod === 'cash_on_delivery' ? 'Накладений платіж' : 'Оплата карткою'}
                    </span>
                  </div>
                  {selectedOrder.deliveryAddress && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Адреса:</span>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedOrder.deliveryAddress}</p>
                    </div>
                  )}
                  {selectedOrder.notes && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Примітки:</span>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Товари</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {item.productImage && (
                          <img
                            src={process.env.REACT_APP_BACKEND_URL + item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.productName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.price} грн × {item.quantity} шт
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {(item.price * item.quantity).toFixed(0)} грн
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">Загальна сума:</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedOrder.totalAmount.toFixed(0)} грн
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;

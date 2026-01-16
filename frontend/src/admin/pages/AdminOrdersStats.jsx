import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  getOrdersStats,
  getOrdersChart,
  getOrdersByStatus,
  getTopCustomers
} from '../api/adminApi';
import {
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const AdminOrdersStats = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState(7);

  useEffect(() => {
    loadAllData();
  }, [chartPeriod]);

  const loadAllData = async () => {
    try {
      const [statsData, chartDataRes, statusDataRes, customersData] = await Promise.all([
        getOrdersStats(),
        getOrdersChart(chartPeriod),
        getOrdersByStatus(),
        getTopCustomers(10)
      ]);

      setStats(statsData);
      setChartData(chartDataRes);
      setStatusData(statusDataRes);
      setTopCustomers(customersData);
    } catch (error) {
      toast.error('Помилка завантаження статистики');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Всього замовлень',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Виконано',
      value: stats?.completedOrders || 0,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'В обробці',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'Скасовано',
      value: stats?.cancelledOrders || 0,
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Загальний дохід',
      value: `${stats?.totalRevenue?.toFixed(0) || 0} грн`,
      icon: DollarSign,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Середній чек',
      value: `${stats?.averageOrderValue?.toFixed(0) || 0} грн`,
      icon: TrendingUp,
      color: 'indigo',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'Замовлень сьогодні',
      value: stats?.todayOrders || 0,
      icon: Calendar,
      color: 'cyan',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      textColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      title: 'Дохід сьогодні',
      value: `${stats?.todayRevenue?.toFixed(0) || 0} грн`,
      icon: DollarSign,
      color: 'teal',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      textColor: 'text-teal-600 dark:text-teal-400'
    }
  ];

  const statusColors = {
    pending: { bg: 'bg-yellow-500', label: 'Очікує' },
    confirmed: { bg: 'bg-blue-500', label: 'Підтверджено' },
    processing: { bg: 'bg-purple-500', label: 'Обробляється' },
    shipped: { bg: 'bg-indigo-500', label: 'Відправлено' },
    delivered: { bg: 'bg-green-500', label: 'Доставлено' },
    cancelled: { bg: 'bg-red-500', label: 'Скасовано' }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Статистика замовлень</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Детальна аналітика та звіти по замовленнях
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
                data-testid={`stat-card-${index}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={stat.textColor} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Динаміка замовлень
              </h2>
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={7}>7 днів</option>
                <option value={14}>14 днів</option>
                <option value={30}>30 днів</option>
              </select>
            </div>
            <div className="space-y-4">
              {chartData.map((item, index) => {
                const maxOrders = Math.max(...chartData.map(d => d.orders), 1);
                const percentage = (item.orders / maxOrders) * 100;
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.orders} зам.
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {item.revenue.toFixed(0)} грн
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Розподіл за статусами
            </h2>
            <div className="space-y-4">
              {statusData.map((item, index) => {
                const statusInfo = statusColors[item.status];
                if (!statusInfo || item.count === 0) return null;
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {statusInfo.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.count}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`${statusInfo.bg} h-3 rounded-full transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-green-600 dark:text-green-400" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Топ клієнтів
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    #
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ім'я
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Телефон
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Замовлень
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Всього витрачено
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-bold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {customer.phone}
                    </td>
                    <td className="py-4 px-4 text-sm text-right font-medium text-gray-900 dark:text-white">
                      {customer.totalOrders}
                    </td>
                    <td className="py-4 px-4 text-sm text-right font-bold text-green-600 dark:text-green-400">
                      {customer.totalSpent.toFixed(0)} грн
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {topCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 dark:text-gray-400">Поки що немає даних про клієнтів</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersStats;

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getDashboardStats, getRevenueChart, getTopProducts } from '../api/adminApi';
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  FolderTree
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, revenueChartData, topProductsData] = await Promise.all([
        getDashboardStats(),
        getRevenueChart(7),
        getTopProducts(5)
      ]);

      setStats(statsData);
      setRevenueData(revenueChartData);
      setTopProducts(topProductsData);
    } catch (error) {
      toast.error('Помилка завантаження даних');
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
      title: 'Всього товарів',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Всього замовлень',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'green',
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Загальний дохід',
      value: `${stats?.totalRevenue?.toFixed(0) || 0} грн`,
      icon: DollarSign,
      color: 'purple',
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Очікують обробки',
      value: stats?.pendingOrders || 0,
      icon: AlertTriangle,
      color: 'orange',
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Мало на складі',
      value: stats?.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-500',
      lightBg: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Категорій',
      value: stats?.totalCategories || 0,
      icon: FolderTree,
      color: 'indigo',
      bgColor: 'bg-indigo-500',
      lightBg: 'bg-indigo-50 dark:bg-indigo-900/20'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Огляд вашого інтернет-магазину
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.lightBg} p-3 rounded-lg`}>
                    <Icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Дохід за останні 7 днів
            </h2>
            <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <div className="space-y-4">
            {revenueData.map((item, index) => {
              const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
              const percentage = (item.revenue / maxRevenue) * 100;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(item.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.revenue.toFixed(0)} грн
                    </span>
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

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Топ товарів (за продажами)
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Продано: {product.sales} шт
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {product.revenue.toFixed(0)} грн
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

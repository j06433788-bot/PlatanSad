import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getDashboardStats, getRevenueChart, getTopProducts } from '../api/adminApi';
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  FolderTree,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

const formatUAH = (n) =>
  new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(Number(n || 0));

const formatDay = (dateStr) =>
  new Date(dateStr).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' });

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const r = payload.find(p => p.dataKey === 'revenue')?.value ?? 0;
  const o = payload.find(p => p.dataKey === 'orders')?.value;

  return (
    <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/70 bg-white/90 dark:bg-gray-900/80 backdrop-blur px-4 py-3 shadow-lg">
      <div className="text-sm font-semibold text-gray-900 dark:text-white">{formatDay(label)}</div>
      <div className="mt-2 space-y-1">
        <div className="text-sm text-gray-700 dark:text-gray-200">
          Дохід: <span className="font-semibold">{formatUAH(r)} грн</span>
        </div>
        {typeof o !== 'undefined' && (
          <div className="text-sm text-gray-700 dark:text-gray-200">
            Замовлення: <span className="font-semibold">{o}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="space-y-3 w-full">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="h-11 w-11 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, revenueChartData, topProductsData] = await Promise.all([
        getDashboardStats(),
        getRevenueChart(14), // зробимо красивіше: 14 днів для графіків
        getTopProducts(5)
      ]);

      setStats(statsData);
      setRevenueData(Array.isArray(revenueChartData) ? revenueChartData : []);
      setTopProducts(Array.isArray(topProductsData) ? topProductsData : []);
    } catch (error) {
      toast.error('Помилка завантаження даних');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const colorClass = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
    indigo: 'text-indigo-600 dark:text-indigo-400'
  };

  const statCards = useMemo(() => ([
    {
      title: 'Всього товарів',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'blue',
      lightBg: 'bg-blue-50 dark:bg-blue-900/20',
      glow: 'from-blue-500/25 via-blue-500/10 to-transparent'
    },
    {
      title: 'Всього замовлень',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'green',
      lightBg: 'bg-green-50 dark:bg-green-900/20',
      glow: 'from-green-500/25 via-green-500/10 to-transparent'
    },
    {
      title: 'Загальний дохід',
      value: `${formatUAH(stats?.totalRevenue)} грн`,
      icon: DollarSign,
      color: 'purple',
      lightBg: 'bg-purple-50 dark:bg-purple-900/20',
      glow: 'from-purple-500/25 via-purple-500/10 to-transparent'
    },
    {
      title: 'Очікують обробки',
      value: stats?.pendingOrders || 0,
      icon: AlertTriangle,
      color: 'orange',
      lightBg: 'bg-orange-50 dark:bg-orange-900/20',
      glow: 'from-orange-500/25 via-orange-500/10 to-transparent'
    },
    {
      title: 'Мало на складі',
      value: stats?.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'red',
      lightBg: 'bg-red-50 dark:bg-red-900/20',
      glow: 'from-red-500/25 via-red-500/10 to-transparent'
    },
    {
      title: 'Категорій',
      value: stats?.totalCategories || 0,
      icon: FolderTree,
      color: 'indigo',
      lightBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      glow: 'from-indigo-500/25 via-indigo-500/10 to-transparent'
    }
  ]), [stats]);

  // Нормалізація для графіків:
  // очікуємо [{date: "...", revenue: number, orders?: number}]
  const chartData = useMemo(() => {
    const base = (revenueData || []).map(d => ({
      date: d.date,
      revenue: Number(d.revenue || 0),
      orders: Number(d.orders || 0)
    }));
    return base;
  }, [revenueData]);

  const siteUrl = 'https://platansad.com.ua/';

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header / Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 shadow-sm">
          {/* background gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-green-500/15 blur-3xl" />
            <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.12),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.10),transparent_45%)]" />
          </div>

          <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Огляд вашого інтернет-магазину — ключові метрики та динаміка продажів
              </p>
            </div>

            {/* Right top link */}
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-900/40 backdrop-blur px-4 py-3 font-semibold text-gray-900 dark:text-white shadow-sm hover:shadow-md transition"
              title="Переглянути сайт"
            >
              Переглянути сайт
              <ExternalLink size={18} className="opacity-80" />
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : statCards.map((stat, index) => {
                const Icon = stat.icon;
                const iconColor = colorClass[stat.color] || 'text-gray-700 dark:text-gray-200';

                return (
                  <div
                    key={index}
                    className="group relative rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 p-6 shadow-sm transition
                               hover:shadow-lg hover:-translate-y-1 will-change-transform"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* glow layer */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none
                                     bg-gradient-to-br ${stat.glow}`} />
                    {/* subtle highlight */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none
                                    bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
                          {stat.value}
                        </p>

                        <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 opacity-80">
                          Детальніше
                          <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      <div
                        className={`${stat.lightBg} p-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm`}
                        style={{ transform: 'translateZ(12px)' }} // “3D pop”
                      >
                        <Icon className={iconColor} size={24} />
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Area Chart */}
          <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200/70 dark:border-gray-700/70">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Дохід (14 днів)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Плавна динаміка доходу по днях
                </p>
              </div>
              <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" opacity={0.25} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDay}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${formatUAH(v)}`}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="currentColor"
                    className="text-green-600 dark:text-green-400"
                    strokeWidth={3}
                    fill="url(#revFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Bar Chart (якщо бекенд не дає orders — просто буде 0, але красиво) */}
          <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200/70 dark:border-gray-700/70">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Замовлення (14 днів)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Кількість замовлень по днях
                </p>
              </div>
              <ShoppingCart className="text-blue-600 dark:text-blue-400" size={24} />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="4 4" opacity={0.25} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDay}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="orders"
                    className="fill-current text-blue-600 dark:text-blue-400"
                    radius={[10, 10, 6, 6]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200/70 dark:border-gray-700/70">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Топ товарів (за продажами)
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Оновлюється автоматично
            </div>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="group flex items-center justify-between p-4 rounded-2xl border border-gray-200/60 dark:border-gray-700/60
                           bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/30 dark:to-gray-800/10
                           hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-2xl bg-green-500/15 blur opacity-0 group-hover:opacity-100 transition" />
                    <div className="relative flex items-center justify-center w-11 h-11 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 text-green-600 dark:text-green-400 rounded-2xl font-extrabold">
                      {index + 1}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Продано: <span className="font-semibold">{product.sales}</span> шт
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-gray-900 dark:text-white">
                    {formatUAH(product.revenue)} грн
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 inline-flex items-center gap-1">
                    Деталі <ArrowUpRight size={14} />
                  </p>
                </div>
              </div>
            ))}

            {!topProducts.length && (
              <div className="text-center text-gray-600 dark:text-gray-400 py-10">
                Немає даних по товарам
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

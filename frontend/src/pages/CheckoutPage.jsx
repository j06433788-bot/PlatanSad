import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import { toast } from 'sonner';
import {
  ArrowLeft,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  ChevronDown,
  X,
  User,
  Phone,
  MessageSquare,
  ShoppingBag,
  Search,
} from 'lucide-react';
import { searchCities, getWarehouses, popularCities } from '../api/novaPoshtaApi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '+380',
    deliveryAddress: '',
    deliveryMethod: 'nova_poshta',
    // paymentMethod лишається в стейті, але НЕ показуємо UI і НЕ відправляємо в замовлення
    paymentMethod: 'cash_on_delivery',
    notes: '',
    city: null,
    warehouse: null,
  });

  const [errors, setErrors] = useState({});

  // Нова Пошта
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  // Bottom-sheets (mobile)
  const [citySheetOpen, setCitySheetOpen] = useState(false);
  const [warehouseSheetOpen, setWarehouseSheetOpen] = useState(false);

  // Sheet search
  const [citySheetQuery, setCitySheetQuery] = useState('');
  const [warehouseSheetQuery, setWarehouseSheetQuery] = useState('');

  const cityInputRef = useRef(null);
  const warehouseInputRef = useRef(null);

  // --- Helpers: mobile detection (Tailwind sm = 640px) ---
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const apply = () => setIsMobile(!!mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  const deliveryIsNovaPoshta = formData.deliveryMethod === 'nova_poshta';

  // Пошук міст (debounce) для desktop input
  useEffect(() => {
    const t = setTimeout(async () => {
      if (citySearch.length >= 2) {
        setLoadingCities(true);
        try {
          const results = await searchCities(citySearch);
          setCities(results || []);
        } finally {
          setLoadingCities(false);
        }
      } else {
        setCities([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [citySearch]);

  // Пошук міст (debounce) для sheet input
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!citySheetOpen) return;
      if (citySheetQuery.length >= 2) {
        setLoadingCities(true);
        try {
          const results = await searchCities(citySheetQuery);
          setCities(results || []);
        } finally {
          setLoadingCities(false);
        }
      } else {
        setCities([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [citySheetQuery, citySheetOpen]);

  // Завантаження відділень
  useEffect(() => {
    const loadWarehouses = async () => {
      if (formData.city?.ref) {
        setLoadingWarehouses(true);
        try {
          const results = await getWarehouses(formData.city.ref);
          setWarehouses(results || []);
        } finally {
          setLoadingWarehouses(false);
        }
      } else {
        setWarehouses([]);
      }
    };
    loadWarehouses();
  }, [formData.city]);

  // Закриття dropdown при кліку назовні (desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
      if (warehouseInputRef.current && !warehouseInputRef.current.contains(event.target)) {
        setShowWarehouseDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC close (dropdown + sheets)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowCityDropdown(false);
        setShowWarehouseDropdown(false);
        setCitySheetOpen(false);
        setWarehouseSheetOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Lock scroll when any sheet open
  useEffect(() => {
    const open = citySheetOpen || warehouseSheetOpen;
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [citySheetOpen, warehouseSheetOpen]);

  // Reset sheet queries when opening
  useEffect(() => {
    if (citySheetOpen) {
      setCitySheetQuery(formData.city?.name || '');
      setCities([]);
      setLoadingCities(false);
    }
  }, [citySheetOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (warehouseSheetOpen) {
      setWarehouseSheetQuery('');
    }
  }, [warehouseSheetOpen]);

  const selectedSummary = useMemo(() => {
    if (formData.deliveryMethod === 'self_pickup') return 'Самовивіз з розсадника PlatanSad';
    if (!formData.city) return 'Оберіть місто';
    if (!formData.warehouse) return 'Оберіть відділення';
    return `${formData.city.name} • ${formData.warehouse.description}`;
  }, [formData.deliveryMethod, formData.city, formData.warehouse]);

  const itemsCountLabel = useMemo(() => {
    const n = cartItems.length;
    if (n === 1) return 'товар';
    if (n >= 2 && n <= 4) return 'товари';
    return 'товарів';
  }, [cartItems.length]);

  const filteredWarehouses = useMemo(() => {
    const q = (warehouseSheetQuery || '').trim().toLowerCase();
    if (!q) return warehouses;
    return warehouses.filter((w) => (w.description || '').toLowerCase().includes(q));
  }, [warehouses, warehouseSheetQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'customerPhone') {
      if (!value.startsWith('+380')) return;
      const phoneDigits = value.slice(4).replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, [name]: '+380' + phoneDigits.slice(0, 9) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, city, warehouse: null, deliveryAddress: '' }));
    setCitySearch(city.name);
    setShowCityDropdown(false);
    setCitySheetOpen(false);
    setErrors((prev) => ({ ...prev, city: '', warehouse: '' }));
  };

  const handleWarehouseSelect = (warehouse) => {
    setFormData((prev) => ({
      ...prev,
      warehouse,
      deliveryAddress: `${prev.city?.name || ''}, ${warehouse.description}`,
    }));
    setShowWarehouseDropdown(false);
    setWarehouseSheetOpen(false);
    setErrors((prev) => ({ ...prev, warehouse: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Обов'язкове поле";
    if (!formData.customerPhone.trim() || formData.customerPhone.length < 13) {
      newErrors.customerPhone = 'Введіть коректний номер';
    }

    if (deliveryIsNovaPoshta) {
      if (!formData.city) newErrors.city = 'Оберіть місто';
      if (!formData.warehouse) newErrors.warehouse = 'Оберіть відділення';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (!validateForm()) {
      toast.error("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }

    setLoading(true);
    try {
      // НЕ відправляємо paymentMethod
      // eslint-disable-next-line no-unused-vars
      const { paymentMethod, ...formDataWithoutPayment } = formData;

      const orderData = {
        ...formDataWithoutPayment,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: cartTotal,
        userId: 'guest',
        paymentStatus: 'pending',
      };

      const order = await ordersApi.createOrder(orderData);

      await clearCart();
      toast.success('Замовлення успішно оформлено!');
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      toast.error('Помилка оформлення замовлення');
    } finally {
      setLoading(false);
    }
  };

  // SEO JSON-LD (Order draft / Checkout page)
  const checkoutJsonLd = useMemo(() => {
    const items = cartItems.map((it) => ({
      '@type': 'Product',
      name: it.productName,
      image: it.productImage,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'UAH',
        price: String(it.price),
        availability: 'https://schema.org/InStock',
      },
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Оформлення замовлення — PlatanSad',
      description:
        'Оформлення замовлення у приватному розсаднику PlatanSad: доставка Новою Поштою або самовивіз, швидко та зручно з мобільного.',
      isPartOf: {
        '@type': 'WebSite',
        name: 'PlatanSad',
      },
      about: items.slice(0, 10),
    };
  }, [cartItems]);

  const Sheet = ({ open, onClose, title, children }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-[80]">
        {/* Overlay */}
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
          aria-label="Закрити"
        />
        {/* Panel */}
        <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 max-h-[86vh] flex flex-col">
          <div className="px-4 pt-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-base font-extrabold text-gray-900 truncate">{title}</div>
                <div className="text-xs text-gray-500 mt-0.5">Зручно як у маркетплейсах</div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition flex items-center justify-center"
                aria-label="Закрити"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="px-4 py-4 overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Helmet>
          <title>Кошик порожній — Оформлення | PlatanSad</title>
          <meta
            name="description"
            content="Кошик порожній. Поверніться в каталог PlatanSad та додайте рослини/саджанці до кошика, щоб оформити замовлення."
          />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 sm:py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">Оформлення</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="bg-white rounded-2xl shadow-sm md:shadow-lg p-6 sm:p-10 text-center max-w-xl mx-auto">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-green-500" />
            </div>

            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-3 shadow-sm">
              <span className="text-lg">🧺</span>
              <span>Поки що порожньо</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">Кошик порожній</h2>
            <p className="text-gray-500 text-sm sm:text-base mb-8">
              Додайте товари до кошика перед оформленням замовлення.
            </p>

            <button
              onClick={() => navigate('/catalog')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Перейти до каталогу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Оформлення замовлення | PlatanSad</title>
        <meta
          name="description"
          content="Оформлення замовлення в PlatanSad: доставка Новою Поштою або самовивіз з розсадника. Швидко, адаптивно під мобільні."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/checkout" />
        <script type="application/ld+json">{JSON.stringify(checkoutJsonLd)}</script>
      </Helmet>

      {/* Top bar (mobile-first) */}
      <div className="sticky top-0 z-[60] bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/20 active:scale-95 transition"
              aria-label="Назад до кошика"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="font-extrabold text-base sm:text-lg leading-tight truncate">Оформлення замовлення</h1>
              <p className="text-[12px] sm:text-sm text-white/85 leading-tight">
                {cartItems.length} {itemsCountLabel} • {cartTotal.toLocaleString()} ₴
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2">
              <span className="text-xs font-extrabold">PlatanSad</span>
              <span className="text-[11px] text-white/80">розсадник</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-7 pb-32 lg:pb-10">
        {/* Summary */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Сума замовлення</p>
              <p className="text-2xl sm:text-4xl font-extrabold text-green-600 mt-1">
                {cartTotal.toLocaleString()} ₴
              </p>
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                Доставка: <span className="font-semibold text-gray-700 break-words">{selectedSummary}</span>
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-green-50 border border-green-100 px-3 py-2">
              <p className="text-xs font-bold text-green-700">PlatanSad</p>
              <p className="text-[11px] text-green-600">швидке оформлення</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {cartItems.slice(0, 6).map((item) => (
              <div key={item.id} className="relative flex-shrink-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  loading="lazy"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-1 ring-gray-200"
                />
                <div className="absolute -top-2 -right-2 bg-white text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shadow-md ring-1 ring-gray-200">
                  {item.quantity}
                </div>
              </div>
            ))}
            {cartItems.length > 6 && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 ring-1 ring-gray-200">
                <span className="text-sm font-extrabold text-gray-700">+{cartItems.length - 6}</span>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 px-3 py-3">
              <div className="text-[11px] text-gray-500 font-bold uppercase">Доставка</div>
              <div className="text-sm font-extrabold text-gray-900 mt-0.5">
                {formData.deliveryMethod === 'self_pickup' ? 'Самовивіз' : 'Нова Пошта'}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 border border-gray-100 px-3 py-3">
              <div className="text-[11px] text-gray-500 font-bold uppercase">Контакт</div>
              <div className="text-sm font-extrabold text-gray-900 mt-0.5 truncate">
                {formData.customerPhone?.length > 4 ? formData.customerPhone : '+380…'}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 border border-gray-100 px-3 py-3">
              <div className="text-[11px] text-gray-500 font-bold uppercase">Оплата</div>
              <div className="text-sm font-extrabold text-gray-900 mt-0.5">Уточнюємо телефоном</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Contact */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-600 text-white rounded-2xl flex items-center justify-center text-base font-extrabold shadow-md">
                1
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">Контактні дані</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ім'я та прізвище</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Введіть ваше ім'я"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 transition-all ${
                      errors.customerName
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-green-500 focus:bg-white'
                    } outline-none text-base`}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+380XXXXXXXXX"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 transition-all ${
                      errors.customerPhone
                        ? 'border-red-400 bg-red-50'
                        : 'border-transparent focus:border-green-500 focus:bg-white'
                    } outline-none text-base`}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Delivery */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-base font-extrabold shadow-md">
                2
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">Доставка</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryMethod: 'nova_poshta',
                    deliveryAddress: prev.deliveryAddress,
                  }))
                }
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                  formData.deliveryMethod === 'nova_poshta'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      formData.deliveryMethod === 'nova_poshta' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-extrabold text-base mb-1">Нова Пошта</div>
                    <div className="text-xs text-gray-500">Доставка на відділення</div>
                  </div>
                  {formData.deliveryMethod === 'nova_poshta' && (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryMethod: 'self_pickup',
                    city: null,
                    warehouse: null,
                    deliveryAddress: 'Самовивіз: Рівненська обл., смт. Смига',
                  }))
                }
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                  formData.deliveryMethod === 'self_pickup'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      formData.deliveryMethod === 'self_pickup' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-extrabold text-base mb-1">Самовивіз</div>
                    <div className="text-xs text-gray-500">З розсадника PlatanSad</div>
                  </div>
                  {formData.deliveryMethod === 'self_pickup' && (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            </div>

            {/* Nova Poshta */}
            {deliveryIsNovaPoshta && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Місто / Село</label>

                  {isMobile ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setCitySheetOpen(true)}
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
                          errors.city ? 'border-red-400 bg-red-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className={`text-base ${formData.city ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                            {formData.city ? formData.city.name : 'Оберіть місто'}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">Натисніть, щоб знайти</div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                      </button>

                      {errors.city && (
                        <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {errors.city}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="relative" ref={cityInputRef}>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <input
                          type="text"
                          value={citySearch}
                          onChange={(e) => {
                            setCitySearch(e.target.value);
                            setShowCityDropdown(true);
                            setFormData((prev) => ({ ...prev, city: null, warehouse: null, deliveryAddress: '' }));
                          }}
                          onFocus={() => setShowCityDropdown(true)}
                          placeholder="Почніть вводити назву"
                          className={`w-full pl-12 pr-10 py-4 bg-gray-50 rounded-2xl border-2 transition-all ${
                            errors.city ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-blue-500 focus:bg-white'
                          } outline-none text-base`}
                        />
                        {(citySearch?.length > 0 || formData.city) && (
                          <button
                            type="button"
                            onClick={() => {
                              setCitySearch('');
                              setCities([]);
                              setFormData((prev) => ({ ...prev, city: null, warehouse: null, deliveryAddress: '' }));
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Очистити"
                          >
                            <X className="w-5 h-5 text-gray-400" />
                          </button>
                        )}
                      </div>

                      {errors.city && (
                        <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {errors.city}
                        </p>
                      )}

                      {showCityDropdown && (
                        <div className="absolute z-[60] w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-72 overflow-y-auto">
                          {loadingCities ? (
                            <div className="p-4 text-center text-gray-500 text-sm">Пошук міст...</div>
                          ) : citySearch.length < 2 ? (
                            <>
                              <div className="px-4 py-3 bg-gray-50 text-xs text-gray-600 font-bold uppercase tracking-wide sticky top-0">
                                Популярні міста
                              </div>
                              {popularCities.slice(0, 8).map((c, i) => (
                                <div
                                  key={i}
                                  onClick={async () => {
                                    setCitySearch(c);
                                    setLoadingCities(true);
                                    try {
                                      const results = await searchCities(c);
                                      if (results?.length > 0) handleCitySelect(results[0]);
                                    } finally {
                                      setLoadingCities(false);
                                    }
                                  }}
                                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 text-sm font-medium"
                                >
                                  {c}
                                </div>
                              ))}
                            </>
                          ) : cities.length > 0 ? (
                            cities.map((c) => (
                              <div
                                key={c.ref}
                                onClick={() => handleCitySelect(c)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                              >
                                <div className="text-sm font-semibold text-gray-800">{c.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{c.area} область</div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">Місто не знайдено</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Warehouse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Відділення Нової Пошти</label>

                  {isMobile ? (
                    <>
                      <button
                        type="button"
                        disabled={!formData.city || loadingWarehouses}
                        onClick={() => setWarehouseSheetOpen(true)}
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
                          errors.warehouse
                            ? 'border-red-400 bg-red-50'
                            : 'border-transparent bg-gray-50 hover:bg-gray-100'
                        } ${!formData.city || loadingWarehouses ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <Package className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className={`text-base ${formData.warehouse ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                            {loadingWarehouses
                              ? 'Завантаження відділень...'
                              : formData.warehouse
                              ? formData.warehouse.description
                              : formData.city
                              ? 'Оберіть відділення'
                              : 'Спочатку оберіть місто'}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {formData.city ? 'Натисніть для вибору' : 'Потрібно місто'}
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                      </button>

                      {errors.warehouse && (
                        <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {errors.warehouse}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="relative" ref={warehouseInputRef}>
                      <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => {
                            if (!formData.city || loadingWarehouses) return;
                            setShowWarehouseDropdown((v) => !v);
                          }}
                          disabled={!formData.city || loadingWarehouses}
                          className={`w-full pl-12 pr-10 py-4 bg-gray-50 rounded-2xl border-2 transition-all text-left ${
                            errors.warehouse ? 'border-red-400 bg-red-50' : 'border-transparent hover:border-blue-300'
                          } ${!formData.city || loadingWarehouses ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <span className={`block text-base ${formData.warehouse ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                            {loadingWarehouses
                              ? 'Завантаження відділень...'
                              : formData.warehouse
                              ? formData.warehouse.description
                              : formData.city
                              ? 'Оберіть відділення'
                              : 'Спочатку оберіть місто'}
                          </span>
                        </button>

                        {(formData.warehouse || showWarehouseDropdown) && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, warehouse: null, deliveryAddress: '' }));
                              setShowWarehouseDropdown(false);
                              setErrors((prev) => ({ ...prev, warehouse: '' }));
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Очистити"
                          >
                            <X className="w-5 h-5 text-gray-400" />
                          </button>
                        )}
                      </div>

                      {errors.warehouse && (
                        <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {errors.warehouse}
                        </p>
                      )}

                      {showWarehouseDropdown && (
                        <div className="absolute z-[60] w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-72 overflow-y-auto">
                          {loadingWarehouses ? (
                            <div className="p-4 text-center text-gray-500 text-sm">Завантаження відділень...</div>
                          ) : warehouses.length > 0 ? (
                            warehouses.map((w) => (
                              <div
                                key={w.ref || w.description}
                                onClick={() => handleWarehouseSelect(w)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                              >
                                <div className="text-sm font-semibold text-gray-800">{w.description}</div>
                                {w.shortAddress && <div className="text-xs text-gray-500 mt-0.5">{w.shortAddress}</div>}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">Відділення не знайдено</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Notes */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-base font-extrabold shadow-md">
                3
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">Коментар</h2>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Додаткові побажання</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Наприклад: дзвінок перед відправкою, час доставки тощо"
                className="w-full min-h-[120px] resize-none pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none text-base transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white/90 backdrop-blur border-t border-gray-200 sm:static sm:bg-transparent sm:border-0 sm:backdrop-blur-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-0 py-3 sm:py-0">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-extrabold text-white transition-all shadow-lg active:scale-[0.99] ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Оформлюємо...' : 'Оформити замовлення'}
              </button>
              <p className="text-[11px] text-gray-500 mt-2 text-center sm:hidden">
                Натискаючи “Оформити”, ви погоджуєтесь на дзвінок для підтвердження.
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* ===== City Sheet ===== */}
      <Sheet
        open={citySheetOpen}
        onClose={() => setCitySheetOpen(false)}
        title="Оберіть місто"
      >
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={citySheetQuery}
            onChange={(e) => setCitySheetQuery(e.target.value)}
            placeholder="Почніть вводити назву (мін. 2 символи)"
            className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none text-base transition-all"
            autoFocus
          />
          {citySheetQuery?.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setCitySheetQuery('');
                setCities([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Очистити"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {loadingCities ? (
          <div className="p-4 text-center text-gray-500 text-sm">Пошук міст...</div>
        ) : citySheetQuery.trim().length < 2 ? (
          <div>
            <div className="text-xs text-gray-500 font-extrabold uppercase tracking-wide mb-3">
              Популярні міста
            </div>
            <div className="grid grid-cols-2 gap-2">
              {popularCities.slice(0, 10).map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={async () => {
                    setCitySheetQuery(c);
                    setLoadingCities(true);
                    try {
                      const results = await searchCities(c);
                      if (results?.length > 0) handleCitySelect(results[0]);
                    } finally {
                      setLoadingCities(false);
                    }
                  }}
                  className="px-3 py-3 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-left"
                >
                  <div className="text-sm font-extrabold text-gray-900 truncate">{c}</div>
                  <div className="text-[11px] text-gray-500">Натисніть для вибору</div>
                </button>
              ))}
            </div>
          </div>
        ) : cities.length > 0 ? (
          <div className="space-y-2">
            {cities.map((c) => (
              <button
                key={c.ref}
                type="button"
                onClick={() => handleCitySelect(c)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-green-50 transition text-left"
              >
                <div className="text-sm font-extrabold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{c.area} область</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">Місто не знайдено</div>
        )}
      </Sheet>

      {/* ===== Warehouse Sheet ===== */}
      <Sheet
        open={warehouseSheetOpen}
        onClose={() => setWarehouseSheetOpen(false)}
        title={formData.city ? `Відділення — ${formData.city.name}` : 'Оберіть відділення'}
      >
        {!formData.city ? (
          <div className="p-4 text-center text-gray-500 text-sm">Спочатку оберіть місто</div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={warehouseSheetQuery}
                onChange={(e) => setWarehouseSheetQuery(e.target.value)}
                placeholder="Пошук відділення (номер/вулиця)"
                className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none text-base transition-all"
                autoFocus
              />
              {warehouseSheetQuery?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setWarehouseSheetQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Очистити"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {loadingWarehouses ? (
              <div className="p-4 text-center text-gray-500 text-sm">Завантаження відділень...</div>
            ) : filteredWarehouses.length > 0 ? (
              <div className="space-y-2">
                {filteredWarehouses.map((w) => (
                  <button
                    key={w.ref || w.description}
                    type="button"
                    onClick={() => handleWarehouseSelect(w)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-green-50 transition text-left"
                  >
                    <div className="text-sm font-extrabold text-gray-900">{w.description}</div>
                    {w.shortAddress && <div className="text-xs text-gray-500 mt-0.5">{w.shortAddress}</div>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">Відділення не знайдено</div>
            )}
          </>
        )}
      </Sheet>
    </div>
  );
};

export default CheckoutPage;

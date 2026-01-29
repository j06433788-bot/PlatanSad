import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import { toast } from 'sonner';
import {
  ArrowLeft, MapPin, Package,
  Truck, CheckCircle2, ChevronDown, Banknote, X, User, Phone,
  MessageSquare, ShoppingBag, Check, Search
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

  // Пошук міст (debounce)
  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (citySearch.length >= 2) {
        setLoadingCities(true);
        const results = await searchCities(citySearch);
        setCities(results);
        setLoadingCities(false);
      } else {
        setCities([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [citySearch]);

  // Завантаження відділень
  useEffect(() => {
    const loadWarehouses = async () => {
      if (formData.city?.ref) {
        setLoadingWarehouses(true);
        const results = await getWarehouses(formData.city.ref);
        setWarehouses(results);
        setLoadingWarehouses(false);
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

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
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
  };

  const handleWarehouseSelect = (warehouse) => {
    setFormData((prev) => ({
      ...prev,
      warehouse,
      deliveryAddress: `${prev.city?.name || ''}, ${warehouse.description}`,
    }));
    setShowWarehouseDropdown(false);
    setWarehouseSheetOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Обов'язкове поле";
    if (!formData.customerPhone.trim() || formData.customerPhone.length < 13)
      newErrors.customerPhone = 'Введіть коректний номер';

    if (formData.deliveryMethod === 'nova_poshta') {
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
      const orderData = {
        ...formData,
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-7 sm:py-9 md:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 hover:bg-white/20 active:scale-95 transition"
              aria-label="Назад до кошика"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="flex-1 text-center font-extrabold text-xl sm:text-2xl md:text-3xl">
              Оформлення замовлення
            </h1>
            <div className="w-10 h-10" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-36 lg:pb-10">
        {/* Summary */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border border-gray-100 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Сума замовлення</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-green-600">
                {cartTotal.toLocaleString()} ₴
              </p>
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? 'товар' : 'товарів'} у кошику
              </p>
            </div>
            <div className="shrink-0 rounded-2xl bg-green-50 border border-green-100 px-3 py-2">
              <p className="text-xs font-bold text-green-700">PlatanSad</p>
              <p className="text-[11px] text-green-600">швидке оформлення</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {cartItems.slice(0, 5).map((item) => (
              <div key={item.id} className="relative flex-shrink-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-1 ring-gray-200"
                />
                <div className="absolute -top-2 -right-2 bg-white text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shadow-md ring-1 ring-gray-200">
                  {item.quantity}
                </div>
              </div>
            ))}
            {cartItems.length > 5 && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 ring-1 ring-gray-200">
                <span className="text-sm font-extrabold text-gray-700">+{cartItems.length - 5}</span>
              </div>
            )}
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
                    placeholder="Введіть ваше ім'я"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 transition-all ${
                      errors.customerName ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-green-500 focus:bg-white'
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
                    placeholder="+380XXXXXXXXX"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 transition-all ${
                      errors.customerPhone ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-green-500 focus:bg-white'
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
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">Спосіб доставки</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, deliveryMethod: 'nova_poshta' }))}
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                  formData.deliveryMethod === 'nova_poshta'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      formData.deliveryMethod === 'nova_poshta'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-400'
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
                onClick={() => setFormData((prev) => ({ ...prev, deliveryMethod: 'self_pickup' }))}
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                  formData.deliveryMethod === 'self_pickup'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      formData.deliveryMethod === 'self_pickup'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-extrabold text-base mb-1">Самовивіз</div>
                    <div className="text-xs text-gray-500">З нашого розсадника</div>
                  </div>
                  {formData.deliveryMethod === 'self_pickup' && (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            </div>

            {/* Nova Poshta */}
            {formData.deliveryMethod === 'nova_poshta' && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                {/* City field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Місто / Село</label>

                  {/* Mobile: bottom sheet trigger */}
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
                          <div className="text-xs text-gray-500 mt-0.5">
                            Натисніть, щоб знайти місто
                          </div>
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
                    /* Desktop: dropdown */
                    <div className="relative" ref={cityInputRef}>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                        <input
                          type="text"
                          value={citySearch}
                          onChange={(e) => {
                            setCitySearch(e.target.value);
                            setShowCityDropdown(true);
                            setFormData((prev) => ({ ...prev, city: null, warehouse: null }));
                          }}
                          onFocus={() => setShowCityDropdown(true)}
                          placeholder="Почніть вводити назву"
                          className={`w-full pl-12 pr-10 py-4 bg-gray-50 rounded-2xl border-2 transition-all ${
                            errors.city
                              ? 'border-red-400 bg-red-50'
                              : 'border-transparent focus:border-blue-500 focus:bg-white'
                          } outline-none text-base`}
                        />
                        {formData.city && (
                          <button
                            type="button"
                            onClick={() => {
                              setCitySearch('');
                              setFormData((prev) => ({ ...prev, city: null, warehouse: null }));
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
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
                              {popularCities.slice(0, 8).map((city, i) => (
                                <div
                                  key={i}
                                  onClick={async () => {
                                    setCitySearch(city);
                                    const results = await searchCities(city);
                                    if (results.length > 0) handleCitySelect(results[0]);
                                  }}
                                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 text-sm font-medium"
                                >
                                  {city}
                                </div>
                              ))}
                            </>
                          ) : cities.length > 0 ? (
                            cities.map((city) => (
                              <div
                                key={city.ref}
                                onClick={() => handleCitySelect(city)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                              >
                                <div className="text-sm font-semibold text-gray-800">{city.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{city.area} область</div>
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

                {/* Warehouse field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Відділення Нової Пошти</label>

                  {/* Mobile: bottom sheet trigger */}
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
                        } ${(!formData.city || loadingWarehouses) ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                    /* Desktop: dropdown */
                    <div className="relative" ref={warehouseInputRef}>
                      <div
                        onClick={() => !loadingWarehouses && setShowWarehouseDropdown(true)}
                        className={`w-full pl-12 pr-10 py-4 bg-gray-50 rounded-2xl border-2 transition-all cursor-pointer flex items-center ${
                          errors.warehouse ? 'border-red-400 bg-red-50' : 'border-transparent hover:border-blue-300'
                        } ${!formData.city ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <Package className="absolute left-4 w-5 h-5 text-gray-400" />
                        <span className={`flex-1 text-base ${
                          formData.warehouse ? 'text-gray-800 font-medium' : 'text-gray-400'
                        }`}>
                          {!formData.city
                            ? 'Спочатку оберіть місто'
                            : loadingWarehouses
                              ? 'Завантаження відділень...'
                              : formData.warehouse
                                ? formData.warehouse.description
                                : 'Оберіть відділення'}
                        </span>
                        {formData.warehouse?.isPostomat && (
                          <span className="text-[10px] bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-bold mr-2 flex-shrink-0">
                            ПОШТОМАТ
                          </span>
                        )}
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>

                      {errors.warehouse && (
                        <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {errors.warehouse}
                        </p>
                      )}

                      {showWarehouseDropdown && warehouses.length > 0 && (
                        <div className="absolute z-[60] w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-72 overflow-y-auto">
                          <div className="px-4 py-3 bg-gray-50 text-xs text-gray-600 font-bold uppercase tracking-wide sticky top-0">
                            {warehouses.length} відділень
                          </div>
                          {warehouses.map((warehouse) => (
                            <div
                              key={warehouse.ref}
                              onClick={() => handleWarehouseSelect(warehouse)}
                              className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
                                warehouse.isPostomat ? 'bg-yellow-50/30' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-gray-800 flex-1">
                                  {warehouse.description}
                                </div>
                                {warehouse.isPostomat && (
                                  <span className="text-[10px] bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                                    ПОШТОМАТ
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Self pickup */}
            {formData.deliveryMethod === 'self_pickup' && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-green-50 p-5 rounded-2xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-extrabold text-green-900 mb-2">Адреса розсадника:</p>
                      <p className="text-sm text-green-800 font-medium">Рівненська обл., Дубенський р-н, смт. Смига</p>
                      <p className="text-xs text-green-600 mt-2">Пн-Сб: 9:00-18:00 | Нд: вихідний</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment */}
          {formData.deliveryMethod !== 'self_pickup' && (
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-base font-extrabold shadow-md">
                  3
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">Спосіб оплати</h2>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'cash_on_delivery' }))}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                    formData.paymentMethod === 'cash_on_delivery'
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        formData.paymentMethod === 'cash_on_delivery'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Banknote className="w-7 h-7" />
                    </div

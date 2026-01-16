import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import { liqpayApi } from '../api/liqpayApi';
import { toast } from 'sonner';
import { 
  ArrowLeft, ShoppingBag, MapPin, Package, CreditCard, 
  Truck, Wallet, CheckCircle2, Shield, Clock, ChevronRight,
  Banknote, Smartphone
} from 'lucide-react';
import { searchCities, getWarehouses, popularCities } from '../api/novaPoshtaApi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showLiqPayForm, setShowLiqPayForm] = useState(false);
  const [liqpayData, setLiqpayData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '+380',
    customerEmail: '',
    deliveryAddress: '',
    deliveryMethod: 'nova_poshta',
    paymentMethod: 'cash_on_delivery',
    notes: '',
    city: null,
    warehouse: null,
  });

  const [errors, setErrors] = useState({});
  
  // Стани для Нової Пошти
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  
  const cityInputRef = useRef(null);
  const warehouseInputRef = useRef(null);
  const liqpayFormRef = useRef(null);

  // Пошук міст при введенні
  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (citySearch.length >= 2) {
        const results = await searchCities(citySearch);
        setCities(results);
      } else {
        setCities([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [citySearch]);

  // Завантаження відділень при виборі міста
  useEffect(() => {
    const loadWarehouses = async () => {
      if (formData.city?.ref) {
        setLoadingWarehouses(true);
        const results = await getWarehouses(formData.city.ref);
        setWarehouses(results);
        setLoadingWarehouses(false);
      }
    };

    loadWarehouses();
  }, [formData.city]);

  // Закриття dropdown при кліку поза ним
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

  // Auto-submit LiqPay form when data is ready
  useEffect(() => {
    if (liqpayData && liqpayFormRef.current) {
      liqpayFormRef.current.submit();
    }
  }, [liqpayData]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Кошик порожній</h2>
            <p className="text-gray-500 mb-6">
              Додайте товари до кошика перед оформленням
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-green-500/30 active:scale-[0.98] transition-all"
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
      if (!value.startsWith('+380')) {
        return;
      }
      const phoneDigits = value.slice(4).replace(/\D/g, '');
      const formattedPhone = '+380' + phoneDigits.slice(0, 9);
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({
      ...prev,
      city: city,
      warehouse: null,
      deliveryAddress: ''
    }));
    setCitySearch(city.name);
    setShowCityDropdown(false);
    setWarehouses([]);
  };

  const handleWarehouseSelect = (warehouse) => {
    setFormData(prev => ({
      ...prev,
      warehouse: warehouse,
      deliveryAddress: `${formData.city.name}, ${warehouse.description}`
    }));
    setShowWarehouseDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Введіть ім'я";
    }

    if (!formData.customerPhone.trim() || formData.customerPhone === '+380') {
      newErrors.customerPhone = 'Введіть телефон';
    } else if (formData.customerPhone.length < 13) {
      newErrors.customerPhone = 'Введіть повний номер';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Введіть email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Невірний формат';
    }

    if (formData.deliveryMethod === 'nova_poshta') {
      if (!formData.city) {
        newErrors.city = 'Оберіть місто';
      }
      if (!formData.warehouse) {
        newErrors.warehouse = 'Оберіть відділення';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Заповніть всі обов\'язкові поля');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: cartTotal,
        userId: 'guest',
        paymentStatus: formData.paymentMethod === 'liqpay' ? 'pending' : 'pending'
      };

      const order = await ordersApi.createOrder(orderData);
      
      // If LiqPay payment selected, create checkout
      if (formData.paymentMethod === 'liqpay') {
        const resultUrl = `${window.location.origin}/order-success/${order.id}`;
        const serverUrl = `${process.env.REACT_APP_BACKEND_URL || ''}/api/liqpay/callback`;
        
        const checkout = await liqpayApi.createCheckout(
          order.id,
          cartTotal,
          `Замовлення #${order.id} - PlatanSad`,
          resultUrl,
          serverUrl
        );
        
        setLiqpayData(checkout);
        setShowLiqPayForm(true);
        
        // Don't clear cart yet - will be cleared after successful payment
        toast.success('Перенаправлення на сторінку оплати...');
      } else {
        // Cash on delivery - clear cart and redirect
        await clearCart();
        toast.success('Замовлення успішно оформлено!');
        navigate(`/order-success/${order.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Помилка оформлення. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  // Progress Steps Component
  const ProgressSteps = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            currentStep >= step 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-8 h-1 mx-1 rounded ${
              currentStep > step ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-32 lg:pb-8">
      {/* Hidden LiqPay Form */}
      {showLiqPayForm && liqpayData && (
        <form 
          ref={liqpayFormRef}
          method="POST" 
          action={liqpayData.checkout_url}
          acceptCharset="utf-8"
          className="hidden"
        >
          <input type="hidden" name="data" value={liqpayData.data} />
          <input type="hidden" name="signature" value={liqpayData.signature} />
        </form>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cart')}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Оформлення</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Mobile Progress */}
        <div className="lg:hidden">
          <ProgressSteps />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Контактні дані
                  </h2>
                </div>
                <div className="p-4 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Ім'я та прізвище
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-green-500 focus:bg-white transition-all ${
                        errors.customerName ? 'border-red-400 bg-red-50' : 'border-transparent'
                      }`}
                      placeholder="Іван Іваненко"
                      data-testid="customer-name-input"
                    />
                    {errors.customerName && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.customerName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-green-500 focus:bg-white transition-all ${
                        errors.customerPhone ? 'border-red-400 bg-red-50' : 'border-transparent'
                      }`}
                      placeholder="+380 XX XXX XX XX"
                      data-testid="customer-phone-input"
                    />
                    {errors.customerPhone && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.customerPhone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-0 focus:border-green-500 focus:bg-white transition-all ${
                        errors.customerEmail ? 'border-red-400 bg-red-50' : 'border-transparent'
                      }`}
                      placeholder="example@email.com"
                      data-testid="customer-email-input"
                    />
                    {errors.customerEmail && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.customerEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Доставка
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {/* Delivery Methods */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'deliveryMethod', value: 'nova_poshta' }})}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.deliveryMethod === 'nova_poshta'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Package className={`w-6 h-6 mb-2 ${formData.deliveryMethod === 'nova_poshta' ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="font-semibold text-sm text-gray-800">Нова Пошта</div>
                      <div className="text-xs text-gray-500 mt-0.5">До відділення</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'deliveryMethod', value: 'self_pickup' }})}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.deliveryMethod === 'self_pickup'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MapPin className={`w-6 h-6 mb-2 ${formData.deliveryMethod === 'self_pickup' ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="font-semibold text-sm text-gray-800">Самовивіз</div>
                      <div className="text-xs text-gray-500 mt-0.5">смт. Смига</div>
                    </button>
                  </div>

                  {/* Nova Poshta Fields */}
                  {formData.deliveryMethod === 'nova_poshta' && (
                    <div className="space-y-3 pt-2">
                      {/* City Search */}
                      <div className="relative" ref={cityInputRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Місто</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={citySearch}
                            onChange={(e) => {
                              setCitySearch(e.target.value);
                              setShowCityDropdown(true);
                              setFormData(prev => ({ ...prev, city: null, warehouse: null }));
                            }}
                            onFocus={() => setShowCityDropdown(true)}
                            className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all ${
                              errors.city ? 'border-red-400 bg-red-50' : 'border-transparent'
                            }`}
                            placeholder="Почніть вводити..."
                            data-testid="city-search-input"
                          />
                        </div>
                        {errors.city && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.city}</p>}

                        {/* City Dropdown */}
                        {showCityDropdown && (citySearch.length >= 2 ? cities.length > 0 : true) && (
                          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                            {citySearch.length < 2 && (
                              <>
                                <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 sticky top-0">
                                  Популярні міста
                                </div>
                                {popularCities.map((cityName, index) => (
                                  <div
                                    key={index}
                                    onClick={async () => {
                                      setCitySearch(cityName);
                                      const results = await searchCities(cityName);
                                      if (results.length > 0) handleCitySelect(results[0]);
                                    }}
                                    className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center gap-3"
                                  >
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{cityName}</span>
                                  </div>
                                ))}
                              </>
                            )}
                            {citySearch.length >= 2 && cities.map((city) => (
                              <div
                                key={city.ref}
                                onClick={() => handleCitySelect(city)}
                                className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0"
                              >
                                <div className="font-medium text-sm text-gray-800">{city.name}</div>
                                <div className="text-xs text-gray-500">{city.area}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Warehouse Select */}
                      {formData.city && (
                        <div className="relative" ref={warehouseInputRef}>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Відділення</label>
                          <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.warehouse ? formData.warehouse.description : ''}
                              onFocus={() => setShowWarehouseDropdown(true)}
                              readOnly
                              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl cursor-pointer focus:outline-none focus:border-green-500 focus:bg-white transition-all ${
                                errors.warehouse ? 'border-red-400 bg-red-50' : 'border-transparent'
                              }`}
                              placeholder={loadingWarehouses ? "Завантаження..." : "Оберіть відділення"}
                              data-testid="warehouse-select-input"
                            />
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                          {errors.warehouse && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.warehouse}</p>}

                          {/* Warehouse Dropdown */}
                          {showWarehouseDropdown && warehouses.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                              {warehouses.map((warehouse) => (
                                <div
                                  key={warehouse.ref}
                                  onClick={() => handleWarehouseSelect(warehouse)}
                                  className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0"
                                >
                                  <div className="font-medium text-sm text-gray-800">{warehouse.description}</div>
                                  <div className="text-xs text-gray-500">{warehouse.shortAddress}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Оплата
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {/* Payment Methods */}
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'cash_on_delivery' }})}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      formData.paymentMethod === 'cash_on_delivery'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.paymentMethod === 'cash_on_delivery' ? 'bg-green-500' : 'bg-gray-100'
                    }`}>
                      <Banknote className={`w-6 h-6 ${formData.paymentMethod === 'cash_on_delivery' ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-gray-800">Накладений платіж</div>
                      <div className="text-xs text-gray-500">Оплата при отриманні</div>
                    </div>
                    {formData.paymentMethod === 'cash_on_delivery' && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'liqpay' }})}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      formData.paymentMethod === 'liqpay'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.paymentMethod === 'liqpay' ? 'bg-[#7AB72B]' : 'bg-gray-100'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${formData.paymentMethod === 'liqpay' ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        LiqPay
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">ТЕСТ</span>
                      </div>
                      <div className="text-xs text-gray-500">Visa, Mastercard, Apple Pay</div>
                    </div>
                    {formData.paymentMethod === 'liqpay' && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </button>

                  {/* LiqPay Info */}
                  {formData.paymentMethod === 'liqpay' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3">
                      <p className="text-xs text-yellow-800">
                        <strong>Тестовий режим:</strong> Використовуйте тестову картку 4242 4242 4242 4242, будь-яку дату та CVV.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Коментар (необов'язково)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all resize-none"
                  placeholder="Додаткова інформація..."
                  data-testid="order-notes-input"
                />
              </div>
            </form>
          </div>

          {/* Order Summary - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Ваше замовлення</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 line-clamp-1">{item.productName}</div>
                      <div className="text-xs text-gray-500">{item.quantity} шт × {item.price} ₴</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {(item.price * item.quantity).toFixed(0)} ₴
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Товари</span>
                  <span>{cartTotal.toFixed(0)} ₴</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span className="text-green-600 text-sm">За тарифами</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Разом</span>
                  <span className="text-green-600">{cartTotal.toFixed(0)} ₴</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Оформлення...' : formData.paymentMethod === 'liqpay' ? 'Оплатити' : 'Підтвердити'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Безпечна оплата</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl lg:hidden z-40 safe-area-pb">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500">До сплати</div>
            <div className="text-2xl font-bold text-green-600">{cartTotal.toFixed(0)} ₴</div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 animate-spin" />
                Зачекайте...
              </span>
            ) : (
              formData.paymentMethod === 'liqpay' ? 'Оплатити' : 'Підтвердити'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

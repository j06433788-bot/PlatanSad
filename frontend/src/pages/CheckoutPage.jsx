import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import { liqpayApi } from '../api/liqpayApi';
import { toast } from 'sonner';
import { 
  ArrowLeft, MapPin, Package, CreditCard, 
  Truck, CheckCircle2, ChevronDown, Banknote, X
} from 'lucide-react';
import { searchCities, getWarehouses, popularCities } from '../api/novaPoshtaApi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [liqpayData, setLiqpayData] = useState(null);
  
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
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  
  const cityInputRef = useRef(null);
  const warehouseInputRef = useRef(null);
  const liqpayFormRef = useRef(null);

  // Пошук міст
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
      }
    };
    loadWarehouses();
  }, [formData.city]);

  // Закриття dropdown
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

  // LiqPay form submit
  useEffect(() => {
    if (liqpayData && liqpayFormRef.current) {
      liqpayFormRef.current.submit();
    }
  }, [liqpayData]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-lg">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Кошик порожній</h2>
          <p className="text-gray-500 mb-6 text-sm">Додайте товари перед оформленням</p>
          <button
            onClick={() => navigate('/catalog')}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold"
          >
            До каталогу
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'customerPhone') {
      if (!value.startsWith('+380')) return;
      const phoneDigits = value.slice(4).replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: '+380' + phoneDigits.slice(0, 9) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, city, warehouse: null, deliveryAddress: '' }));
    setCitySearch(city.name);
    setShowCityDropdown(false);
    setWarehouses([]);
  };

  const handleWarehouseSelect = (warehouse) => {
    setFormData(prev => ({
      ...prev,
      warehouse,
      deliveryAddress: `${formData.city.name}, ${warehouse.description}`
    }));
    setShowWarehouseDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Обов'язкове поле";
    if (!formData.customerPhone.trim() || formData.customerPhone.length < 13) 
      newErrors.customerPhone = 'Введіть номер';
    if (!formData.customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) 
      newErrors.customerEmail = 'Невірний email';
    if (formData.deliveryMethod === 'nova_poshta') {
      if (!formData.city) newErrors.city = 'Оберіть місто';
      if (!formData.warehouse) newErrors.warehouse = 'Оберіть відділення';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Заповніть всі поля');
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
        paymentStatus: 'pending'
      };

      const order = await ordersApi.createOrder(orderData);
      
      if (formData.paymentMethod === 'liqpay') {
        const resultUrl = `${window.location.origin}/order-success/${order.id}`;
        const checkout = await liqpayApi.createCheckout(
          order.id, cartTotal, `Замовлення #${order.id}`, resultUrl
        );
        setLiqpayData(checkout);
        toast.success('Перенаправлення на оплату...');
      } else {
        await clearCart();
        toast.success('Замовлення оформлено!');
        navigate(`/order-success/${order.id}`);
      }
    } catch (error) {
      toast.error('Помилка оформлення');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* LiqPay Form */}
      {liqpayData && (
        <form ref={liqpayFormRef} method="POST" action={liqpayData.checkout_url} className="hidden">
          <input type="hidden" name="data" value={liqpayData.data} />
          <input type="hidden" name="signature" value={liqpayData.signature} />
        </form>
      )}

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate('/cart')} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Оформлення</h1>
        </div>
      </div>

      <div className="p-4 pb-32">
        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Товарів: {cartItems.length}</span>
            <span className="text-xl font-bold text-green-600">{cartTotal.toLocaleString()} ₴</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {cartItems.slice(0, 4).map((item) => (
              <img key={item.id} src={item.productImage} alt="" 
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            ))}
            {cartItems.length > 4 && (
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm text-gray-500">+{cartItems.length - 4}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
              Контактні дані
            </h2>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Ім'я та прізвище *"
                  className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 ${errors.customerName ? 'border-red-400' : 'border-transparent'} focus:border-green-500 focus:bg-white outline-none`}
                />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="+380XXXXXXXXX *"
                  className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 ${errors.customerPhone ? 'border-red-400' : 'border-transparent'} focus:border-green-500 focus:bg-white outline-none`}
                />
                {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
              </div>
              <div>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="Email *"
                  className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 ${errors.customerEmail ? 'border-red-400' : 'border-transparent'} focus:border-green-500 focus:bg-white outline-none`}
                />
                {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
              Доставка
            </h2>
            
            {/* Delivery Method */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'nova_poshta' }))}
                className={`flex-1 p-3 rounded-xl border-2 flex items-center gap-2 ${
                  formData.deliveryMethod === 'nova_poshta' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <Truck className={`w-5 h-5 ${formData.deliveryMethod === 'nova_poshta' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Нова Пошта</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'self_pickup' }))}
                className={`flex-1 p-3 rounded-xl border-2 flex items-center gap-2 ${
                  formData.deliveryMethod === 'self_pickup' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <MapPin className={`w-5 h-5 ${formData.deliveryMethod === 'self_pickup' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Самовивіз</span>
              </button>
            </div>

            {/* Nova Poshta Fields */}
            {formData.deliveryMethod === 'nova_poshta' && (
              <div className="space-y-3">
                {/* City */}
                <div className="relative" ref={cityInputRef}>
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
                      placeholder="Місто / село *"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-2 ${errors.city ? 'border-red-400' : 'border-transparent'} focus:border-green-500 focus:bg-white outline-none`}
                    />
                    {formData.city && (
                      <button
                        type="button"
                        onClick={() => {
                          setCitySearch('');
                          setFormData(prev => ({ ...prev, city: null, warehouse: null }));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  
                  {/* City Dropdown */}
                  {showCityDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {loadingCities ? (
                        <div className="p-3 text-center text-gray-500 text-sm">Пошук...</div>
                      ) : citySearch.length < 2 ? (
                        <>
                          <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 font-medium">Популярні міста</div>
                          {popularCities.slice(0, 8).map((city, i) => (
                            <div
                              key={i}
                              onClick={async () => {
                                setCitySearch(city);
                                const results = await searchCities(city);
                                if (results.length > 0) handleCitySelect(results[0]);
                              }}
                              className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer text-sm"
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
                            className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                          >
                            <div className="text-sm font-medium">{city.name}</div>
                            <div className="text-xs text-gray-500">{city.area} обл.</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">Не знайдено</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Warehouse */}
                {formData.city && (
                  <div className="relative" ref={warehouseInputRef}>
                    <div 
                      onClick={() => setShowWarehouseDropdown(true)}
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-2 ${errors.warehouse ? 'border-red-400' : 'border-transparent'} cursor-pointer flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className={`truncate ${formData.warehouse ? 'text-gray-800' : 'text-gray-400'}`}>
                          {loadingWarehouses ? 'Завантаження...' : formData.warehouse?.description || 'Відділення *'}
                        </span>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                    {errors.warehouse && <p className="text-red-500 text-xs mt-1">{errors.warehouse}</p>}
                    
                    {/* Warehouse Dropdown */}
                    {showWarehouseDropdown && warehouses.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {warehouses.map((warehouse) => (
                          <div
                            key={warehouse.ref}
                            onClick={() => handleWarehouseSelect(warehouse)}
                            className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                          >
                            <div className="text-sm">{warehouse.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {formData.deliveryMethod === 'self_pickup' && (
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="text-sm text-green-800">
                  <strong>Адреса:</strong> смт. Смига, вул. Садова, 15
                </p>
                <p className="text-xs text-green-600 mt-1">Пн-Сб: 9:00-18:00</p>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
              Оплата
            </h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash_on_delivery' }))}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                  formData.paymentMethod === 'cash_on_delivery' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <Banknote className={`w-6 h-6 ${formData.paymentMethod === 'cash_on_delivery' ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">Накладений платіж</div>
                  <div className="text-xs text-gray-500">Оплата при отриманні</div>
                </div>
                {formData.paymentMethod === 'cash_on_delivery' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'liqpay' }))}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 ${
                  formData.paymentMethod === 'liqpay' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <CreditCard className={`w-6 h-6 ${formData.paymentMethod === 'liqpay' ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="text-left flex-1">
                  <div className="font-medium text-sm flex items-center gap-2">
                    LiqPay
                    <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded">ТЕСТ</span>
                  </div>
                  <div className="text-xs text-gray-500">Visa, Mastercard</div>
                </div>
                {formData.paymentMethod === 'liqpay' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </button>
            </div>
            
            {formData.paymentMethod === 'liqpay' && (
              <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-700">
                  Тестова картка: <strong>4242 4242 4242 4242</strong>
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Коментар до замовлення (необов'язково)"
              rows="2"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none resize-none text-sm"
            />
          </div>
        </form>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-gray-500">До сплати</div>
            <div className="text-2xl font-bold text-green-600">{cartTotal.toLocaleString()} ₴</div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-500 text-white py-4 rounded-xl font-bold text-base disabled:opacity-50 active:bg-green-600 transition-colors"
          >
            {loading ? 'Зачекайте...' : 'Оформити замовлення'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingBag, Search, MapPin, Package } from 'lucide-react';
import { searchCities, getWarehouses, popularCities } from '../api/novaPoshtaApi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Кошик порожній</h2>
            <p className="text-gray-600 mb-8">
              Додайте товари до кошика перед оформленням замовлення
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all"
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
    
    // Обробка телефону - не дозволяємо видалити +380
    if (name === 'customerPhone') {
      if (!value.startsWith('+380')) {
        return;
      }
      // Дозволяємо тільки цифри після +380
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
    
    // Clear error when user starts typing
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
      newErrors.customerPhone = 'Введіть повний номер телефону';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Введіть email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Невірний формат email';
    }

    if (formData.deliveryMethod === 'nova_poshta') {
      if (!formData.city) {
        newErrors.city = 'Оберіть місто';
      }
      if (!formData.warehouse) {
        newErrors.warehouse = 'Оберіть відділення';
      }
    } else if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Введіть адресу';
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
        userId: 'guest'
      };

      const order = await ordersApi.createOrder(orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      toast.success('Замовлення успішно оформлено!');
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Помилка оформлення замовлення. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 sm:mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Назад до кошика</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8" data-testid="checkout-title">
          Оформлення замовлення
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                  Контактна інформація
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ім'я та прізвище <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.customerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Іван Іваненко"
                      data-testid="customer-name-input"
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+380 XX XXX XX XX"
                      data-testid="customer-phone-input"
                    />
                    {errors.customerPhone && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                      data-testid="customer-email-input"
                    />
                    {errors.customerEmail && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.customerEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="border-t pt-4 sm:pt-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Доставка</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Спосіб доставки <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-start sm:items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="nova_poshta"
                          checked={formData.deliveryMethod === 'nova_poshta'}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 mt-0.5 sm:mt-0 flex-shrink-0"
                          data-testid="delivery-nova-poshta"
                        />
                        <span className="ml-3">
                          <span className="font-medium text-sm sm:text-base block">Нова Пошта</span>
                          <span className="block text-xs sm:text-sm text-gray-500 mt-0.5">
                            Доставка до відділення або поштомату
                          </span>
                        </span>
                      </label>
                      <label className="flex items-start sm:items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="self_pickup"
                          checked={formData.deliveryMethod === 'self_pickup'}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 mt-0.5 sm:mt-0 flex-shrink-0"
                          data-testid="delivery-self-pickup"
                        />
                        <span className="ml-3">
                          <span className="font-medium text-sm sm:text-base block">Самовивіз</span>
                          <span className="block text-xs sm:text-sm text-gray-500 mt-0.5">
                            смт. Смига, Рівненська обл.
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.deliveryMethod === 'nova_poshta' ? (
                    <>
                      {/* Вибір міста */}
                      <div className="relative" ref={cityInputRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Місто <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <input
                            type="text"
                            value={citySearch}
                            onChange={(e) => {
                              setCitySearch(e.target.value);
                              setShowCityDropdown(true);
                              setFormData(prev => ({ ...prev, city: null, warehouse: null }));
                            }}
                            onFocus={() => setShowCityDropdown(true)}
                            className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                              errors.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Почніть вводити назву міста..."
                            data-testid="city-search-input"
                          />
                        </div>
                        {errors.city && (
                          <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.city}</p>
                        )}

                        {/* Dropdown з містами */}
                        {showCityDropdown && citySearch.length >= 2 && cities.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                            {cities.map((city) => (
                              <div
                                key={city.ref}
                                onClick={() => handleCitySelect(city)}
                                className="px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0"
                              >
                                <div className="font-medium text-sm sm:text-base text-gray-800">{city.name}</div>
                                <div className="text-xs sm:text-sm text-gray-500">{city.area}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Популярні міста */}
                        {showCityDropdown && citySearch.length < 2 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                            <div className="px-3 sm:px-4 py-2 bg-gray-50 text-xs sm:text-sm font-medium text-gray-600 sticky top-0">
                              Популярні міста
                            </div>
                            {popularCities.map((cityName, index) => (
                              <div
                                key={index}
                                onClick={async () => {
                                  setCitySearch(cityName);
                                  const results = await searchCities(cityName);
                                  if (results.length > 0) {
                                    handleCitySelect(results[0]);
                                  }
                                }}
                                className="px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0 text-sm sm:text-base"
                              >
                                {cityName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Вибір відділення */}
                      {formData.city && (
                        <div className="relative" ref={warehouseInputRef}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Відділення Нової Пошти <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.warehouse ? formData.warehouse.description : ''}
                              onFocus={() => setShowWarehouseDropdown(true)}
                              readOnly
                              className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer ${
                                errors.warehouse ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder={loadingWarehouses ? "Завантаження..." : "Оберіть відділення"}
                              data-testid="warehouse-select-input"
                            />
                          </div>
                          {errors.warehouse && (
                            <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.warehouse}</p>
                          )}

                          {/* Dropdown з відділеннями */}
                          {showWarehouseDropdown && warehouses.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                              {warehouses.map((warehouse) => (
                                <div
                                  key={warehouse.ref}
                                  onClick={() => handleWarehouseSelect(warehouse)}
                                  className="px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0"
                                >
                                  <div className="font-medium text-sm sm:text-base text-gray-800">
                                    {warehouse.description}
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-500">
                                    {warehouse.shortAddress}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Адреса <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="смт. Смига, Рівненська обл."
                        data-testid="delivery-address-input"
                      />
                      {errors.deliveryAddress && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.deliveryAddress}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t pt-4 sm:pt-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Оплата</h2>
                <div className="space-y-2">
                  <label className="flex items-start sm:items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 mt-0.5 sm:mt-0 flex-shrink-0"
                      data-testid="payment-cash"
                    />
                    <span className="ml-3">
                      <span className="font-medium text-sm sm:text-base block">Накладений платіж</span>
                      <span className="block text-xs sm:text-sm text-gray-500 mt-0.5">
                        Оплата при отриманні товару
                      </span>
                    </span>
                  </label>
                  <label className="flex items-start sm:items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 mt-0.5 sm:mt-0 flex-shrink-0"
                      data-testid="payment-card"
                    />
                    <span className="ml-3">
                      <span className="font-medium text-sm sm:text-base block">Оплата на картку</span>
                      <span className="block text-xs sm:text-sm text-gray-500 mt-0.5">
                        Передоплата на банківську картку
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="border-t pt-4 sm:pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Коментар до замовлення
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Додаткова інформація (необов'язково)"
                  data-testid="order-notes-input"
                />
              </div>

              {/* Мобільна кнопка (показується тільки на маленьких екранах) */}
              <button
                type="submit"
                disabled={loading}
                className="lg:hidden w-full bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                data-testid="place-order-btn-mobile"
              >
                {loading ? 'Оформлення...' : 'Підтвердити замовлення'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Ваше замовлення</h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-2 sm:gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded bg-gray-100 flex-shrink-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
                        {item.productName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.quantity} шт × {item.price} грн
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-800 flex-shrink-0">
                      {(item.price * item.quantity).toFixed(2)} грн
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Товари</span>
                  <span>{cartTotal.toFixed(2)} грн</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>Доставка</span>
                  <span className="text-green-600 text-xs sm:text-sm">За тарифами перевізника</span>
                </div>
                <div className="border-t pt-2 sm:pt-3 flex justify-between text-lg sm:text-xl font-bold">
                  <span>Разом</span>
                  <span className="text-green-600" data-testid="checkout-total">{cartTotal.toFixed(2)} грн</span>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="hidden lg:block w-full mt-4 sm:mt-6 bg-green-600 hover:bg-green-700 text-white py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                data-testid="place-order-btn"
              >
                {loading ? 'Оформлення...' : 'Підтвердити замовлення'}
              </button>

              <p className="mt-3 sm:mt-4 text-xs text-gray-500 text-center">
                Натискаючи кнопку, ви погоджуєтесь з умовами обробки персональних даних
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

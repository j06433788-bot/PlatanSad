import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    deliveryMethod: 'nova_poshta',
    paymentMethod: 'cash_on_delivery',
    notes: '',
  });

  const [errors, setErrors] = useState({});

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Введіть ім'я";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Введіть телефон';
    } else if (!/^\+?[0-9\s\-()]{10,}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Невірний формат телефону';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Введіть email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Невірний формат email';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Введіть адресу доставки';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад до кошика</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8" data-testid="checkout-title">Оформлення замовлення</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Контактна інформація</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ім'я та прізвище <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.customerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Іван Іваненко"
                      data-testid="customer-name-input"
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+380 (XX) XXX-XX-XX"
                      data-testid="customer-phone-input"
                    />
                    {errors.customerPhone && (
                      <p className="mt-1 text-sm text-red-500">{errors.customerPhone}</p>
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                      data-testid="customer-email-input"
                    />
                    {errors.customerEmail && (
                      <p className="mt-1 text-sm text-red-500">{errors.customerEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Доставка</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Спосіб доставки <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="nova_poshta"
                          checked={formData.deliveryMethod === 'nova_poshta'}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600"
                          data-testid="delivery-nova-poshta"
                        />
                        <span className="ml-3">
                          <span className="font-medium">Нова Пошта</span>
                          <span className="block text-sm text-gray-500">Доставка до відділення або поштомату</span>
                        </span>
                      </label>
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="self_pickup"
                          checked={formData.deliveryMethod === 'self_pickup'}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600"
                          data-testid="delivery-self-pickup"
                        />
                        <span className="ml-3">
                          <span className="font-medium">Самовивіз</span>
                          <span className="block text-sm text-gray-500">смт. Смига, Рівненська обл.</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Адреса доставки <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Місто, відділення Нової Пошти або повна адреса"
                      data-testid="delivery-address-input"
                    />
                    {errors.deliveryAddress && (
                      <p className="mt-1 text-sm text-red-500">{errors.deliveryAddress}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Оплата</h2>
                <div className="space-y-2">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600"
                      data-testid="payment-cash"
                    />
                    <span className="ml-3">
                      <span className="font-medium">Накладений платіж</span>
                      <span className="block text-sm text-gray-500">Оплата при отриманні товару</span>
                    </span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600"
                      data-testid="payment-card"
                    />
                    <span className="ml-3">
                      <span className="font-medium">Оплата на картку</span>
                      <span className="block text-sm text-gray-500">Передоплата на банківську картку</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Коментар до замовлення
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Додаткова інформація (необов'язково)"
                  data-testid="order-notes-input"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Ваше замовлення</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 line-clamp-2">
                        {item.productName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.quantity} шт × {item.price} грн
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {(item.price * item.quantity).toFixed(2)} грн
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Товари</span>
                  <span>{cartTotal.toFixed(2)} грн</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span className="text-green-600">За тарифами перевізника</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Разом</span>
                  <span className="text-green-600" data-testid="checkout-total">{cartTotal.toFixed(2)} грн</span>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-medium text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                data-testid="place-order-btn"
              >
                {loading ? 'Оформлення...' : 'Підтвердити замовлення'}
              </button>

              <p className="mt-4 text-xs text-gray-500 text-center">
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

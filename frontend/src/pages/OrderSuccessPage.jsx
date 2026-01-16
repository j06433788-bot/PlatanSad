import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/ordersApi';
import { CheckCircle, Package, Phone, Mail } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await ordersApi.getOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Завантаження...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Замовлення не знайдено</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4" data-testid="success-title">
            Дякуємо за замовлення!
          </h1>
          <p className="text-gray-600 mb-6">
            Ваше замовлення <span className="font-bold text-green-600">#{order.id.slice(0, 8)}</span> успішно оформлено
          </p>
          <div className="text-sm text-gray-500">
            Найближчим часом наш менеджер зв'яжеться з вами для підтвердження замовлення
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Деталі замовлення</h2>
          
          {/* Customer Info */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-medium text-gray-700 mb-3">Контактна інформація</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Ім'я:</span> {order.customerName}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{order.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-medium text-gray-700 mb-3">Доставка</h3>
            <div className="space-y-2 text-gray-600">
              <div>
                <span className="font-medium">Спосіб:</span>{' '}
                {order.deliveryMethod === 'nova_poshta' ? 'Нова Пошта' : 'Самовивіз'}
              </div>
              <div>
                <span className="font-medium">Адреса:</span> {order.deliveryAddress}
              </div>
              <div>
                <span className="font-medium">Оплата:</span>{' '}
                {order.paymentMethod === 'cash_on_delivery' ? 'Накладений платіж' : 'Оплата на карту'}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Товари</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.productName}</div>
                    <div className="text-sm text-gray-500">
                      {item.quantity} шт × {item.price} грн
                    </div>
                  </div>
                  <div className="font-medium text-gray-800">
                    {(item.price * item.quantity).toFixed(2)} грн
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-xl font-bold">
              <span>Разом:</span>
              <span className="text-green-600" data-testid="order-total">{order.totalAmount.toFixed(2)} грн</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            onClick={() => navigate('/catalog')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
            data-testid="continue-shopping-success-btn"
          >
            Продовжити покупки
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 border-2 border-gray-300 hover:border-green-600 text-gray-700 hover:text-green-600 px-6 py-3 rounded-lg font-medium transition-all"
          >
            На головну
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-2">Корисна інформація:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Після підтвердження замовлення ми відправимо вам деталі на електронну пошту</li>
                <li>Строк обробки замовлення - 1-2 робочі дні</li>
                <li>Доставка Новою Поштою - 1-3 дні залежно від регіону</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import { liqpayApi } from '../api/liqpayApi';
import { 
  CheckCircle2, Package, Truck, CreditCard, 
  Home, ShoppingBag, Clock, Phone
} from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const cartCleared = useRef(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Clear cart only once
        if (!cartCleared.current) {
          cartCleared.current = true;
          await clearCart();
        }
        
        // Fetch order details
        const orderData = await ordersApi.getOrderById(orderId);
        setOrder(orderData);
        
        // Fetch payment status if LiqPay
        if (orderData?.paymentMethod === 'liqpay') {
          const status = await liqpayApi.getPaymentStatus(orderId);
          setPaymentStatus(status);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  const isPaid = paymentStatus?.payment_status === 'paid' || 
                 order?.paymentStatus === 'paid' ||
                 paymentStatus?.liqpay_status === 'sandbox' ||
                 paymentStatus?.liqpay_status === 'success';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/30">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg">🎉</span>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-6 mb-2">
            Дякуємо за замовлення!
          </h1>
          <p className="text-gray-500">
            Ваше замовлення успішно оформлено
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          {/* Order Number */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Номер замовлення</p>
                <p className="font-bold text-lg">#{orderId?.slice(-8).toUpperCase()}</p>
              </div>
              <Package className="w-10 h-10 opacity-50" />
            </div>
          </div>

          {/* Payment Status */}
          {order?.paymentMethod === 'liqpay' && (
            <div className={`px-6 py-3 flex items-center gap-3 ${isPaid ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <CreditCard className={`w-5 h-5 ${isPaid ? 'text-green-600' : 'text-yellow-600'}`} />
              <div>
                <p className={`font-semibold ${isPaid ? 'text-green-700' : 'text-yellow-700'}`}>
                  {isPaid ? 'Оплачено через LiqPay' : 'Очікується оплата'}
                </p>
                {paymentStatus?.liqpay_status === 'sandbox' && (
                  <p className="text-xs text-green-600">Тестовий платіж (sandbox)</p>
                )}
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="p-6 space-y-4">
            {/* Customer */}
            {order && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Одержувач</p>
                  <p className="font-semibold text-gray-800">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                </div>
              </div>
            )}

            {/* Delivery */}
            {order && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Доставка</p>
                  <p className="font-semibold text-gray-800">
                    {order.deliveryMethod === 'nova_poshta' ? 'Нова Пошта' : 'Самовивіз'}
                  </p>
                  <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                </div>
              </div>
            )}

            {/* Payment */}
            {order && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Оплата</p>
                  <p className="font-semibold text-gray-800">
                    {order.paymentMethod === 'liqpay' ? 'LiqPay (онлайн)' : 'Накладений платіж'}
                  </p>
                </div>
              </div>
            )}

            {/* Items Summary */}
            {order?.items && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-3">Товари ({order.items.length})</p>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img 
                        src={item.productImage} 
                        alt={item.productName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.quantity} шт × {item.price} ₴</p>
                      </div>
                      <p className="font-semibold text-gray-800">{item.price * item.quantity} ₴</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            {order && (
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Разом</span>
                <span className="text-2xl font-bold text-green-600">{order.totalAmount} ₴</span>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Що далі?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600">
                Ми зв'яжемося з вами для підтвердження замовлення
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600">
                Підготуємо та відправимо ваше замовлення протягом 1-2 днів
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600">
                Ви отримаєте SMS з номером ТТН для відстеження
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6">
          <p className="text-center text-sm text-gray-600">
            Питання? Телефонуйте: <a href="tel:+380501234567" className="font-semibold text-green-600">+38 (050) 123-45-67</a>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/catalog')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            data-testid="continue-shopping-btn"
          >
            <ShoppingBag className="w-5 h-5" />
            Продовжити покупки
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white text-gray-700 py-4 rounded-2xl font-semibold border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            data-testid="go-home-btn"
          >
            <Home className="w-5 h-5" />
            На головну
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

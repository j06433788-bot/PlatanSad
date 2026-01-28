import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/ordersApi';
import { liqpayApi } from '../api/liqpayApi';
import {
  CheckCircle2,
  Package,
  Truck,
  CreditCard,
  Home,
  ShoppingBag,
  Clock,
  Phone,
  ChevronRight,
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

    if (orderId) fetchOrderData();
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isPaid =
    paymentStatus?.payment_status === 'paid' ||
    order?.paymentStatus === 'paid' ||
    paymentStatus?.liqpay_status === 'sandbox' ||
    paymentStatus?.liqpay_status === 'success';

  const shortOrderId = orderId?.slice?.(-8)?.toUpperCase?.() || orderId;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b09] text-white flex items-center justify-center px-4">
        {/* Footer-like background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-green-500/18 blur-3xl" />
          <div className="absolute -bottom-44 right-[-8rem] h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-md text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/70 text-sm">Завантаження…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b09] text-white relative overflow-hidden">
      {/* Footer-like premium background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-green-500/18 blur-3xl" />
        <div className="absolute -bottom-44 right-[-8rem] h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/40" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.16) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-3 sm:px-4 pt-5 sm:pt-8 pb-28 sm:pb-10">
        <div className="max-w-lg mx-auto">
          {/* Success header */}
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-500/15 ring-1 ring-green-400/20 flex items-center justify-center shadow-[0_18px_40px_rgba(34,197,94,0.18)]">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-base">🎉</span>
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-white/60">Замовлення оформлено</p>
                <h1 className="text-lg sm:text-2xl font-bold text-white/90 leading-tight">
                  Дякуємо за покупку!
                </h1>
                <p className="mt-1 text-sm text-white/65">
                  Номер: <span className="font-semibold text-white">#{shortOrderId}</span>
                </p>

                {order?.paymentMethod === 'liqpay' && (
                  <div
                    className={`mt-3 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold ring-1 ${
                      isPaid
                        ? 'bg-green-500/10 text-green-200 ring-green-400/20'
                        : 'bg-yellow-500/10 text-yellow-200 ring-yellow-400/20'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {isPaid ? 'Оплачено через LiqPay' : 'Очікується оплата'}
                    {paymentStatus?.liqpay_status === 'sandbox' ? ' (sandbox)' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main card */}
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md overflow-hidden mb-4 sm:mb-6">
            {/* Top strip */}
            <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-white/[0.06] via-transparent to-black/30">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-white/55">Деталі замовлення</p>
                  <p className="text-sm font-semibold text-white/90 truncate">
                    Підтвердження та відправка — протягом 1–2 днів
                  </p>
                </div>
                <Package className="w-9 h-9 text-white/25 flex-shrink-0" />
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3">
              {/* Customer */}
              {order && (
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-green-500/15 ring-1 ring-green-400/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-white/55">Одержувач</p>
                      <p className="font-semibold text-white/90 text-sm sm:text-base break-words">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-white/70 break-all">{order.customerPhone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery */}
              {order && (
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/6 ring-1 ring-white/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-white/55">Доставка</p>
                      <p className="font-semibold text-white/90 text-sm sm:text-base">
                        {order.deliveryMethod === 'nova_poshta' ? 'Нова Пошта' : 'Самовивіз'}
                      </p>
                      <p className="text-sm text-white/70 break-words">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment */}
              {order && (
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/6 ring-1 ring-white/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-white/55">Оплата</p>
                      <p className="font-semibold text-white/90 text-sm sm:text-base">
                        {order.paymentMethod === 'liqpay' ? 'LiqPay (онлайн)' : 'Накладений платіж'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Items */}
              {order?.items?.length > 0 && (
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-3 sm:p-4">
                  <p className="text-xs text-white/55 mb-3">Товари ({order.items.length})</p>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-2xl bg-black/20 ring-1 ring-white/10 p-2.5"
                      >
                        <img
                          src={item.productImage || '/placeholder.png'}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white/90 break-words leading-5">
                            {item.productName}
                          </p>
                          <p className="text-xs text-white/55 mt-0.5">
                            {item.quantity} шт × {item.price} ₴
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-white whitespace-nowrap">
                          {Number(item.price) * Number(item.quantity)} ₴
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/85">Разом</span>
                    <span className="text-lg sm:text-xl font-bold text-green-300">
                      {order.totalAmount} ₴
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next steps */}
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-white/90 flex items-center gap-2">
              <Clock className="w-5 h-5 text-white/70" />
              Що далі?
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 ring-1 ring-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold text-green-200">1</span>
                </div>
                <p className="text-sm text-white/70">
                  Ми зв'яжемося з вами для підтвердження замовлення
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 ring-1 ring-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold text-white/80">2</span>
                </div>
                <p className="text-sm text-white/70">
                  Підготуємо та відправимо замовлення протягом 1–2 днів
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 ring-1 ring-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold text-white/80">3</span>
                </div>
                <p className="text-sm text-white/70">
                  Ви отримаєте SMS з номером ТТН для відстеження
                </p>
              </div>
            </div>
          </div>

          {/* Contact (footer-like soft block) */}
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-4 mb-4 sm:mb-6">
            <p className="text-center text-xs sm:text-sm text-white/70">
              Питання? Телефонуйте:{' '}
              <a
                href="tel:+380501234567"
                className="font-semibold text-green-300 hover:text-green-200"
              >
                +38 (050) 123-45-67
              </a>
            </p>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/catalog')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(34,197,94,0.18)] ring-1 ring-green-400/20 transition hover:bg-green-600/90 active:scale-[0.98]"
              data-testid="continue-shopping-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              Каталог
              <ChevronRight className="w-4 h-4 opacity-90" />
            </button>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/6 px-4 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/10 transition hover:bg-white/10 active:scale-[0.98]"
              data-testid="go-home-btn"
            >
              <Home className="w-5 h-5" />
              На головну
            </button>
          </div>
        </div>
      </div>

      {/* Sticky mobile actions (footer style) */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-50">
        <div className="bg-[#070b09]/85 backdrop-blur-md border-t border-white/10 px-3 py-3">
          <div className="max-w-lg mx-auto grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/catalog')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(34,197,94,0.18)] ring-1 ring-green-400/20 active:scale-[0.98]"
              data-testid="continue-shopping-btn-mobile"
            >
              <ShoppingBag className="w-5 h-5" />
              Каталог
            </button>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/6 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/10 active:scale-[0.98]"
              data-testid="go-home-btn-mobile"
            >
              <Home className="w-5 h-5" />
              Головна
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;



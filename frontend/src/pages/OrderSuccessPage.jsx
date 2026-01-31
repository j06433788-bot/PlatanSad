import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, ShoppingBag, ReceiptText, X } from 'lucide-react';

const DURATION_SEC = 3;

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [mounted, setMounted] = useState(false);

  // countdown
  const [count, setCount] = useState(DURATION_SEC);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const tickRef = useRef(null);

  const safeOrderId = useMemo(() => (orderId ? String(orderId) : ''), [orderId]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!autoEnabled) return;

    if (count <= 0) {
      navigate('/', { replace: true });
      return;
    }

    tickRef.current = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => tickRef.current && clearTimeout(tickRef.current);
  }, [autoEnabled, count, navigate]);

  const cancelAuto = () => {
    setAutoEnabled(false);
    if (tickRef.current) clearTimeout(tickRef.current);
  };

  const goHome = () => {
    cancelAuto();
    navigate('/');
  };

  const goCatalog = () => {
    cancelAuto();
    navigate('/catalog');
  };

  return (
    <div className="bg-gray-50">
      <style>{`
        @keyframes os-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .os-card { animation: os-in .4s ease-out both; }
      `}</style>

      {/* 
        Mobile-first layout:
        - min height uses "dvh" so it works with mobile browser bars
        - safe paddings so content doesn't stick to edges
      */}
      <div className="min-h-[calc(100dvh-0px)] flex items-center justify-center px-3 py-4 sm:px-6 sm:py-10">
        <div
          className={`w-full max-w-[560px] bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden ${
            mounted ? 'os-card' : 'opacity-0'
          }`}
        >
          {/* TOP */}
          <div className="p-4 sm:p-7">
            <h1 className="text-[20px] sm:text-2xl font-extrabold text-gray-900 leading-snug">
              Ваше замовлення оформлено ✅
            </h1>

            <p className="mt-2 text-[13px] sm:text-base text-gray-600 leading-relaxed">
              Дякуємо! Ми зв’яжемось з вами найближчим часом для підтвердження.
            </p>

            {!!safeOrderId && (
              <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-2xl bg-gray-50 border border-gray-200 px-3 py-2">
                <ReceiptText className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-[11px] sm:text-sm text-gray-600 shrink-0">Номер:</span>
                <span className="text-[11px] sm:text-sm font-bold text-gray-900 break-all">
                  {safeOrderId}
                </span>
              </div>
            )}

            {/* Countdown row */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-[12px] sm:text-sm text-gray-600 leading-snug">
                {autoEnabled ? (
                  <>
                    Перехід на головну через{' '}
                    <span className="font-extrabold text-gray-900">{Math.max(0, count)}</span> сек.
                  </>
                ) : (
                  <span className="font-medium text-gray-700">Автоперехід вимкнено</span>
                )}
              </div>

              <button
                type="button"
                onClick={cancelAuto}
                disabled={!autoEnabled}
                className={`shrink-0 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-bold transition
                  ${autoEnabled ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                `}
              >
                <X className="w-4 h-4" />
                Скасувати
              </button>
            </div>
          </div>

          {/* BOTTOM (Buttons fixed inside card, always visible) */}
          <div className="border-t border-gray-100 p-3 sm:p-6">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
              <button
                onClick={goHome}
                className="w-full rounded-2xl bg-emerald-600 text-white py-3.5 sm:py-3.5 font-extrabold
                           text-[14px] sm:text-base hover:bg-emerald-700 active:scale-[0.99] transition
                           focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Home className="w-5 h-5" />
                  На головну
                </span>
              </button>

              <button
                onClick={goCatalog}
                className="w-full rounded-2xl bg-white border border-gray-200 text-gray-900 py-3.5 sm:py-3.5 font-extrabold
                           text-[14px] sm:text-base hover:bg-gray-50 active:scale-[0.99] transition
                           focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  В каталог
                </span>
              </button>
            </div>

            <div className="mt-3 text-center text-[11px] sm:text-xs text-gray-500 leading-snug">
              Якщо закрили сторінку — номер замовлення є в URL.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;


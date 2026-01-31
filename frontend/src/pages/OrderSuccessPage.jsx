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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!autoEnabled) return;

    if (count <= 0) {
      navigate('/', { replace: true });
      return;
    }

    tickRef.current = setTimeout(() => {
      setCount((c) => c - 1);
    }, 1000);

    return () => {
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [autoEnabled, count, navigate]);

  const cancelAuto = () => {
    setAutoEnabled(false);
    if (tickRef.current) clearTimeout(tickRef.current);
  };

  const goCatalog = () => {
    cancelAuto();
    navigate('/catalog');
  };

  const goHome = () => {
    cancelAuto();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 py-6 sm:p-10 overflow-hidden">
      <style>{`
        @keyframes os-in {
          from { opacity: 0; transform: translateY(10px) scale(.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes os-bounce {
          0% { transform: translateY(10px); }
          60% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
        .os-card { animation: os-in .45s ease-out both, os-bounce .55s .05s ease-out both; }
      `}</style>

      <div
        className={`w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-sm ${
          mounted ? 'os-card' : 'opacity-0'
        }`}
      >
        {/* header */}
        <div className="p-5 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            Ваше замовлення оформлено ✅
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Дякуємо! Ми зв’яжемось з вами найближчим часом для підтвердження.
          </p>

          {!!safeOrderId && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-gray-50 border border-gray-200 px-3 py-2">
              <ReceiptText className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">Номер:</span>
              <span className="text-xs font-bold text-gray-900 break-all">{safeOrderId}</span>
            </div>
          )}

          {/* countdown */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600">
              {autoEnabled ? (
                <>
                  Перехід на головну через{' '}
                  <span className="font-bold text-gray-900">{Math.max(0, count)}</span> сек.
                </>
              ) : (
                <span className="font-medium text-gray-700">Автоперехід вимкнено</span>
              )}
            </div>

            <button
              type="button"
              onClick={cancelAuto}
              disabled={!autoEnabled}
              className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold transition
                ${autoEnabled ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
              `}
            >
              <X className="w-4 h-4" />
              Скасувати
            </button>
          </div>
        </div>

        {/* footer buttons — always visible */}
        <div className="border-t border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={goHome}
              className="w-full rounded-2xl bg-emerald-600 text-white py-3.5 font-bold text-sm sm:text-base
                         hover:bg-emerald-700 active:scale-[0.99] transition
                         focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                На головну
              </span>
            </button>

            <button
              onClick={goCatalog}
              className="w-full rounded-2xl bg-white border border-gray-200 text-gray-900 py-3.5 font-bold text-sm sm:text-base
                         hover:bg-gray-50 active:scale-[0.99] transition
                         focus:outline-none focus:ring-4 focus:ring-gray-200"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                В каталог
              </span>
            </button>
          </div>

          <div className="mt-3 text-center text-[11px] text-gray-500">
            Якщо закрили сторінку — номер замовлення є в URL.
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

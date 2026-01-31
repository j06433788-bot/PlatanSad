import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, ShoppingBag, ReceiptText, X } from 'lucide-react';

const DURATION_SEC = 3;

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [mounted, setMounted] = useState(false);

  // countdown + progress
  const [count, setCount] = useState(DURATION_SEC);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [progress, setProgress] = useState(0); // 0..100

  // confetti one-shot
  const [confetti, setConfetti] = useState([]);

  const tickRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const safeOrderId = useMemo(() => (orderId ? String(orderId) : ''), [orderId]);

  useEffect(() => {
    setMounted(true);

    // confetti one time (lightweight)
    const pieces = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // vw
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.45,
      dur: 1.8 + Math.random() * 1.2,
      rot: Math.floor(Math.random() * 360),
      drift: (Math.random() - 0.5) * 140,
      opacity: 0.85 + Math.random() * 0.15,
      hue: Math.floor(95 + Math.random() * 110), // green/yellow-ish
    }));

    setConfetti(pieces);
    const t = setTimeout(() => setConfetti([]), 2800);
    return () => clearTimeout(t);
  }, []);

  // progress animation (RAF) + countdown (1s ticks)
  useEffect(() => {
    if (!autoEnabled) return;

    // progress
    startRef.current = performance.now();
    const animate = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min(100, (elapsed / (DURATION_SEC * 1000)) * 100);
      setProgress(pct);

      if (pct < 100 && autoEnabled) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    // countdown
    tickRef.current = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [autoEnabled]);

  // auto navigate when countdown finishes
  useEffect(() => {
    if (!autoEnabled) return;
    if (count <= 0) {
      navigate('/', { replace: true });
    }
  }, [count, autoEnabled, navigate]);

  const cancelAuto = () => {
    setAutoEnabled(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
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
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <style>{`
        @keyframes os-bounceIn {
          0% { opacity: 0; transform: translateY(28px) scale(.92); }
          55% { opacity: 1; transform: translateY(-8px) scale(1.02); }
          75% { transform: translateY(4px) scale(.995); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes os-ring {
          0% { transform: scale(.88); opacity: .38; }
          50% { transform: scale(1.06); opacity: .18; }
          100% { transform: scale(.88); opacity: .38; }
        }
        @keyframes os-draw {
          from { stroke-dashoffset: 80; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes os-popNum {
          0% { transform: scale(.8); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes os-confetti {
          0% { transform: translate3d(var(--x), -14vh, 0) rotate(var(--r)); opacity: 0; }
          10% { opacity: var(--o); }
          100% { transform: translate3d(calc(var(--x) + var(--dx)), 110vh, 0) rotate(calc(var(--r) + 360deg)); opacity: 0; }
        }

        .os-card { animation: os-bounceIn .75s cubic-bezier(.22,1,.36,1) both; }
        .os-ring { animation: os-ring 1.6s ease-in-out infinite; }
        .os-draw path { stroke-dasharray: 80; stroke-dashoffset: 80; animation: os-draw .75s .1s ease-out forwards; }
        .os-num { animation: os-popNum .35s ease-out both; }
        .os-confetti { animation: os-confetti var(--dur) var(--delay) linear forwards; }
      `}</style>

      {/* Background blobs (adaptive-safe) */}
      <div className="pointer-events-none fixed -top-24 -left-24 w-64 h-64 sm:w-72 sm:h-72 bg-emerald-200/30 blur-3xl rounded-full" />
      <div className="pointer-events-none fixed -bottom-24 -right-24 w-72 h-72 sm:w-80 sm:h-80 bg-green-200/30 blur-3xl rounded-full" />

      {/* Confetti one-shot */}
      {confetti.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-0">
          {confetti.map((p) => (
            <span
              key={p.id}
              className="os-confetti absolute top-0 rounded-sm"
              style={{
                left: `${p.left}vw`,
                width: `${p.size}px`,
                height: `${Math.max(6, p.size * 0.55)}px`,
                background: `hsl(${p.hue} 85% 55%)`,
                opacity: p.opacity,
                ['--delay']: `${p.delay}s`,
                ['--dur']: `${p.dur}s`,
                ['--r']: `${p.rot}deg`,
                ['--x']: `0vw`,
                ['--dx']: `${p.drift}px`,
                ['--o']: `${p.opacity}`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <div
          className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-10 ${
            mounted ? 'os-card' : 'opacity-0'
          }`}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Animated icon */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-emerald-100 os-ring" />
              <div className="absolute inset-0 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-9 sm:h-9 os-draw"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgb(5 150 105)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                Ваше замовлення оформлено ✅
              </h1>

              <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
                Дякуємо! Ми зв’яжемось з вами найближчим часом для підтвердження.
              </p>

              {!!safeOrderId && (
                <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-2xl bg-gray-50 border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3">
                  <ReceiptText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Номер:</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 break-all">
                    {safeOrderId}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-7 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Countdown + cancel (adaptive) */}
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <span key={`${count}-${autoEnabled}`} className="os-num text-lg font-extrabold text-emerald-700">
                  {autoEnabled ? Math.max(0, count) : '—'}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {autoEnabled ? (
                  <>
                    Авто-перехід на головну через{' '}
                    <span className="font-bold text-gray-900">{Math.max(0, count)}</span> сек.
                  </>
                ) : (
                  <span className="font-medium text-gray-700">Автоперехід вимкнено</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={cancelAuto}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition
                ${autoEnabled ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
              `}
              disabled={!autoEnabled}
            >
              <X className="w-4 h-4" />
              Скасувати
            </button>
          </div>

          {/* Buttons (adaptive) */}
          <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={goCatalog}
              className="w-full rounded-2xl bg-emerald-600 text-white py-3.5 sm:py-3.5 font-bold text-sm sm:text-base
                         hover:bg-emerald-700 active:scale-[0.99] transition
                         focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Перейти в каталог
              </span>
            </button>

            <button
              onClick={goHome}
              className="w-full rounded-2xl bg-white border border-gray-200 text-gray-900 py-3.5 sm:py-3.5 font-bold text-sm sm:text-base
                         hover:bg-gray-50 active:scale-[0.99] transition
                         focus:outline-none focus:ring-4 focus:ring-gray-200"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                На головну зараз
              </span>
            </button>
          </div>

          {/* Progress bar (3s) */}
          <div className="mt-3 sm:mt-4">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div
                className="h-full bg-emerald-500 rounded-full transition-[width] duration-150"
                style={{ width: autoEnabled ? `${progress}%` : '0%' }}
              />
            </div>
            <div className="mt-2 text-center text-[11px] sm:text-xs text-gray-500">
              {autoEnabled
                ? 'Панель показує час до автоматичного переходу'
                : 'Прогрес зупинено — автоперехід скасовано'}
            </div>
          </div>

          <div className="mt-4 text-center text-[11px] sm:text-xs text-gray-500">
            Порада: номер замовлення є в URL — можна зберегти посилання.
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

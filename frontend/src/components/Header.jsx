import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  X,
  Menu,
  Info,
  Truck,
  RefreshCw,
  MapPin,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { categoriesApi } from '../api/categoriesApi';

const cx = (...c) => c.filter(Boolean).join(' ');

/* =================== CATEGORY ICONS (SVG, lucide-style) =================== */
const IconBonsai = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 20h12" />
    <path d="M9 20c2-2 2-5 2-8" />
    <path d="M13 20c-2-2-2-5-2-8" />
    <path d="M7 10c2.5 0 4-1.5 5-3.5C13 8.5 14.5 10 17 10" />
    <path d="M12 6c.5-2 2-3 4-3" />
  </svg>
);

const IconThuja = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3l4 6-4 2-4-2 4-6z" />
    <path d="M8 9l4 2 4-2" />
    <path d="M9 11l3 2 3-2" />
    <path d="M10 13l2 2 2-2" />
    <path d="M12 15v6" />
    <path d="M7 21h10" />
  </svg>
);

const IconGlobeThuja = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="11" r="6" />
    <path d="M12 17v5" />
    <path d="M8 22h8" />
    <path d="M8.8 9.5c2.2 1.2 4.2 1.2 6.4 0" />
    <path d="M9.2 12.8c1.8 1 3.8 1 5.6 0" />
  </svg>
);

const IconBoxwood = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 21s7-4 7-10a7 7 0 0 0-14 0c0 6 7 10 7 10z" />
    <path d="M9.5 12c1.2-1.2 3.8-1.2 5 0" />
    <path d="M8.7 9.2c1.6-1.5 5-1.5 6.6 0" />
  </svg>
);

const IconConifers = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2l3 5-3 2-3-2 3-5z" />
    <path d="M7 9l5 3 5-3" />
    <path d="M6 14l6 4 6-4" />
    <path d="M12 18v4" />
    <path d="M8 22h8" />
  </svg>
);

const IconDeciduous = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2c4 3 7 6 7 10a7 7 0 0 1-14 0c0-4 3-7 7-10z" />
    <path d="M12 14v8" />
    <path d="M9 22h6" />
    <path d="M10 11c.8.8 3.2.8 4 0" />
  </svg>
);

const IconCatalpa = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3c3 2 6 5 6 9a6 6 0 0 1-12 0c0-4 3-7 6-9z" />
    <path d="M12 13c-2.2 0-4.2-1.2-5.6-3" />
    <path d="M12 13c2.2 0 4.2-1.2 5.6-3" />
    <path d="M12 13v8" />
    <path d="M9 21h6" />
  </svg>
);

const IconSpruce = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2l4 6-4 2-4-2 4-6z" />
    <path d="M8 10l4 2 4-2" />
    <path d="M7 14l5 3 5-3" />
    <path d="M12 17v5" />
    <path d="M9 22h6" />
  </svg>
);

const IconIndoor = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 21h10" />
    <path d="M9 21c4-2 1-6 3-10" />
    <path d="M10 12c-1.8.3-3.3 0-4.6-.7-1.2-.6-2.2-1.6-2.9-3.5 2.9-.7 4.7-.2 6 .8" />
    <path d="M13 9c0-3 1.5-4.8 4.8-5 0 2.4-.6 3.8-1.7 4.6-1 .8-2.5 1.3-4.1 1.4z" />
    <path d="M18 22v-6a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v6" />
  </svg>
);

const getCategoryIcon = (nameRaw = '') => {
  const n = String(nameRaw).toLowerCase().replace(/\s+/g, ' ').trim();

  if (n.includes('бонсай') || n.includes('нівакі')) return IconBonsai;
  if (n.includes('глобоса')) return IconGlobeThuja;
  if (n.includes('туя') || n.includes('колумна') || n.includes('смарагд')) return IconThuja;
  if (n.includes('самшит')) return IconBoxwood;
  if (n.includes('ялина')) return IconSpruce;
  if (n.includes('хвой')) return IconConifers;
  if (n.includes('листопад')) return IconDeciduous;
  if (n.includes('катальпа')) return IconCatalpa;
  if (n.includes('кімнат')) return IconIndoor;

  return IconConifers;
};

/* =================== NEW CLOCK SVG (modern, minimal) =================== */
const ClockBadgeIcon = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="clkRing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#22c55e" />
        <stop offset="1" stopColor="#16a34a" />
      </linearGradient>
      <radialGradient id="clkFace" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.98" />
        <stop offset="1" stopColor="#f3f4f6" stopOpacity="0.98" />
      </radialGradient>
      <filter id="clkSoft" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.08" />
      </filter>
    </defs>

    <circle cx="12" cy="12" r="9.2" fill="none" stroke="url(#clkRing)" strokeWidth="2.2" filter="url(#clkSoft)" />
    <circle cx="12" cy="12" r="7.9" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
    <circle cx="12" cy="12" r="7.25" fill="url(#clkFace)" />

    <g strokeLinecap="round" stroke="#16a34a" opacity="0.55">
      <path d="M12 6.25v1.05" strokeWidth="1.2" />
      <path d="M12 16.7v1.05" strokeWidth="1.2" />
      <path d="M6.25 12h1.05" strokeWidth="1.2" />
      <path d="M16.7 12h1.05" strokeWidth="1.2" />
    </g>

    <path d="M12 8.2v4.1" fill="none" stroke="#14532d" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M12 12l3 1.7" fill="none" stroke="#16a34a" strokeWidth="1.9" strokeLinecap="round" />

    <circle cx="12" cy="12" r="1.2" fill="#16a34a" />
    <circle cx="12" cy="12" r="0.55" fill="#14532d" />
  </svg>
);

/* =================== Kyiv time helpers =================== */
function getKyivHoursMinutes() {
  const t = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Kiev',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
  const [hh, mm] = t.split(':').map((v) => Number(v));
  return { hh: hh || 0, mm: mm || 0 };
}
function isOpenNowKyiv({ hh, mm }) {
  const minutes = hh * 60 + mm;
  return minutes >= 8 * 60 && minutes < 17 * 60; // 08:00–17:00
}

function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = () => setMatches(!!mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);
  return matches;
}

function useDialogA11y({ open, onClose, containerRef, returnFocusRef }) {
  useEffect(() => {
    if (!open) return;

    const getFocusable = () =>
      containerRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      ) || [];

    const focusFirst = () => {
      const items = getFocusable();
      if (items.length) items[0].focus();
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        setTimeout(() => returnFocusRef?.current?.focus?.(), 0);
        return;
      }
      if (e.key === 'Tab') {
        const items = Array.from(getFocusable());
        if (!items.length) return;

        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const t = setTimeout(focusFirst, 0);

    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, containerRef, returnFocusRef]);
}

/** BottomSheet: drag down to close (mobile) */
function BottomSheet({ open, onClose, label = 'Bottom sheet', containerRef, children, reducedMotion }) {
  const sheetRef = useRef(null);
  const [dragY, setDragY] = useState(0);
  const dragging = useRef(false);
  const startY = useRef(0);

  useEffect(() => {
    if (!open) {
      setDragY(0);
      dragging.current = false;
    }
  }, [open]);

  const onPointerDown = (e) => {
    dragging.current = true;
    startY.current = e.clientY;
    sheetRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const delta = e.clientY - startY.current;
    if (delta <= 0) {
      setDragY(0);
      return;
    }
    setDragY(Math.min(delta, 260));
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragY > 120) onClose();
    else setDragY(0);
  };

  const transition = reducedMotion ? 'none' : 'transform 220ms ease-out';
  const transform = open ? `translateY(${dragY}px)` : 'translateY(110%)';

  return (
    <div
      className={cx(
        'fixed inset-0 z-[100] lg:hidden transition-all',
        open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={cx('absolute inset-0 bg-black/30', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
        aria-label="Закрити"
        tabIndex={open ? 0 : -1}
      />

      <aside
        ref={(node) => {
          sheetRef.current = node;
          if (containerRef) containerRef.current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="absolute left-0 right-0 bottom-0 bg-white shadow-2xl rounded-t-3xl border-t border-black/5"
        style={{
          transform,
          transition,
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          touchAction: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="pt-3 pb-2 flex justify-center">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="max-h-[85vh] overflow-y-auto px-4 pb-4">{children}</div>
      </aside>
    </div>
  );
}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const anyOverlayOpen = isSearchOpen || isMenuOpen;
  useLockBodyScroll(anyOverlayOpen);

  const menuBtnRef = useRef(null);
  const searchBtnRef = useRef(null);

  const menuPanelRef = useRef(null);
  const searchPanelRef = useRef(null);

  // Ripple state
  const [ripples, setRipples] = useState([]);

  // ✅ Live open/closed by Kyiv time
  const [kyivTime, setKyivTime] = useState(() => getKyivHoursMinutes());
  useEffect(() => {
    const tick = () => setKyivTime(getKyivHoursMinutes());
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  const openNow = useMemo(() => isOpenNowKyiv(kyivTime), [kyivTime]);
  const statusText = openNow ? 'Зараз відкрито' : 'Зараз зачинено';

  const addRipple = useCallback(
    (e, targetKey) => {
      if (reducedMotion) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.25;

      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setRipples((prev) => [...prev, { id, x, y, size, targetKey }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 520);
    },
    [reducedMotion]
  );

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await categoriesApi.getCategories();
        if (!alive) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useDialogA11y({ open: isMenuOpen, onClose: closeMenu, containerRef: menuPanelRef, returnFocusRef: menuBtnRef });
  useDialogA11y({ open: isSearchOpen, onClose: closeSearch, containerRef: searchPanelRef, returnFocusRef: searchBtnRef });

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const q = searchQuery.trim();

      if (!q) {
        navigate('/catalog');
        setIsSearchOpen(false);
        return;
      }

      navigate(`/catalog?search=${encodeURIComponent(q)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    },
    [navigate, searchQuery]
  );

  const popularTerms = useMemo(() => ['Туя', 'Бонсай', 'Нівакі', 'Самшит'], []);
  const overlayTransition = reducedMotion ? 'duration-0' : 'duration-300';

  const localKeyframes = `
    @keyframes ripple {
      0% { transform: scale(0); opacity: 0.35; }
      100% { transform: scale(1); opacity: 0; }
    }
    @keyframes breath {
      0%, 100% { transform: translateZ(0) scale(1); }
      50% { transform: translateZ(0) scale(1.03); }
    }
  `;

  return (
    <>
      <style>{localKeyframes}</style>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-xl focus:shadow"
      >
        Перейти до контенту
      </a>

      <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2.5 sm:py-4 md:py-5 lg:py-6">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 w-full">
              {/* LEFT */}
              <div className="flex items-center justify-start gap-1 sm:gap-2">
                <button
                  ref={menuBtnRef}
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2.5 sm:p-3.5 md:p-4 text-gray-600 hover:text-green-500 transition-colors hover:bg-gray-100 rounded-full md:hidden active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200"
                  data-testid="menu-toggle"
                  aria-label="Відкрити меню"
                  aria-haspopup="dialog"
                  aria-expanded={isMenuOpen}
                >
                  <Menu className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                </button>

                <button
                  ref={searchBtnRef}
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 sm:p-3.5 md:p-4 text-gray-600 hover:text-green-500 transition-colors hover:bg-gray-100 rounded-full active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200"
                  data-testid="search-toggle"
                  aria-label="Пошук"
                  aria-haspopup="dialog"
                  aria-expanded={isSearchOpen}
                >
                  <Search className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                </button>
              </div>

              {/* CENTER */}
              <div className="flex items-center justify-center min-w-0">
                <button
                  type="button"
                  className="flex items-center gap-0 cursor-pointer active:scale-95 transition-transform min-w-0 justify-center focus:outline-none"
                  onClick={() => navigate('/')}
                  aria-label="На головну"
                >
                  <img
                    src="/logo.webp"
                    alt="PlatanSad Logo"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain mix-blend-multiply flex-shrink-0"
                    loading="eager"
                    decoding="async"
                    style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
                  />

                  <span className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-800 whitespace-nowrap leading-none text-center -ml-1">
                    Platan<span className="text-green-500">Sad</span>
                  </span>
                </button>
              </div>

              {/* RIGHT */}
              <div className="flex items-center justify-end gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (wishlistCount > 0) navigate('/wishlist');
                  }}
                  disabled={wishlistCount === 0}
                  aria-disabled={wishlistCount === 0}
                  tabIndex={wishlistCount === 0 ? -1 : 0}
                  className={cx(
                    'p-2.5 sm:p-3.5 md:p-4 transition-all duration-300 rounded-full relative focus:outline-none focus:ring-2 focus:ring-green-200',
                    wishlistCount > 0
                      ? 'text-red-500 hover:text-red-600 hover:bg-red-50 active:scale-95'
                      : 'text-gray-400 cursor-not-allowed opacity-70'
                  )}
                  data-testid="wishlist-icon"
                  aria-label="Список бажань"
                  title={wishlistCount === 0 ? 'Список бажань порожній' : 'Список бажань'}
                >
                  <Heart
                    className={cx(
                      'w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10',
                      wishlistCount > 0 ? 'fill-red-500' : 'fill-none'
                    )}
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] sm:text-sm min-w-[20px] sm:min-w-[26px] h-[20px] sm:h-[26px] px-1 rounded-full flex items-center justify-center font-bold animate-pulse shadow-md">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="p-2.5 sm:p-3.5 md:p-4 text-gray-600 hover:text-green-500 transition-colors hover:bg-gray-100 rounded-full relative active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200"
                  data-testid="cart-icon"
                  aria-label="Кошик"
                >
                  <div className="relative">
                    <ShoppingBag className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                    {cartCount > 0 && (
                      <span
                        className="absolute -top-2 -right-2 bg-green-500 text-white text-[11px] sm:text-sm min-w-[20px] sm:min-w-[26px] h-[20px] sm:h-[26px] px-1 rounded-full flex items-center justify-center font-bold shadow-md"
                        data-testid="cart-count"
                      >
                        {cartCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP NAV (Блог прибрано) */}
        <nav className="bg-[#2d2d39] text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-2 md:py-3">
              <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
                <button onClick={() => navigate('/about')} className="hover:text-green-400 transition-colors whitespace-nowrap">
                  Про нас
                </button>
                <button onClick={() => navigate('/delivery')} className="hover:text-green-400 transition-colors whitespace-nowrap">
                  Оплата і доставка
                </button>
                <button onClick={() => navigate('/return')} className="hover:text-green-400 transition-colors whitespace-nowrap">
                  Обмін та повернення
                </button>
                <button onClick={() => navigate('/contacts')} className="hover:text-green-400 transition-colors whitespace-nowrap">
                  Контакти
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* MENU DRAWER */}
      <div
        className={cx(
          'fixed inset-0 z-[100] transition-all',
          overlayTransition,
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className={cx(
            'absolute inset-0 bg-black/50 transition-opacity',
            overlayTransition,
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={closeMenu}
          aria-label="Закрити меню"
          tabIndex={isMenuOpen ? 0 : -1}
        />

        <aside
          ref={menuPanelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
          className={cx(
            'absolute top-0 left-0 h-full w-[92vw] max-w-[400px] bg-white shadow-2xl flex flex-col',
            reducedMotion ? '' : 'transition-transform duration-300 ease-out',
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="bg-green-500 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <img src="/logo.webp" alt="PlatanSad" className="w-9 h-9 bg-white rounded-full p-0.5" />
              <span className="font-bold text-lg">PlatanSad</span>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              className="p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Закрити"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            <div className="px-4 py-3 bg-green-50 border-b border-green-100">
              <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide">Категорії рослин</h3>
            </div>

            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <div key={category.id} className="border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/catalog?category=${encodeURIComponent(category.name)}`);
                      closeMenu();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors group"
                    data-testid={`category-${category.id}`}
                  >
                    <div className="text-green-500 group-hover:text-green-600 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <span className="font-medium text-sm truncate block">{category.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {category.count > 0 && (
                        <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                          {category.count}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-all" />
                    </div>
                  </button>
                </div>
              );
            })}

            <div className="border-t-4 border-gray-200 my-3" />

            <button
              type="button"
              onClick={() => {
                navigate('/about');
                closeMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <Info className="w-5 h-5" />
              <span className="font-medium text-sm">Про нас</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/delivery');
                closeMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <Truck className="w-5 h-5" />
              <span className="font-medium text-sm">Оплата і доставка</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/return');
                closeMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium text-sm">Обмін та повернення</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/contacts');
                closeMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium text-sm">Контакти</span>
            </button>

            <div className="border-t border-gray-200 my-2" />

            {/* ✅ Contacts: phone icon next to number, only Viber tag on the first */}
            <div className="px-4 py-2">
              <div className="grid grid-cols-1 gap-2">
                <a
                  href="tel:+380636507449"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-800 truncate">+380 (63) 650-74-49</div>
                      <div className="text-xs text-gray-500">Анастасія</div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full flex-shrink-0">
                    Viber
                  </span>
                </a>

                <a
                  href="tel:+380952510347"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-green-50 hover:border-green-200 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-800 truncate">+380 (95) 251-03-47</div>
                      <div className="text-xs text-gray-500">Ігор</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* ✅ WORK TIME + LIVE STATUS + WEEKENDS LINE */}
            <div className="px-4 py-3">
              <div className="rounded-2xl border border-green-100 bg-green-50 p-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-green-100 shadow-sm flex items-center justify-center flex-shrink-0">
                    <ClockBadgeIcon className="w-6 h-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-gray-800 leading-tight">Графік роботи</p>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={cx(
                            'relative inline-flex h-2.5 w-2.5 rounded-full',
                            openNow ? 'bg-green-500' : 'bg-gray-400'
                          )}
                          aria-hidden="true"
                        >
                          {!reducedMotion && (
                            <span
                              className={cx(
                                'absolute inset-0 rounded-full opacity-75',
                                openNow ? 'animate-ping bg-green-500' : 'animate-ping bg-gray-400'
                              )}
                            />
                          )}
                        </span>
                        <span className={cx('text-xs font-semibold', openNow ? 'text-green-700' : 'text-gray-600')}>
                          {statusText}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mt-1">
                      Пн–Пт: <span className="font-semibold text-gray-900">08:00–17:00</span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Сб–Нд: <span className="font-semibold text-gray-900">Вихідні</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL */}
          <div
            className="flex-shrink-0 border-t border-gray-200 bg-white p-4"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            <div className="grid grid-cols-3 gap-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/platansad.uaa?igsh=cmhhbG4zbjNkMTBr"
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => addRipple(e, 'ig')}
                onClick={(e) => addRipple(e, 'ig')}
                className={cx(
                  'group relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700',
                  'hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all',
                  'active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-200',
                  reducedMotion ? '' : 'motion-safe:[animation:breath_2.8s_ease-in-out_infinite]'
                )}
                aria-label="Instagram"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute -inset-6 rounded-full bg-green-200/40 blur-2xl motion-safe:animate-pulse motion-reduce:animate-none" />
                </span>

                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500/80">
                  <span className="absolute inset-0 rounded-full bg-green-500 motion-safe:animate-ping motion-reduce:animate-none" />
                </span>

                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  {ripples
                    .filter((r) => r.targetKey === 'ig')
                    .map((r) => (
                      <span
                        key={r.id}
                        className="absolute rounded-full bg-green-500/25"
                        style={{
                          width: r.size,
                          height: r.size,
                          left: r.x - r.size / 2,
                          top: r.y - r.size / 2,
                          animation: reducedMotion ? 'none' : 'ripple 520ms ease-out',
                        }}
                      />
                    ))}
                </span>

                <img
                  src="/instagram.png"
                  alt=""
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 motion-safe:animate-pulse motion-reduce:animate-none"
                />
                <span className="hidden sm:inline">Instagram</span>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@platansad.ua?_r=1&_t=ZM-939QCCJ5tAx"
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => addRipple(e, 'tt')}
                onClick={(e) => addRipple(e, 'tt')}
                className={cx(
                  'group relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700',
                  'hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all',
                  'active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-200',
                  reducedMotion ? '' : 'motion-safe:[animation:breath_3.1s_ease-in-out_infinite]'
                )}
                aria-label="TikTok"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute -inset-6 rounded-full bg-green-200/40 blur-2xl motion-safe:animate-pulse motion-reduce:animate-none" />
                </span>

                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500/80">
                  <span className="absolute inset-0 rounded-full bg-green-500 motion-safe:animate-ping motion-reduce:animate-none" />
                </span>

                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  {ripples
                    .filter((r) => r.targetKey === 'tt')
                    .map((r) => (
                      <span
                        key={r.id}
                        className="absolute rounded-full bg-green-500/25"
                        style={{
                          width: r.size,
                          height: r.size,
                          left: r.x - r.size / 2,
                          top: r.y - r.size / 2,
                          animation: reducedMotion ? 'none' : 'ripple 520ms ease-out',
                        }}
                      />
                    ))}
                </span>

                <img
                  src="/tiktok.png"
                  alt=""
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 motion-safe:animate-pulse motion-reduce:animate-none"
                />
                <span className="hidden sm:inline">TikTok</span>
              </a>

              {/* Viber */}
              <a
                href="viber://chat?number=+380636507449"
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => addRipple(e, 'vb')}
                onClick={(e) => addRipple(e, 'vb')}
                className={cx(
                  'group relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700',
                  'hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all',
                  'active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-200',
                  reducedMotion ? '' : 'motion-safe:[animation:breath_2.9s_ease-in-out_infinite]'
                )}
                aria-label="Viber"
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute -inset-6 rounded-full bg-green-200/40 blur-2xl motion-safe:animate-pulse motion-reduce:animate-none" />
                </span>

                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500/80">
                  <span className="absolute inset-0 rounded-full bg-green-500 motion-safe:animate-ping motion-reduce:animate-none" />
                </span>

                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  {ripples
                    .filter((r) => r.targetKey === 'vb')
                    .map((r) => (
                      <span
                        key={r.id}
                        className="absolute rounded-full bg-green-500/25"
                        style={{
                          width: r.size,
                          height: r.size,
                          left: r.x - r.size / 2,
                          top: r.y - r.size / 2,
                          animation: reducedMotion ? 'none' : 'ripple 520ms ease-out',
                        }}
                      />
                    ))}
                </span>

                <span className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 motion-safe:animate-pulse motion-reduce:animate-none">
                  <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
                    <defs>
                      <linearGradient id="viberGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#8A3FFC" />
                        <stop offset="1" stopColor="#6D28D9" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M24 6c9.94 0 18 7.16 18 16 0 8.84-8.06 16-18 16-1.62 0-3.19-.19-4.68-.55L10 41l1.9-7.12C8.84 31.4 6 27.97 6 22c0-8.84 8.06-16 18-16z"
                      fill="url(#viberGrad)"
                    />
                    <path
                      d="M19.3 16.6c.6-.7 1.8-.6 2.3.2l1.3 2c.5.8.4 1.8-.2 2.4l-.9.9c-.2.2-.3.6-.1.9 1 1.8 2.5 3.3 4.3 4.3.3.2.7.1.9-.1l.9-.9c.6-.6 1.6-.7 2.4-.2l2 1.3c.8.5.9 1.7.2 2.3-.9.9-2 1.4-3.2 1.3-6.4-.4-12-6-12.4-12.4-.1-1.2.4-2.3 1.3-3.2z"
                      fill="#fff"
                    />
                    <path
                      d="M28.3 14.6c2 .6 3.5 2.1 4.1 4.1"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      opacity=".9"
                    />
                    <path
                      d="M26.8 12.2c3.2.7 5.7 3.2 6.4 6.4"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      opacity=".7"
                    />
                  </svg>
                </span>

                <span className="hidden sm:inline">Viber</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* SEARCH */}
      {isMobile ? (
        <BottomSheet
          open={isSearchOpen}
          onClose={closeSearch}
          label="Пошук"
          containerRef={searchPanelRef}
          reducedMotion={reducedMotion}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-800">Пошук товарів</h2>
            <button
              type="button"
              onClick={closeSearch}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
              aria-label="Закрити"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="mt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Введіть назву товару..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                data-testid="search-input"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                data-testid="search-btn"
                aria-label="Шукати"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Популярні:</span>
              {popularTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    navigate(`/catalog?search=${encodeURIComponent(term)}`);
                    closeSearch();
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500">Порада: потягни вниз, щоб закрити 👇</div>
          </form>
        </BottomSheet>
      ) : (
        <div
          className={cx(
            'fixed inset-0 z-[100] transition-all',
            overlayTransition,
            isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          )}
          aria-hidden={!isSearchOpen}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeSearch}
            aria-label="Закрити пошук"
            tabIndex={isSearchOpen ? 0 : -1}
          />

          <div
            ref={searchPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Пошук"
            className={cx(
              'absolute top-0 left-0 right-0 bg-white shadow-2xl',
              reducedMotion ? '' : 'transition-transform duration-300',
              isSearchOpen ? 'translate-y-0' : '-translate-y-full'
            )}
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 relative">
              <button
                type="button"
                onClick={closeSearch}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Закрити"
              >
                <X className="w-6 h-6" />
              </button>

              <form onSubmit={handleSearch} className="mt-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">Пошук товарів</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Введіть назву товару..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                    data-testid="search-input"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                    data-testid="search-btn"
                    aria-label="Шукати"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <span className="text-sm text-gray-500">Популярні:</span>
                  {popularTerms.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        navigate(`/catalog?search=${encodeURIComponent(term)}`);
                        closeSearch();
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

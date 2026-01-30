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
  BookOpen,
  Clock,
  Sprout,
  ChevronRight,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { categoriesApi } from '../api/categoriesApi';

const cx = (...c) => c.filter(Boolean).join(' ');

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

  const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const anyOverlayOpen = isSearchOpen || isMenuOpen || isCartOpen;
  useLockBodyScroll(anyOverlayOpen);

  const menuBtnRef = useRef(null);
  const searchBtnRef = useRef(null);
  const cartBtnRef = useRef(null);

  const menuPanelRef = useRef(null);
  const cartPanelRef = useRef(null);
  const searchPanelRef = useRef(null);

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    setIsCartOpen(false);
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
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useDialogA11y({ open: isMenuOpen, onClose: closeMenu, containerRef: menuPanelRef, returnFocusRef: menuBtnRef });
  useDialogA11y({ open: isCartOpen, onClose: closeCart, containerRef: cartPanelRef, returnFocusRef: cartBtnRef });
  useDialogA11y({ open: isSearchOpen, onClose: closeSearch, containerRef: searchPanelRef, returnFocusRef: searchBtnRef });

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (!q) return;
      navigate(`/catalog?search=${encodeURIComponent(q)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    },
    [navigate, searchQuery]
  );

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    navigate('/checkout');
  }, [navigate]);

  const popularTerms = useMemo(() => ['Туя', 'Бонсай', 'Нівакі', 'Самшит'], []);

  const overlayTransition = reducedMotion ? 'duration-0' : 'duration-300';

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-xl focus:shadow"
      >
        Перейти до контенту
      </a>

      <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-5 md:py-6 lg:py-8">
            <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
              <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 flex-shrink-0">
                <button
                  ref={menuBtnRef}
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 sm:p-3 md:p-2 text-gray-600 hover:text-green-500 transition-colors hover:bg-gray-100 rounded-full md:hidden active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200"
                  data-testid="menu-toggle"
                  aria-label="Відкрити меню"
                  aria-haspopup="dialog"
                  aria-expanded={isMenuOpen}
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
                </button>

                <button
                  ref={searchBtnRef}
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 sm:p-3 md:p-2 text-gray-600 hover:text-green-500 transition-colors hover:bg-gray-100 rounded-full active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200"
                  data-testid="search-toggle"
                  aria-label="Пошук"
                  aria-haspopup="dialog"
                  aria-expanded={isSearchOpen}
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
                </button>
              </div>

              <button
                type="button"
                className="flex items-center gap-0.5 sm:gap-1 md:gap-2 cursor-pointer active:scale-95 transition-transform min-w-0 justify-center focus:outline-none"
                onClick={() => navigate('/')}
                aria-label="На головну"
              >
                <img
                  src="/logo.webp"
                  alt="PlatanSad Logo"
                  className="w-8 h-8 sm:w-12 sm:h-12 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain mix-blend-multiply flex-shrink-0"
                  loading="eager"
                  decoding="async"
                  style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
                />
                <span className="text-base sm:text-xl md:text-5xl lg:text-6xl font-bold text-gray-800 whitespace-nowrap">
                  Platan<span className="text-green-500">Sad</span>
                </span>
              </button>

              <div className="flex items-center gap-0.5 sm:gap-1 md:gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/wishlist')}
                  className={cx(
                    'p-2 sm:p-3 md:p-2 transition-all duration-300 rounded-full relative active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200',
                    wishlistCount > 0
                      ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                      : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                  )}
                  data-testid="wishlist-icon"
                  aria-label="Список бажань"
                >
                  <Heart className={cx('w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6', wishlistCount > 0 && 'fill-red-500')} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[10px] sm:text-xs min-w-[18px] sm:min-w-[22px] h-[18px] sm:h-[22px] px-0.5 sm:px-1 rounded-full flex items-center justify-center font-bold animate-pulse shadow-md">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  ref={cartBtnRef}
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 sm:p-3 md:p-2 text-gray-600 hover:text-green-500 transition-colors hover:bg-gray-100 rounded-full relative active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200"
                  data-testid="cart-icon"
                  aria-label="Кошик"
                  aria-haspopup="dialog"
                  aria-expanded={isCartOpen}
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6" />
                    {cartCount > 0 && (
                      <span
                        className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-green-500 text-white text-[10px] sm:text-xs min-w-[18px] sm:min-w-[22px] h-[18px] sm:h-[22px] px-0.5 sm:px-1 rounded-full flex items-center justify-center font-bold shadow-md"
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

        <nav className="bg-[#2d2d39] text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-2 md:py-3">
              <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
                <button onClick={() => navigate('/about')} className="hover:text-green-400 transition-colors whitespace-nowrap">
                  Про нас
                </button>
                <button
                  onClick={() => navigate('/delivery')}
                  className="hover:text-green-400 transition-colors whitespace-nowrap"
                >
                  Оплата і доставка
                </button>
                <button onClick={() => navigate('/return')} className="hover:text-green-400 transition-colors whitespace-nowrap">
                  Обмін та повернення
                </button>
                <button
                  onClick={() => navigate('/contacts')}
                  className="hover:text-green-400 transition-colors whitespace-nowrap"
                >
                  Контакти
                </button>
                <button onClick={() => navigate('/blog')} className="hover:text-green-400 transition-colors whitespace-nowrap">
                  Блог
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

            {categories.map((category) => (
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
                    <Sprout className="w-5 h-5" />
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
            ))}

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

            <button
              type="button"
              onClick={() => {
                navigate('/blog');
                closeMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium text-sm">Блог</span>
            </button>

            <div className="border-t border-gray-200 my-2" />

            <div className="px-4 py-2">
              <a href="tel:+380636507449" className="flex items-center gap-3 text-gray-700 py-2 hover:text-green-500">
                <img src="/viber.png" alt="Viber" className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">+380 (63) 650-74-49</span>
                  <span className="text-xs text-gray-500">Анастасія</span>
                </div>
              </a>
              <a href="tel:+380952510347" className="flex items-center gap-3 text-gray-700 py-2 hover:text-green-500">
                <img src="/vodafone.png" alt="Vodafone" className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">+380 (95) 251-03-47</span>
                  <span className="text-xs text-gray-500">Ігор</span>
                </div>
              </a>
            </div>

            <div className="px-4 py-2">
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Пн-Нд: 8:00 - 20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* UPDATED SOCIAL (same style as main) */}
          <div
            className="flex-shrink-0 border-t border-gray-200 bg-white p-4"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            <div className="grid grid-cols-3 gap-2">
              <a
                href="https://www.instagram.com/platansad.uaa?igsh=cmhhbG4zbjNkMTBr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Instagram"
              >
                <img src="/instagram.png" alt="" className="w-5 h-5" />
                <span className="hidden sm:inline">Instagram</span>
              </a>

              <a
                href="https://www.tiktok.com/@platansad.ua?_r=1&_t=ZM-939QCCJ5tAx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="TikTok"
              >
                <img src="/tiktok.png" alt="" className="w-5 h-5" />
                <span className="hidden sm:inline">TikTok</span>
              </a>

              <a
                href="viber://chat?number=+380636507449"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Viber"
              >
                <img src="/viber.png" alt="" className="w-5 h-5" />
                <span className="hidden sm:inline">Viber</span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* CART DRAWER */}
      <div
        className={cx(
          'fixed inset-0 z-[100] transition-all',
          overlayTransition,
          isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
        aria-hidden={!isCartOpen}
      >
        <button
          type="button"
          className={cx(
            'absolute inset-0 bg-black/50 transition-opacity',
            overlayTransition,
            isCartOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={closeCart}
          aria-label="Закрити кошик"
          tabIndex={isCartOpen ? 0 : -1}
        />

        <aside
          ref={cartPanelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Кошик"
          className={cx(
            'absolute top-0 right-0 h-full w-[92vw] max-w-[400px] bg-white shadow-2xl flex flex-col',
            reducedMotion ? '' : 'transition-transform duration-300 ease-out',
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="bg-green-500 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              <span className="font-bold text-lg">Кошик</span>
              {cartCount > 0 && (
                <span className="bg-white text-green-600 text-sm font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
              )}
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Закрити"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Кошик порожній</h3>
                <p className="text-sm text-gray-500 mb-4">Додайте товари до кошика</p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    navigate('/catalog');
                  }}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  Перейти до каталогу
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-white border border-gray-200 rounded-lg p-3">
                    <img
                      src={item.productImage || '/placeholder.png'}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{item.productName}</h4>
                      <p className="text-sm font-bold text-green-600 mb-2">{item.price} ₴</p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                          aria-label="Зменшити кількість"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                          aria-label="Збільшити кількість"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-600 text-sm p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                          aria-label="Видалити з кошика"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div
              className="flex-shrink-0 border-t border-gray-200 bg-white p-4 space-y-3"
              style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
            >
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Всього:</span>
                <span className="text-green-600">{cartTotal.toFixed(2)} ₴</span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  Оформити замовлення
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  Переглянути кошик
                </button>
              </div>
            </div>
          )}
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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, X, Grid3X3, LayoutGrid, Search } from 'lucide-react';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(true);

  // local draft for debounce
  const [searchDraft, setSearchDraft] = useState(searchParams.get('search') || '');

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    badge: searchParams.get('badge') || '', // optional filter
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'name',
  });

  // --- helpers: badges detection (supports different backend fields)
  const normalize = (v) => String(v ?? '').toLowerCase().trim();
  const getBadges = (p) => {
    const out = new Set();

    // common shapes:
    // p.badge: "hit" | "new" | "sale"
    // p.badges: ["hit","sale"]
    // p.isHit / p.isNew / p.isSale
    // p.labels: ["Хіт","Знижка"] etc
    const badge = normalize(p?.badge);
    if (badge) out.add(badge);

    const badgesArr = Array.isArray(p?.badges) ? p.badges : [];
    badgesArr.forEach((b) => out.add(normalize(b)));

    if (p?.isHit) out.add('hit');
    if (p?.isNew) out.add('new');
    if (p?.isSale) out.add('sale');

    const labelsArr = Array.isArray(p?.labels) ? p.labels : [];
    labelsArr.forEach((l) => {
      const s = normalize(l);
      if (s.includes('хіт')) out.add('hit');
      if (s.includes('нов')) out.add('new');
      if (s.includes('зниж') || s.includes('sale') || s.includes('розпрод')) out.add('sale');
    });

    // sometimes discount implies sale
    const discount = Number(p?.discountPercent ?? p?.discount ?? p?.salePercent);
    if (!Number.isNaN(discount) && discount > 0) out.add('sale');

    return out;
  };

  const hasBadge = (p, key) => getBadges(p).has(key);

  // add overlay badges for whole catalog without changing ProductCard
  const ProductWithBadges = ({ product }) => {
    const badges = getBadges(product);
    const showHit = badges.has('hit');
    const showNew = badges.has('new');
    const showSale = badges.has('sale');

    const Badge = ({ children, className }) => (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] sm:text-xs font-semibold shadow-sm border border-white/30 ${className}`}
      >
        {children}
      </span>
    );

    return (
      <div className="relative">
        {(showHit || showNew || showSale) && (
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1.5 pointer-events-none">
            {showHit && (
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">Хіт</Badge>
            )}
            {showNew && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">Новинка</Badge>
            )}
            {showSale && (
              <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white">Знижка</Badge>
            )}
          </div>
        )}

        <ProductCard product={product} />
      </div>
    );
  };

  // sync URL -> state
  useEffect(() => {
    const next = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      badge: searchParams.get('badge') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'name',
    };

    setFilters((prev) => {
      const same =
        prev.search === next.search &&
        prev.category === next.category &&
        prev.badge === next.badge &&
        prev.minPrice === next.minPrice &&
        prev.maxPrice === next.maxPrice &&
        prev.sortBy === next.sortBy;
      return same ? prev : next;
    });

    setSearchDraft(next.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // mobile default compact
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    if (mq.matches) setCompactView(true);
  }, []);

  // lock scroll for sheet
  useEffect(() => {
    if (!showFilters) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showFilters]);

  // debounce searchDraft -> filters.search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchDraft) return prev;
        const next = { ...prev, search: searchDraft };
        const newParams = new URLSearchParams(searchParams);
        if (searchDraft) newParams.set('search', searchDraft);
        else newParams.delete('search');
        setSearchParams(newParams, { replace: true });
        return next;
      });
    }, 350);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams, { replace: true });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    updateParam(key, value);
  };

  const clearFilters = () => {
    const reset = {
      search: '',
      category: '',
      badge: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
    };
    setFilters(reset);
    setSearchDraft('');
    setSearchParams({}, { replace: true });
  };

  const quickFilters = useMemo(
    () => [
      { key: 'hit', label: 'Хіти', color: 'from-amber-400 to-orange-500' },
      { key: 'new', label: 'Новинки', color: 'from-green-500 to-emerald-500' },
      { key: 'sale', label: 'Знижки', color: 'from-red-500 to-rose-500' },
    ],
    []
  );

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([k, v]) => {
      if (!v) return false;
      if (k === 'sortBy' && v === 'name') return false;
      return true;
    }).length;
  }, [filters]);

  const abortRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;

        // NOTE: we still can pass badge to backend if it supports it.
        // even if backend doesn't support, we also filter client-side below (safe).
        if (filters.badge) params.badge = filters.badge;

        if (filters.minPrice !== '') {
          const v = Number(filters.minPrice);
          if (!Number.isNaN(v)) params.minPrice = v;
        }
        if (filters.maxPrice !== '') {
          const v = Number(filters.maxPrice);
          if (!Number.isNaN(v)) params.maxPrice = v;
        }
        if (params.minPrice != null && params.maxPrice != null && params.minPrice > params.maxPrice) {
          const tmp = params.minPrice;
          params.minPrice = params.maxPrice;
          params.maxPrice = tmp;
        }

        params.sortBy = filters.sortBy || 'name';

        const data = await productsApi.getProducts(params, { signal: controller.signal });
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error?.name === 'AbortError') return;
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [filters]);

  // client-side badge filtering as fallback (ensures "hits/new/sale" work for all products)
  const visibleProducts = useMemo(() => {
    if (!filters.badge) return products;
    return products.filter((p) => hasBadge(p, filters.badge));
  }, [products, filters.badge]);

  return (
    <div className="min-h-screen bg-gray-50 py-3 sm:py-6 pb-20 sm:pb-10" data-testid="catalog-page">
      <style>{`
        @keyframes slideUp { from { transform: translateY(14px); opacity: .6; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slideUp .18s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800" data-testid="catalog-title">
              Каталог
              {(visibleProducts?.length ?? 0) > 0 && (
                <span className="text-gray-400 font-normal ml-1 sm:ml-3 text-sm sm:text-xl">
                  ({visibleProducts.length})
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Хіти • Новинки • Знижки — показуються на кожній картці товару
            </p>
          </div>

          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={() => setCompactView((v) => !v)}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 active:scale-95"
              aria-label="Змінити вигляд"
            >
              {compactView ? <LayoutGrid className="w-5 h-5 text-gray-600" /> : <Grid3X3 className="w-5 h-5 text-gray-600" />}
            </button>

            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md active:scale-95"
              aria-label="Відкрити фільтри"
              data-testid="filter-btn"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium text-sm">Фільтри</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-green-600 text-xs min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden mb-3">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-3 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Пошук у каталозі…"
              className="w-full text-sm outline-none bg-transparent"
              aria-label="Пошук"
            />
            {searchDraft && (
              <button
                onClick={() => setSearchDraft('')}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                aria-label="Очистити пошук"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick filters */}
        <div className="mb-3 sm:mb-4 overflow-x-auto scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max sm:flex-wrap">
            {quickFilters.map((qf) => (
              <button
                key={qf.key}
                onClick={() => handleFilterChange('badge', filters.badge === qf.key ? '' : qf.key)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                  filters.badge === qf.key
                    ? `bg-gradient-to-r ${qf.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {qf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Filters (desktop) */}
          <div className="hidden lg:block bg-white rounded-lg shadow-md p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Фільтри</h2>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Скинути
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Пошук</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => {
                    handleFilterChange('search', e.target.value);
                    setSearchDraft(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Назва товару..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Категорія</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Всі категорії</option>
                  <option value="Бонсай Нівакі">Бонсай Нівакі</option>
                  <option value="Туя Колумна">Туя Колумна</option>
                  <option value="Туя Смарагд">Туя Смарагд</option>
                  <option value="Хвойні рослини">Хвойні рослини</option>
                  <option value="Листопадні дерева">Листопадні дерева</option>
                  <option value="Кімнатні рослини">Кімнатні рослини</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Тип</label>
                <select
                  value={filters.badge}
                  onChange={(e) => handleFilterChange('badge', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Всі товари</option>
                  <option value="hit">Хіти продажу</option>
                  <option value="sale">Розпродаж</option>
                  <option value="new">Новинки</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ціна (грн)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Від"
                    min="0"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="До"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Сортування</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="name">За назвою</option>
                  <option value="price">Ціна: за зростанням</option>
                  <option value="-price">Ціна: за спаданням</option>
                </select>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors active:scale-95"
                >
                  Скинути фільтри
                </button>
              )}
            </div>
          </div>

          {/* Mobile bottom sheet */}
          {showFilters && (
            <>
              <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)} />
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl max-h-[75vh] overflow-y-auto animate-slide-up">
                <div className="px-4 pt-3 pb-2 sticky top-0 bg-white rounded-t-2xl border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Фільтри</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
                      aria-label="Закрити"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 px-4 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Пошук</label>
                    <input
                      type="text"
                      value={searchDraft}
                      onChange={(e) => setSearchDraft(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Назва товару..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Категорія</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Всі категорії</option>
                      <option value="Бонсай Нівакі">Бонсай Нівакі</option>
                      <option value="Туя Колумна">Туя Колумна</option>
                      <option value="Туя Смарагд">Туя Смарагд</option>
                      <option value="Хвойні рослини">Хвойні рослини</option>
                      <option value="Листопадні дерева">Листопадні дерева</option>
                      <option value="Кімнатні рослини">Кімнатні рослини</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Тип</label>
                    <select
                      value={filters.badge}
                      onChange={(e) => handleFilterChange('badge', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Всі товари</option>
                      <option value="hit">Хіти продажу</option>
                      <option value="sale">Розпродаж</option>
                      <option value="new">Новинки</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ціна (грн)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-1/2 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Від"
                        min="0"
                      />
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-1/2 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="До"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Сортування</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="name">За назвою</option>
                      <option value="price">Ціна: за зростанням</option>
                      <option value="-price">Ціна: за спаданням</option>
                    </select>
                  </div>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="w-full py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors active:scale-95"
                    >
                      Скинути фільтри
                    </button>
                  )}

                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors active:scale-95"
                  >
                    Застосувати
                  </button>

                  <div className="pb-2" />
                </div>
              </div>
            </>
          )}

          {/* Products grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] sm:aspect-square bg-gray-200" />
                    <div className="p-2 sm:p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-6 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleProducts.length > 0 ? (
              <div
                className={`grid gap-2 sm:gap-4 lg:gap-6 ${
                  compactView ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                }`}
              >
                {visibleProducts.map((product) => (
                  <ProductWithBadges
                    key={product?.id ?? product?.slug ?? `${product?.name ?? 'p'}-${Math.random()}`}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-12 text-center">
                <p className="text-gray-700 font-medium mb-1">Товарів не знайдено</p>
                <p className="text-gray-500 text-sm mb-4">
                  Якщо у товарів немає позначок (хіт/новинка/знижка) — вони не відобразяться у відповідному фільтрі.
                </p>
                <button onClick={clearFilters} className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base">
                  Скинути фільтри
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;

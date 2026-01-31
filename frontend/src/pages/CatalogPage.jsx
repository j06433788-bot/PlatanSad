import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, X, Grid3X3, LayoutGrid } from 'lucide-react';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(true);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    badge: searchParams.get('badge') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'name',
    search: searchParams.get('search') || '',
  });

  // ===============================
  // Instagram premium badge config
  // ===============================

  const IG_HANDLE = '@maisternia.roslyn';
  const IG_URL = 'https://www.instagram.com/maisternia.roslyn/';
  const isRoomPlantsSelected =
    String(filters.category || '').trim() === 'Кімнатні рослини';

  // ===============================
  // URL sync
  // ===============================

  useEffect(() => {
    const next = {
      category: searchParams.get('category') || '',
      badge: searchParams.get('badge') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'name',
      search: searchParams.get('search') || '',
    };

    setFilters((prev) => {
      const same =
        prev.category === next.category &&
        prev.badge === next.badge &&
        prev.minPrice === next.minPrice &&
        prev.maxPrice === next.maxPrice &&
        prev.sortBy === next.sortBy &&
        prev.search === next.search;
      return same ? prev : next;
    });
  }, [searchParams]);

  // ===============================
  // Mobile layout detect
  // ===============================

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    if (mq.matches) setCompactView(true);

    const apply = () => setCompactView((prev) => (mq.matches ? true : prev));

    mq.addEventListener
      ? mq.addEventListener('change', apply)
      : mq.addListener(apply);

    return () => {
      mq.removeEventListener
        ? mq.removeEventListener('change', apply)
        : mq.removeListener(apply);
    };
  }, []);

  // ===============================
  // Lock scroll for mobile filters
  // ===============================

  useEffect(() => {
    if (!showFilters) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = prev);
  }, [showFilters]);

  // ===============================
  // Quick filters
  // ===============================

  const quickFilters = useMemo(
    () => [
      { key: 'hit', label: 'Хіти', color: 'from-amber-400 to-orange-500' },
      { key: 'new', label: 'Новинки', color: 'from-green-500 to-emerald-500' },
      { key: 'sale', label: 'Знижки', color: 'from-red-500 to-rose-500' },
    ],
    []
  );

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    value ? params.set(key, value) : params.delete(key);
    setSearchParams(params, { replace: true });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    updateParam(key, value);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      badge: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      search: '',
    });
    setSearchParams({}, { replace: true });
    setShowFilters(false);
  };

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([k, v]) => {
      if (!v) return false;
      if (k === 'sortBy' && v === 'name') return false;
      return true;
    }).length;
  }, [filters]);

  // ===============================
  // Fetch products
  // ===============================

  const abortRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const data = await productsApi.getProducts({}, { signal: controller.signal });
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => abortRef.current?.abort();
  }, []);

  // ===============================
  // Filtering logic
  // ===============================

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((p) =>
        `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }

    if (filters.badge) {
      list = list.filter((p) => p.badges?.includes(filters.badge));
    }

    const min = filters.minPrice ? Number(filters.minPrice) : null;
    const max = filters.maxPrice ? Number(filters.maxPrice) : null;

    if (min !== null) list = list.filter((p) => p.price >= min);
    if (max !== null) list = list.filter((p) => p.price <= max);

    if (filters.sortBy === 'price') list.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === '-price') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => a.name.localeCompare(b.name, 'uk'));

    return list;
  }, [products, filters]);

  // ===============================
  // Render
  // ===============================

  return (
    <div className="min-h-screen bg-gray-50 py-4 pb-20">

      <style>{`

/* Premium IG Badge animation */
@keyframes igSheen {
  0% { transform: translateX(-120%); opacity: 0; }
  30% { opacity: .9; }
  60% { opacity: .9; }
  100% { transform: translateX(120%); opacity: 0; }
}

.ig-badge {
  position: relative;
  overflow: hidden;
}

.ig-badge::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-120%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,.25),
    transparent
  );
  animation: igSheen 3s ease-in-out infinite;
}

      `}</style>

      <div className="max-w-7xl mx-auto px-3">

        {/* Toolbar */}
        <div className="sticky top-[90px] z-30 bg-white rounded-2xl shadow-sm border p-4">

          <div className="flex justify-between items-center gap-3">

            <h1 className="text-xl font-bold">
              Каталог
              {!loading && (
                <span className="ml-2 text-gray-400 font-normal text-sm">
                  ({visibleProducts.length})
                </span>
              )}
            </h1>

            <div className="flex items-center gap-2">

              <button
                onClick={() => setCompactView(!compactView)}
                className="p-2 border rounded-xl"
              >
                {compactView ? <LayoutGrid size={18} /> : <Grid3X3 size={18} />}
              </button>

              <button
                onClick={() => setShowFilters(true)}
                className="bg-green-600 text-white px-3 py-2 rounded-xl flex items-center gap-2"
              >
                <SlidersHorizontal size={18} />
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-green-600 px-2 rounded-full text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

            </div>

          </div>

          {/* Quick chips */}
          <div className="flex gap-2 mt-3 flex-wrap">

            {quickFilters.map((f) => (
              <button
                key={f.key}
                onClick={() =>
                  handleFilterChange(
                    'badge',
                    filters.badge === f.key ? '' : f.key
                  )
                }
                className={`px-3 py-1.5 rounded-full text-sm ${
                  filters.badge === f.key
                    ? `bg-gradient-to-r ${f.color} text-white`
                    : 'border bg-white'
                }`}
              >
                {f.label}
              </button>
            ))}

          </div>

          {/* ✅ PREMIUM IG BADGE */}

          {isRoomPlantsSelected && (
            <div className="mt-3">

              <a
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                className="
                  ig-badge
                  inline-flex items-center gap-2
                  px-4 py-1.5 rounded-full
                  text-white text-sm font-semibold
                  bg-[linear-gradient(135deg,#ff3d7f,#b43bff,#4f46e5)]
                  shadow-lg
                  hover:-translate-y-[1px]
                  transition
                "
              >

                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs font-bold">
                  IG
                </span>

                {IG_HANDLE}

                <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-full">
                  Instagram
                </span>

              </a>

            </div>
          )}

        </div>

        {/* Products grid */}

        {loading ? (
          <div className="mt-6 text-center text-gray-400">Завантаження...</div>
        ) : visibleProducts.length ? (
          <div
            className={`grid gap-4 mt-6 ${
              compactView
                ? 'grid-cols-2 md:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
            }`}
          >
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="catalog" />
            ))}
          </div>
        ) : (
          <div className="bg-white mt-8 rounded-xl p-6 text-center shadow">
            <p className="font-semibold">Товарів не знайдено</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-green-600 font-semibold"
            >
              Скинути фільтри
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default CatalogPage;

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
  const [compactView, setCompactView] = useState(true); // mobile default

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    badge: searchParams.get('badge') || '', // hit | new | sale
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'name',
  });

  // keep URL -> state in sync
  useEffect(() => {
    const next = {
      category: searchParams.get('category') || '',
      badge: searchParams.get('badge') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'name',
    };

    setFilters((prev) => {
      const same =
        prev.category === next.category &&
        prev.badge === next.badge &&
        prev.minPrice === next.minPrice &&
        prev.maxPrice === next.maxPrice &&
        prev.sortBy === next.sortBy;
      return same ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // mobile view auto: compact on small screens
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    if (mq.matches) setCompactView(true);

    const apply = () => setCompactView((prev) => (mq.matches ? true : prev));
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', apply);
      else mq.removeListener(apply);
    };
  }, []);

  // lock body scroll when bottom sheet is open (mobile)
  useEffect(() => {
    if (!showFilters) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showFilters]);

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([k, v]) => {
      if (!v) return false;
      if (k === 'sortBy' && v === 'name') return false;
      return true;
    }).length;
  }, [filters]);

  const quickFilters = useMemo(
    () => [
      { key: 'hit', label: 'Хіти', color: 'from-amber-400 to-orange-500' },
      { key: 'new', label: 'Новинки', color: 'from-green-500 to-emerald-500' },
      { key: 'sale', label: 'Знижки', color: 'from-red-500 to-rose-500' },
    ],
    []
  );

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
      category: '',
      badge: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
    };
    setFilters(reset);
    setSearchParams({}, { replace: true });
  };

  const abortRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const params = {};
        if (filters.category) params.category = filters.category;
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
      }



import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, X, Grid3X3, LayoutGrid } from 'lucide-react';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(true); // Compact by default on mobile
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    badge: searchParams.get('badge') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'name',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.badge) params.badge = filters.badge;
        if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
        if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
        params.sortBy = filters.sortBy;

        const data = await productsApi.getProducts(params);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      badge: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
    });
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'name').length;

  // Quick badge filters
  const quickFilters = [
    { key: 'hit', label: 'Хіти', color: 'from-amber-400 to-orange-500' },
    { key: 'new', label: 'Новинки', color: 'from-green-500 to-emerald-500' },
    { key: 'sale', label: 'Знижки', color: 'from-red-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-3 sm:py-6 pb-20 sm:pb-8" data-testid="catalog-page">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header Section - Compact */}
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800" data-testid="catalog-title">
            Каталог
            {products.length > 0 && (
              <span className="text-gray-400 font-normal ml-1 sm:ml-3 text-sm sm:text-xl">({products.length})</span>
            )}
          </h1>
          
          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* View toggle */}
            <button
              onClick={() => setCompactView(!compactView)}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200"
              aria-label="Змінити вигляд"
            >
              {compactView ? (
                <LayoutGrid className="w-5 h-5 text-gray-600" />
              ) : (
                <Grid3X3 className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {/* Filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
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

        {/* Quick Badge Filters - Mobile horizontal scroll */}
        <div className="mb-3 sm:mb-4 overflow-x-auto scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
          <div className="flex gap-2 min-w-max sm:flex-wrap">
            {quickFilters.map((qf) => (
              <button
                key={qf.key}
                onClick={() => handleFilterChange('badge', filters.badge === qf.key ? '' : qf.key)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  filters.badge === qf.key
                    ? `bg-gradient-to-r ${qf.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
                data-testid={`quick-filter-${qf.key}`}
              >
                {qf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Filters Sidebar - Mobile as bottom sheet */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            {showFilters && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowFilters(false)}
              />
            )}
            
            <div className={`
              lg:static lg:bg-white lg:rounded-lg lg:shadow-md lg:p-6 lg:sticky lg:top-24
              fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl
              max-h-[70vh] overflow-y-auto
              lg:max-h-none
              ${showFilters ? 'animate-slide-up' : ''}
            `}>
              <div className="flex items-center justify-between mb-4 px-4 pt-4 lg:px-0 lg:pt-0">
                <h2 className="text-lg font-bold text-gray-800">Фільтри</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Закрити"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 px-4 pb-4 lg:px-0 lg:pb-0">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Пошук</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Назва товару..."
                    data-testid="filter-search"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Категорія</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    data-testid="filter-category"
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

                {/* Badge */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Тип</label>
                  <select
                    value={filters.badge}
                    onChange={(e) => handleFilterChange('badge', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    data-testid="filter-badge"
                  >
                    <option value="">Всі товари</option>
                    <option value="hit">Хіти продажу</option>
                    <option value="sale">Розпродаж</option>
                    <option value="new">Новинки</option>
                  </select>
                </div>

                {/* Price Range */}
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
                      data-testid="filter-min-price"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-1/2 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="До"
                      min="0"
                      data-testid="filter-max-price"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Сортування</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    data-testid="filter-sort"
                  >
                    <option value="name">За назвою</option>
                    <option value="price">Ціна: за зростанням</option>
                    <option value="-price">Ціна: за спаданням</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors active:scale-95"
                    data-testid="clear-filters-btn"
                  >
                    Скинути фільтри
                  </button>
                )}

                {/* Apply button for mobile */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden w-full py-3 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors active:scale-95"
                  data-testid="apply-filters-btn"
                >
                  Застосувати
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
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
            ) : products.length > 0 ? (
              <div 
                className={`grid gap-2 sm:gap-4 lg:gap-6 ${
                  compactView 
                    ? 'grid-cols-2 md:grid-cols-3' 
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                }`} 
                data-testid="products-grid"
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-12 text-center">
                <p className="text-gray-600 mb-3 text-sm sm:text-base">Товарів не знайдено</p>
                <button
                  onClick={clearFilters}
                  className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
                >
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

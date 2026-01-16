import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
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
    
    // Update URL params
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

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 pb-20 sm:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800" data-testid="catalog-title">
            Каталог товарів
            {products.length > 0 && (
              <span className="text-gray-500 font-normal ml-2 sm:ml-3 text-lg sm:text-xl">({products.length})</span>
            )}
          </h1>
          
          {/* Mobile filter button - Extra large */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md active:scale-95"
            aria-label="Відкрити фільтри"
          >
            <SlidersHorizontal className="w-6 h-6" />
            <span className="font-medium text-base">Фільтри</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-green-600 text-xs min-w-[22px] h-[22px] px-2 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Mobile as overlay */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            {/* Mobile overlay backdrop */}
            {showFilters && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowFilters(false)}
              />
            )}
            
            <div className={`
              lg:static lg:bg-white lg:rounded-lg lg:shadow-md lg:p-6 lg:sticky lg:top-24
              fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl
              max-h-[85vh] overflow-y-auto
              lg:max-h-none
              ${showFilters ? 'animate-slide-up' : ''}
            `}>
              <div className="flex items-center justify-between mb-6 px-6 pt-6 lg:px-0 lg:pt-0">
                <h2 className="text-2xl sm:text-lg font-bold text-gray-800">Фільтри</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Закрити"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="space-y-6 px-6 pb-6 lg:px-0 lg:pb-0">
                {/* Search - Extra large mobile input */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Пошук</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full px-4 py-4 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Назва товару..."
                    data-testid="filter-search"
                  />
                </div>

                {/* Category - Extra large mobile select */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Категорія</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-4 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    data-testid="filter-category"
                  >
                    <option value="">Всі категорії</option>
                    <option value="Бонсай Нівакі">Бонсай Нівакі</option>
                    <option value="Туя Колумна">Туя Колумна</option>
                    <option value="Туя Смарагд">Туя Смарагд</option>
                    <option value="Хвойні рослини">Хвойні рослини</option>
                    <option value="Листопадні дерева">Листопадні дерева</option>
                  </select>
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Тип</label>
                  <select
                    value={filters.badge}
                    onChange={(e) => handleFilterChange('badge', e.target.value)}
                    className="w-full px-4 py-4 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    data-testid="filter-badge"
                  >
                    <option value="">Всі товари</option>
                    <option value="hit">Хіти продажу</option>
                    <option value="sale">Розпродаж</option>
                    <option value="new">Новинки</option>
                  </select>
                </div>

                {/* Price Range - Extra large mobile inputs */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Ціна (грн)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-1/2 px-3 py-4 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Від"
                      min="0"
                      data-testid="filter-min-price"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-1/2 px-3 py-4 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="До"
                      min="0"
                      data-testid="filter-max-price"
                    />
                  </div>
                </div>

                {/* Sort - Extra large mobile select */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Сортування</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-4 py-4 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    data-testid="filter-sort"
                  >
                    <option value="name">За назвою</option>
                    <option value="price">Ціна: за зростанням</option>
                    <option value="-price">Ціна: за спаданням</option>
                  </select>
                </div>

                {/* Clear Filters - Extra large button for mobile */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-4 sm:py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium text-base hover:bg-gray-50 transition-colors active:scale-95"
                    data-testid="clear-filters-btn"
                  >
                    Скинути фільтри
                  </button>
                )}

                {/* Apply button for mobile - Extra large */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden w-full py-4 bg-green-600 text-white rounded-lg font-medium text-base hover:bg-green-700 transition-colors active:scale-95"
                >
                  Застосувати
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid - Better mobile spacing */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Завантаження...</div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6" data-testid="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                <p className="text-gray-600 mb-4">Товарів не знайдено</p>
                <button
                  onClick={clearFilters}
                  className="text-green-600 hover:text-green-700 font-medium"
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

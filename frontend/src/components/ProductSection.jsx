import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { productsApi } from '../api/productsApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductSection = () => {
  const [activeTab, setActiveTab] = useState('hits');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const tabs = [
    { id: 'hits', label: 'Хіти', filter: (p) => p.badges?.includes('hit') },
    { id: 'sale', label: 'Розпродаж', filter: (p) => p.badges?.includes('sale') },
    { id: 'new', label: 'Новинки', filter: (p) => p.badges?.includes('new') },
  ];

  const filteredProducts = products.filter(tabs.find(t => t.id === activeTab)?.filter || (() => true));

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-6 mb-4">
          {tabs.map((tab) => (
            <div key={tab.id} className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg aspect-[3/4] animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      {/* Tabs - Centered like in example */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-base sm:text-lg font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-green-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Products - Horizontal scroll on mobile */}
      <div className="relative">
        {/* Scroll buttons for desktop */}
        <button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        {/* Products container */}
        <div 
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredProducts.slice(0, 8).map((product) => (
            <div key={product.id} className="min-w-[170px] sm:min-w-[210px] md:min-w-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;

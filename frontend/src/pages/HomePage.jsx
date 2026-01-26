import React, { useState } from "react";
import { LayoutGrid } from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <Hero />
      
      {/* Catalog Button - Opens modal */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-6 pb-4">
        <button
          onClick={() => setIsCatalogOpen(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
          data-testid="catalog-main-btn"
        >
          <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Каталог рослин</span>
        </button>
      </div>

      {/* Product Tabs Section (Хіти / Розпродаж / Новинки) */}
      <ProductSection />

      {/* Catalog Modal */}
      <CatalogModal 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
      />
    </div>
  );
};

export default HomePage;

import React from 'react';
import { GitCompare, X } from 'lucide-react';

const ComparePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Адаптовано */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-center" data-testid="compare-title">
            Порівняння товарів
          </h1>
          <p className="text-sm md:text-xl text-center text-green-50 max-w-3xl mx-auto">
            Порівнюйте характеристики рослин для вибору найкращого варіанту
          </p>
        </div>
      </div>

      {/* Main Content - Оптимізовано для мобільних */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Empty State */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-6 md:p-12 text-center">
          <div className="bg-green-100 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <GitCompare className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Список порівняння порожній</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-5 md:mb-8">
            Додайте товари для порівняння, натиснувши на відповідну іконку на картці товару в каталозі.
          </p>
          <button 
            onClick={() => window.location.href = '/catalog'}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
            data-testid="go-to-catalog-btn"
          >
            Перейти до каталогу
          </button>
        </div>

        {/* How it works - Оптимізовано */}
        <div className="mt-6 md:mt-12 bg-white rounded-lg md:rounded-2xl shadow-lg p-5 md:p-12">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-5 md:mb-8 text-center">Як це працює?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-xl md:text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2">Оберіть товари</h3>
              <p className="text-sm md:text-base text-gray-600">
                Натисніть іконку порівняння на картках товарів, які ви хочете порівняти
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-xl md:text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2">Порівняйте</h3>
              <p className="text-sm md:text-base text-gray-600">
                Перегляньте характеристики товарів поруч для легкого порівняння
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-xl md:text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2">Оберіть найкраще</h3>
              <p className="text-sm md:text-base text-gray-600">
                Визначте оптимальний варіант та додайте його до кошика
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
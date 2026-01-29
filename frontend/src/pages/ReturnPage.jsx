import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle2, Clock, Phone } from 'lucide-react';

const ReturnPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-center"
            data-testid="return-title"
          >
            Обмін та повернення
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-center text-green-50 max-w-3xl mx-auto">
            Умови обміну та повернення товарів
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Return Policy */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-6 md:mb-12">
          <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
            <RefreshCw className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Умови повернення
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4 text-gray-600">
            <p className="text-sm sm:text-base md:text-lg">
              Ви маєте право повернути або обміняти товар протягом{' '}
              <strong className="text-green-600">14 днів</strong> з моменту отримання.
            </p>
            <p className="text-sm sm:text-base md:text-lg">
              Товар повинен бути належної якості, без слідів використання та в оригінальній упаковці.
            </p>
          </div>
        </div>

        {/* Conditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-12">
          {/* Allowed */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                Можна повернути
              </h3>
            </div>

            <ul className="space-y-2.5 md:space-y-3 text-gray-600">
              {[
                'Товар має належну якість',
                'Збережена оригінальна упаковка',
                'Рослина не має слідів висадки',
                'Протягом 14 днів з моменту отримання',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-green-500 text-lg mt-0.5">✓</span>
                  <span className="text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Allowed */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                Не підлягає поверненню
              </h3>
            </div>

            <ul className="space-y-2.5 md:space-y-3 text-gray-600">
              {[
                'Товар був у використанні',
                'Пошкоджена упаковка',
                'Рослина була висаджена в ґрунт',
                'Минув термін повернення (14 днів)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-red-500 text-lg mt-0.5">✗</span>
                  <span className="text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 mb-6 md:mb-12">
          <div className="flex items-center gap-2.5 md:gap-3 mb-6 md:mb-8">
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Процес повернення
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              ['1', "Зв'яжіться з нами", 'Телефонуйте або пишіть про намір повернути товар'],
              ['2', 'Відправте товар', 'Надішліть товар за нашою адресою'],
              ['3', 'Перевірка', 'Ми перевіримо стан товару після отримання'],
              ['4', 'Повернення коштів', 'Гроші повернуться протягом 3-5 робочих днів'],
            ].map(([num, title, desc], i) => (
              <div key={i} className="text-center" data-testid="return-step">
                <div className="bg-green-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <span className="text-lg md:text-2xl font-bold text-green-600">{num}</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm md:text-base">
                  {title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 sm:p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">
            Потрібна консультація?
          </h3>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Зв'яжіться з нашою службою підтримки для отримання детальної інформації про повернення.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <a
              href="tel:+380636507449"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              <Phone className="w-5 h-5 animate-pulse" />
              +380 (63) 650-74-49
            </a>

            <a
              href="tel:+380952510347"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              <Phone className="w-5 h-5 animate-pulse" />
              +380 (95) 251-03-47
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPage;


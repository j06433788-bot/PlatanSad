import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle2, Clock, Phone } from 'lucide-react';

const ReturnPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-center"
            data-testid="return-title"
          >
            Обмін та повернення
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-center text-green-50 max-w-3xl mx-auto">
            Умови обміну рослини або повернення коштів
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6 md:space-y-12">
        {/* Main policy */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
          <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
            <RefreshCw className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Коли можливий обмін або повернення коштів
            </h2>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            Обмін рослини або повернення коштів можливі виключно у разі, якщо:
          </p>

          <ul className="mt-4 space-y-3 text-gray-700">
            {[
              'рослина була пошкоджена під час транспортування;',
              'отриманий товар не відповідає замовленню (інший сорт або розмір);',
              'рослина прибула у критично незадовільному стані.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-bold">
                  ✓
                </span>
                <span className="text-sm sm:text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-4 sm:p-5 md:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Рішення щодо обміну або компенсації приймається індивідуально після розгляду звернення.
              </p>
            </div>
          </div>
        </div>

        {/* Conditions grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Required */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                Обовʼязкові умови розгляду
              </h3>
            </div>

            <ul className="space-y-3 text-gray-700">
              {[
                'повідомлення протягом 24 годин з моменту отримання замовлення;',
                'надання фото або відео матеріалів, зроблених у відділенні служби доставки або одразу після отримання;',
                'рослина не була висаджена або пересаджена.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 text-green-600 text-lg leading-none">•</span>
                  <span className="text-sm sm:text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not accepted */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                Коли звернення не розглядається
              </h3>
            </div>

            <ul className="space-y-3 text-gray-700">
              {[
                'минуло більше 24 годин з моменту отримання замовлення;',
                'відсутні фото або відео матеріали, зроблені у відділенні служби доставки або одразу після отримання;',
                'рослина була висаджена або пересаджена.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 text-sm font-bold">
                    ✕
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
          <div className="flex items-center gap-2.5 md:gap-3 mb-6 md:mb-8">
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Як подати звернення
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              ['1', "Звʼяжіться з нами", 'Напишіть або зателефонуйте протягом 24 годин після отримання.'],
              ['2', 'Додайте докази', 'Надайте фото/відео з відділення доставки або одразу після отримання.'],
              ['3', 'Не висаджуйте', 'Не висаджуйте та не пересаджуйте рослину до розгляду звернення.'],
              ['4', 'Рішення', 'Ми індивідуально розглянемо звернення та повідомимо результат.'],
            ].map(([num, title, desc], i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4 md:p-5 text-left sm:text-center"
                data-testid="return-step"
              >
                <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 mb-2 sm:mb-3">
                  <div className="bg-green-100 w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-lg md:text-2xl font-bold text-green-600">
                      {num}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg leading-snug">
                    {title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 sm:p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">
            Маєте запитання?
          </h3>

          <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
            Зателефонуйте нам — допоможемо по зверненню щодо обміну або компенсації.
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

import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle2, Clock, Phone } from 'lucide-react';

const ReturnPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-center">
            Обмін та повернення
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-center text-green-50 max-w-3xl mx-auto">
            Умови обміну рослини або повернення коштів
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6 md:space-y-12">

        {/* MAIN RULES */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
          <div className="flex items-center gap-3 mb-5">
            <RefreshCw className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Коли можливий обмін або повернення коштів
            </h2>
          </div>

          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            Обмін рослини або повернення коштів можливі виключно у разі, якщо:
          </p>

          <ul className="mt-4 space-y-3">
            {[
              'рослина була пошкоджена під час транспортування;',
              'отриманий товар не відповідає замовленню (інший сорт або розмір);',
              'рослина прибула у критично незадовільному стані.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                  ✓
                </span>
                <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Рішення щодо обміну або компенсації приймається індивідуально після розгляду звернення.
              </p>
            </div>
          </div>
        </div>

        {/* CONDITIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">

          {/* REQUIRED */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                Обовʼязкові умови
              </h3>
            </div>

            <ul className="space-y-3">
              {[
                'повідомлення протягом 24 годин з моменту отримання замовлення;',
                'надання фото або відео матеріалів у відділенні доставки або одразу після отримання;',
                'рослина не була висаджена або пересаджена.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* NOT ACCEPTED */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                Звернення не розглядаються
              </h3>
            </div>

            <ul className="space-y-3">
              {[
                'пройшло більше 24 годин з моменту отримання;',
                'відсутні фото або відео підтвердження;',
                'рослина була висаджена або пересаджена.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-600 font-bold text-sm">
                    ✕
                  </span>
                  <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* STEPS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Як подати звернення
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['1', 'Звʼяжіться з нами', 'Напишіть або зателефонуйте протягом 24 годин.'],
              ['2', 'Надайте докази', 'Додайте фото або відео матеріали.'],
              ['3', 'Не висаджуйте', 'Не пересаджуйте рослину до рішення.'],
              ['4', 'Отримайте відповідь', 'Ми повідомимо результат розгляду.'],
            ].map(([num, title, desc], i) => (
              <div
                key={i}
                className="bg-gray-50 border rounded-xl p-4 text-center"
              >
                <div className="bg-green-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-green-600">
                    {num}
                  </span>
                </div>

                <h4 className="font-bold text-gray-800 text-sm sm:text-base mb-1">
                  {title}
                </h4>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 sm:p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
            Маєте запитання?
          </h3>

          <p className="text-gray-700 text-sm sm:text-base mb-4">
            Зателефонуйте нам — допоможемо з обміном або компенсацією.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+380636507449"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-medium transition"
            >
              <Phone className="w-5 h-5 animate-pulse" />
              +380 (63) 650-74-49
            </a>

            <a
              href="tel:+380952510347"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-medium transition"
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

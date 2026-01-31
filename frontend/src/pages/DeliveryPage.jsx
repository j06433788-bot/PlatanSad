
import React from 'react';
import {
  CreditCard,
  Package,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const DeliveryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-center">
            Оплата і доставка
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-center text-green-50 max-w-3xl mx-auto leading-relaxed">
            Вся інформація про способи оплати та доставки товарів
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">

        {/* Payment Section */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 md:p-12 mb-6 md:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Способи оплати
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-green-500 transition-colors">
              <h3 className="font-bold text-gray-800 mb-2">Готівка при отриманні</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Оплата здійснюється при отриманні товару в офісі служби доставки або кур&apos;єру.
              </p>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-green-500 transition-colors">
              <h3 className="font-bold text-gray-800 mb-2">Безготівковий розрахунок</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Оплата на карту або через електронні платіжні системи.
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Section */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 md:p-12 mb-6 md:mb-12">

          {/* GREEN PRIORITY BLOCK */}
          <div className="mb-6 rounded-2xl border border-green-300 bg-green-50 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm sm:text-base font-semibold text-gray-800">
                  Копаємо і відправляємо щодня в порядку живої черги
                </p>
                <p className="text-sm sm:text-base text-gray-700 mt-1">
                  Терміни очікування:{' '}
                  <span className="font-semibold">2–6 робочих днів</span>
                  <span className="text-gray-500"> (залежить від сезону та завантаженості)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">

            {/* Нова Пошта */}
            <div className="border-2 border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Нова Пошта</h3>

                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    Доставка обов&apos;язково у вантажне відділення Нової Пошти (200–1100 кг)
                  </p>

                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Терміни доставки: <b>3–6 робочих днів</b>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Вартість: за тарифами Нової Пошти
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* COMPACT "ВАЖЛИВО ЗНАТИ" */}
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-700" />
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                  Важливо знати перед отриманням:
                </h4>
              </div>

              <ul className="space-y-1.5 text-gray-700">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    Перевірте рослини на цілісність під час отримання
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    Рослини пакуються вручну для безпечного транспортування
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    Після відправлення ви отримаєте номер накладної
                  </span>
                </li>
              </ul>
            </div>

            {/* Кур'єр */}
            <div className="border-2 border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Кур&apos;єрська доставка</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    Доставка за вказаною адресою (доступно для великих міст)
                  </p>

                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm sm:text-base">1–2 дні</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm sm:text-base">Вартість індивідуальна</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Самовивіз */}
            <div className="border-2 border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Самовивіз</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    Забрати замовлення можна з нашого розсадника за попередньою домовленістю. 
                    Копати на місці нагоди немає через велику завантаженість
                  </p>

                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm sm:text-base">Безкоштовно</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm sm:text-base">Пн–Нд 8:00–17:00</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DeliveryPage;

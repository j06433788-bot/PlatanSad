import React from 'react';
import { Truck, CreditCard, Package, Clock, MapPin, CheckCircle } from 'lucide-react';

const DeliveryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Адаптовано */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-center" data-testid="delivery-title">
            Оплата і доставка
          </h1>
          <p className="text-sm md:text-xl text-center text-green-50 max-w-3xl mx-auto">
            Вся інформація про способи оплати та доставки товарів
          </p>
        </div>
      </div>

      {/* Main Content - Оптимізовано для мобільних */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Payment Section */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-5 md:p-12 mb-6 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">Способи оплати</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="border-2 border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-green-500 transition-colors" data-testid="payment-method">
              <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-3">Готівка при отриманні</h3>
              <p className="text-sm md:text-base text-gray-600">
                Оплата здійснюється при отриманні товару в офісі служби доставки або кур'єру.
              </p>
            </div>
            <div className="border-2 border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-green-500 transition-colors" data-testid="payment-method">
              <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-3">Безготівковий розрахунок</h3>
              <p className="text-sm md:text-base text-gray-600">
                Оплата на карту або через електронні платіжні системи.
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Section */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-5 md:p-12 mb-6 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Truck className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">Доставка</h2>
          </div>
          
          <div className="space-y-4 md:space-y-6">
            {/* Нова Пошта */}
            <div className="border-2 border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6" data-testid="delivery-method">
              <div className="flex items-start gap-3 md:gap-4">
                <Package className="w-5 h-5 md:w-6 md:h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2">Нова Пошта</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-3">
                    Доставка у відділення або поштомат по всій Україні.
                  </p>
                  <ul className="space-y-1.5 md:space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm md:text-base">Термін доставки: 1-3 дні</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm md:text-base">Вартість: за тарифами Нової Пошти</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Кур'єрська доставка */}
            <div className="border-2 border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6" data-testid="delivery-method">
              <div className="flex items-start gap-3 md:gap-4">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2">Кур'єрська доставка</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-3">
                    Доставка за вказаною адресою (доступно для великих міст).
                  </p>
                  <ul className="space-y-1.5 md:space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm md:text-base">Термін доставки: 1-2 дні</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm md:text-base">Вартість: розраховується індивідуально</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Самовивіз */}
            <div className="border-2 border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6" data-testid="delivery-method">
              <div className="flex items-start gap-3 md:gap-4">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2">Самовивіз</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-3">
                    Забрати замовлення можна з нашого розсадника.
                  </p>
                  <ul className="space-y-1.5 md:space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm md:text-base">Безкоштовно</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm md:text-base">Графік роботи: Пн-Нд 8:00-20:00</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg md:rounded-2xl p-5 md:p-8">
          <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Важлива інформація</h3>
          <ul className="space-y-2 md:space-y-3 text-gray-700">
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-green-500 text-lg md:text-xl mt-0.5 flex-shrink-0">•</span>
              <span className="text-sm md:text-base">При отриманні обов'язково перевірте товар на наявність пошкоджень</span>
            </li>
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-green-500 text-lg md:text-xl mt-0.5 flex-shrink-0">•</span>
              <span className="text-sm md:text-base">Рослини надійно упаковані для безпечної доставки</span>
            </li>
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-green-500 text-lg md:text-xl mt-0.5 flex-shrink-0">•</span>
              <span className="text-sm md:text-base">Після відправлення ви отримаєте номер для відстеження</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
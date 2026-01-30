import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckSquare, Square, Check } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();

  // 🔧 Статичний перемикач стану:
  // true  -> порожній кошик
  // false -> кошик з товарами
  const isEmpty = false;

  // ✅ Статичні товари (для верстки)
  const cartItems = [
    {
      id: 1,
      productId: 11,
      productName: 'Клен японський (Acer palmatum) — 60–80 см',
      productImage:
        'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1200&auto=format&fit=crop&q=70',
      price: 1490,
      quantity: 1,
    },
    {
      id: 2,
      productId: 22,
      productName: 'Туя Smaragd — 100–120 см',
      productImage:
        'https://images.unsplash.com/photo-1617191518303-7a1f4d2c2a86?w=1200&auto=format&fit=crop&q=70',
      price: 890,
      quantity: 2,
    },
  ];

  // ✅ Статичний “вибір” (для відображення)
  const selectedAll = true;
  const selectedCount = selectedAll ? cartItems.length : 0;

  const selectedTotal = selectedAll
    ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const cartCount = cartItems.length;

  const goCheckout = () => navigate('/checkout');

  // ✅ Empty cart (static)
  if (isEmpty) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 sm:py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
              Кошик
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="bg-white rounded-2xl shadow-sm md:shadow-lg p-6 sm:p-10 text-center max-w-xl mx-auto">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-green-500" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
              Кошик порожній <span className="ml-1">🛒</span>
            </h2>

            <p className="text-gray-500 text-sm sm:text-base mb-8">
              Ви ще нічого не додали до кошика. Перегляньте наш каталог — там багато цікавого! 🌿
            </p>

            <button
              onClick={() => navigate('/catalog')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Перейти до каталогу
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Filled cart (static)
  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-12 pt-4 md:pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          Кошик
          <span className="text-lg font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {cartCount}
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <button
                className="flex items-center gap-3 text-gray-600 font-medium hover:text-green-600 transition-colors"
                type="button"
              >
                {selectedAll ? (
                  <CheckSquare className="w-6 h-6 text-green-600" />
                ) : (
                  <Square className="w-6 h-6 text-gray-300" />
                )}
                <span>Вибрати всі ({cartItems.length})</span>
              </button>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 ${
                  selectedAll ? 'border-green-200 bg-green-50/10' : 'border-gray-100'
                }`}
              >
                <div className="flex gap-4">
                  {/* Checkbox (decorative) */}
                  <div className="flex items-center justify-center pt-8 sm:pt-0">
                    <button
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      type="button"
                      aria-label="Вибрати"
                    >
                      {selectedAll ? (
                        <CheckSquare className="w-6 h-6 text-green-600" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-300" />
                      )}
                    </button>
                  </div>

                  {/* Image */}
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/products/${item.productId}`)}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3
                          className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-green-600 cursor-pointer transition-colors"
                          onClick={() => navigate(`/products/${item.productId}`)}
                          role="button"
                          tabIndex={0}
                        >
                          {item.productName}
                        </h3>

                        {/* Remove (decorative) */}
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Видалити"
                          type="button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-1 sm:mt-2 text-lg font-bold text-gray-900">
                        {item.price} ₴
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      {/* Qty Controls (decorative) */}
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                        <button
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors"
                          type="button"
                          aria-label="Мінус"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-10 text-center font-medium text-sm">
                          {item.quantity}
                        </span>

                        <button
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors"
                          type="button"
                          aria-label="Плюс"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="font-bold text-green-600 text-sm sm:text-base">
                        {(item.price * item.quantity).toFixed(0)} ₴
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24 hidden lg:block">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Разом</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Вибрано товарів</span>
                  <span className="font-medium">{selectedCount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span className="text-green-600 text-sm font-medium">За тарифами пошти</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">До сплати</span>
                  <span className="text-2xl font-bold text-green-600">{selectedTotal.toFixed(0)} ₴</span>
                </div>
              </div>

              <button
                onClick={goCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <span>Оформити замовлення</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Check className="w-4 h-4 text-green-500" />
                <span>Безпечна оплата</span>
              </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl lg:hidden z-40 safe-area-pb">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-500">До сплати ({selectedCount})</div>
                  <div className="text-2xl font-bold text-green-600 leading-tight">
                    {selectedTotal.toFixed(0)} ₴
                  </div>
                </div>

                <button
                  onClick={goCheckout}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                >
                  <span>Оформити</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

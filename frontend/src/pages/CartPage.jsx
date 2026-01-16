import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount, loading } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <ShoppingBag className="w-24 h-24 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-5 sm:mb-6" />
            <h2 className="text-2xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-4">Ваш кошик порожній</h2>
            <p className="text-base sm:text-base text-gray-600 mb-7 sm:mb-8">
              Додайте товари до кошика, щоб продовжити покупки
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 sm:py-3 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95 text-lg sm:text-base"
              data-testid="continue-shopping-btn"
            >
              Перейти до каталогу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 pb-32 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8" data-testid="cart-title">
          Кошик <span className="text-gray-500 font-normal text-xl sm:text-2xl">({cartCount} {cartCount === 1 ? 'товар' : 'товарів'})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-3 sm:p-6 flex gap-3 sm:gap-4 hover:shadow-lg transition-shadow"
                data-testid={`cart-item-${item.id}`}
              >
                {/* Product Image - Extra large mobile size */}
                <div 
                  className="w-24 h-24 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/products/${item.productId}`)}
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 
                      className="font-medium text-base sm:text-base text-gray-800 mb-2 sm:mb-2 hover:text-green-600 cursor-pointer transition-colors line-clamp-2"
                      onClick={() => navigate(`/products/${item.productId}`)}
                    >
                      {item.productName}
                    </h3>
                    <div className="text-lg sm:text-lg font-bold text-green-600">
                      {item.price} грн
                    </div>
                    {/* Subtotal for mobile */}
                    <div className="sm:hidden text-sm text-gray-500 mt-2">
                      Сума: {(item.price * item.quantity).toFixed(2)} грн
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 sm:mt-4">
                    {/* Quantity Controls - Extra large for mobile */}
                    <div className="flex items-center gap-2 sm:gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
                        data-testid={`decrease-qty-${item.id}`}
                        aria-label="Зменшити кількість"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-12 sm:w-12 text-center font-medium text-lg sm:text-base" data-testid={`item-quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={loading}
                        className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors active:scale-95"
                        data-testid={`increase-qty-${item.id}`}
                        aria-label="Збільшити кількість"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Remove Button - Extra large touch target */}
                    <button
                      onClick={() => removeFromCart(item.id, item.productName)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 p-3 sm:p-2 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 active:scale-95"
                      data-testid={`remove-item-${item.id}`}
                      aria-label="Видалити товар"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="hidden sm:flex flex-col items-end justify-between">
                  <div className="text-sm text-gray-500">Сума</div>
                  <div className="text-xl font-bold text-gray-800">
                    {(item.price * item.quantity).toFixed(2)} грн
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Sticky on mobile */}
          <div className="lg:col-span-1">
            {/* Mobile sticky bottom bar - Extra large */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 z-40 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-500">До сплати</div>
                  <div className="text-2xl font-bold text-green-600" data-testid="cart-total">{cartTotal.toFixed(2)} грн</div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="bg-green-600 hover:bg-green-700 text-white px-7 py-4 rounded-lg font-medium text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                  data-testid="proceed-to-checkout-btn"
                  aria-label="Оформити замовлення"
                >
                  <span>Оформити</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Desktop summary */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Разом</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Товарів ({cartCount})</span>
                  <span className="font-medium">{cartTotal.toFixed(2)} грн</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span className="font-medium text-green-600 text-sm">За тарифами перевізника</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>До сплати</span>
                  <span className="text-green-600" data-testid="cart-total">{cartTotal.toFixed(2)} грн</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                data-testid="proceed-to-checkout-btn"
              >
                <span>Оформити замовлення</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/catalog')}
                className="w-full mt-3 border-2 border-gray-300 hover:border-green-600 text-gray-700 hover:text-green-600 py-3 rounded-lg font-medium transition-all"
              >
                Продовжити покупки
              </button>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Безпечна оплата</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Доставка по всій Україні</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Гарантія якості</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

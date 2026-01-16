import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';
import QuickOrderModal from '../components/QuickOrderModal';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const { addToCart, cartLoading } = useCart();
  const { isInWishlist, toggleWishlist, wishlistLoading } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Помилка завантаження товару');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Завантаження...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isFavorite = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back button - Larger */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors py-2"
          data-testid="back-btn"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-base">Назад до каталогу</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="product-image"
                />
              </div>
              
              {/* Badges - Larger for mobile */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badges?.includes('sale') && (
                  <span className="bg-red-500 text-white text-base px-3 py-1.5 rounded font-medium">
                    Розпродаж
                  </span>
                )}
                {product.badges?.includes('new') && (
                  <span className="bg-blue-500 text-white text-base px-3 py-1.5 rounded font-medium">
                    Новинка
                  </span>
                )}
                {product.badges?.includes('hit') && (
                  <span className="bg-orange-500 text-white text-base px-3 py-1.5 rounded font-medium">
                    Хіт
                  </span>
                )}
              </div>

              {product.discount > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-600 text-white text-xl px-4 py-2 rounded-full font-bold">
                    −{product.discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="text-base text-gray-500 mb-2">Артикул: {product.article}</div>
              
              <h1 className="text-3xl sm:text-3xl font-bold text-gray-800 mb-4" data-testid="product-name">
                {product.name}
              </h1>

              <div className="text-base text-gray-600 mb-4">
                <span className="font-medium">Категорія:</span> {product.category}
              </div>

              {/* Price - Extra large */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-4xl font-bold text-green-600" data-testid="product-price">
                    {product.price} грн
                  </span>
                  {product.oldPrice && (
                    <span className="text-2xl text-gray-400 line-through">
                      {product.oldPrice} грн
                    </span>
                  )}
                </div>
                {product.discount > 0 && (
                  <div className="text-base text-green-600 mt-2">
                    Ви економите {product.oldPrice - product.price} грн
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-3">Опис товару</h3>
                <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
              </div>

              {/* Stock status - Larger */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-green-600 font-medium text-base">
                      В наявності ({product.stock} шт.)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-600 font-medium text-base">Немає в наявності</span>
                  </div>
                )}
              </div>

              {/* Quantity selector - Extra large */}
              <div className="mb-6">
                <label className="font-medium text-gray-700 mb-3 block text-base">Кількість:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid="decrease-qty-btn"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    className="w-24 h-12 text-center text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    max={product.stock}
                    data-testid="quantity-input"
                  />
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid="increase-qty-btn"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action buttons - Extra large */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.stock === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  data-testid="add-to-cart-detail-btn"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Додати в кошик</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  disabled={wishlistLoading}
                  className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                  data-testid="wishlist-detail-btn"
                >
                  <Heart
                    className={`w-7 h-7 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              {/* Quick buy button */}
              <button
                onClick={() => setShowQuickOrder(true)}
                disabled={product.stock === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-6"
                data-testid="quick-buy-detail-btn"
              >
                <Zap className="w-6 h-6" />
                <span>Купити швидко</span>
              </button>

              {/* Additional info */}
              <div className="border-t pt-6 space-y-4 text-base text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">🚚 Доставка:</span>
                  <span>Новою Поштою по всій Україні</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">💳 Оплата:</span>
                  <span>При отриманні або онлайн</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">✅ Гарантія:</span>
                  <span>Якість перевірена</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Order Modal */}
      <QuickOrderModal 
        product={product}
        isOpen={showQuickOrder}
        onClose={() => setShowQuickOrder(false)}
        quantity={quantity}
      />
    </div>
  );
};

export default ProductDetailPage;
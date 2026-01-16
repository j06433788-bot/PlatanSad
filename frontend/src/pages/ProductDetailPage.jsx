import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, Zap, GitCompare, Check, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import QuickOrderModal from '../components/QuickOrderModal';
import SimilarProducts from '../components/SimilarProducts';
import RecentlyViewed, { addToRecentlyViewed } from '../components/RecentlyViewed';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  
  const { addToCart, cartLoading } = useCart();
  const { isInWishlist, toggleWishlist, wishlistLoading } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getProduct(id);
        setProduct(data);
        // Add to history
        addToRecentlyViewed(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Помилка завантаження товару');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // Reset quantity when id changes
    setQuantity(1);
    // Scroll to top
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleCompare = () => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Завантаження...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isFavorite = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumb / Back Navigation */}
      <div className="bg-white border-b sticky top-[72px] md:top-[88px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
            {/* Product Image Section */}
            <div className="relative bg-gray-50 p-4 md:p-8 flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.badges?.map(badge => (
                    <span 
                      key={badge}
                      className={`
                        text-xs font-bold px-3 py-1 rounded-md text-white shadow-sm uppercase tracking-wider
                        ${badge === 'sale' ? 'bg-red-500' : ''}
                        ${badge === 'new' ? 'bg-green-500' : ''}
                        ${badge === 'hit' ? 'bg-orange-500' : ''}
                      `}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {product.discount > 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-600 text-white text-lg font-bold px-3 py-1 rounded-lg shadow-sm">
                      -{product.discount}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="p-6 md:p-8 lg:pr-12 flex flex-col h-full">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                  Арт: {product.article}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCompare}
                    className={`p-2 rounded-full transition-colors ${
                      isCompared 
                        ? 'bg-green-50 text-green-600' 
                        : 'text-gray-400 hover:bg-gray-100 hover:text-green-600'
                    }`}
                    title="Порівняти"
                  >
                    <GitCompare className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite 
                        ? 'bg-red-50 text-red-500' 
                        : 'text-gray-400 hover:bg-gray-100 hover:text-red-500'
                    }`}
                    title="В обране"
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>

              <div className="text-green-600 font-medium mb-6">
                {product.category}
              </div>

              {/* Price Block */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl md:text-4xl font-bold text-gray-900">
                        {product.price} ₴
                      </span>
                      {product.oldPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          {product.oldPrice} ₴
                        </span>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium mt-1">
                        <Check className="w-4 h-4" />
                        <span>В наявності</span>
                      </div>
                    ) : (
                      <div className="text-red-500 text-sm font-medium mt-1">
                        Немає в наявності
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      className="w-12 text-center text-lg font-bold text-gray-800 focus:outline-none"
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading || product.stock === 0}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Купити
                  </button>
                  <button
                    onClick={() => setShowQuickOrder(true)}
                    disabled={product.stock === 0}
                    className="flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 py-3.5 px-6 rounded-xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Zap className="w-5 h-5" />
                    Швидке замовлення
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Доставка</div>
                    <div className="text-xs text-gray-500">По всій Україні</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Гарантія</div>
                    <div className="text-xs text-gray-500">Якість перевірено</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50/50">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Оплата</div>
                    <div className="text-xs text-gray-500">Зручним способом</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-auto">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Опис товару</h3>
                <div className="prose prose-sm sm:prose-base text-gray-600 leading-relaxed max-w-none">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <SimilarProducts category={product.category} currentProductId={product.id} />
        
        {/* Recently Viewed */}
        <RecentlyViewed currentProductId={product.id} />
      </div>

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

import React, { useState } from 'react';
import { ShoppingCart, Heart, Zap, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import QuickOrderModal from './QuickOrderModal';
import { toast as sonnerToast } from 'sonner';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const isFavorite = isInWishlist(product.id);

  const hasSale = product.badges?.includes('sale');
  const isNew = product.badges?.includes('new');
  const isHit = product.badges?.includes('hit');

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product);
    setAddedToCart(true);
    
    sonnerToast.custom(
      () => (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white min-w-[280px] shadow-2xl shadow-green-500/40 animate-toast-slide">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl animate-toast-bounce">
              <ShoppingCart className="w-6 h-6 fill-current animate-toast-sparkle" />
            </div>
            <div>
              <p className="font-bold text-lg">Додано в кошик! 🛒</p>
              <p className="text-sm text-white/90 mt-0.5">{product.name}</p>
            </div>
          </div>
        </div>
      ),
      { duration: 2500, position: 'top-center' }
    );
    
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    const wasInWishlist = isFavorite;
    
    await toggleWishlist(product.id);
    
    if (!wasInWishlist) {
      sonnerToast.custom(
        () => (
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-4 text-white min-w-[280px] shadow-2xl shadow-rose-500/40 animate-toast-slide">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl animate-toast-bounce">
                <Heart className="w-6 h-6 fill-current animate-toast-sparkle" />
              </div>
              <div>
                <p className="font-bold text-lg">Додано в бажання! ❤️</p>
                <p className="text-sm text-white/90 mt-0.5">{product.name}</p>
              </div>
            </div>
          </div>
        ),
        { duration: 2500, position: 'top-center' }
      );
    }
  };

  return (
    <>
      <div 
        className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative h-full flex flex-col cursor-pointer card-appear"
        onClick={() => navigate(`/products/${product.id}`)}
        data-testid={`product-card-${product.id}`}
      >
        {/* Image Container - Reduced height on mobile */}
        <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Animated Badges */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 flex flex-col gap-1">
            {isNew && (
              <span className="badge-new bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-lg shadow-green-500/30">
                НОВИНКА
              </span>
            )}
            {isHit && (
              <span className="badge-hit bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-lg shadow-orange-500/30">
                ХІТ
              </span>
            )}
            {hasSale && (
              <span className="badge-sale bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-lg shadow-red-500/30">
                РОЗПРОДАЖ
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 discount-badge">
              <div className="bg-red-500 text-white text-[10px] sm:text-sm font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg">
                -{product.discount}%
              </div>
            </div>
          )}

          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Hover Actions - Desktop only */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Wishlist Button */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`absolute top-1.5 right-1.5 sm:hidden z-10 p-1.5 rounded-full shadow-md backdrop-blur-sm transition-all ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/95 text-gray-500'
            } ${product.discount > 0 ? 'top-8' : ''}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content - Compact on mobile */}
        <div className="p-2 sm:p-4 flex-1 flex flex-col">
          {/* Category */}
          <span className="text-[9px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5 sm:mb-1 truncate">
            {product.category}
          </span>

          {/* Name - Reduced height */}
          <h3 className="text-xs sm:text-base font-semibold text-gray-800 line-clamp-2 mb-1 sm:mb-2 group-hover:text-green-600 transition-colors min-h-[2rem] sm:min-h-[3rem]">
            {product.name}
          </h3>

          {/* Price Section - Compact */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-1 sm:gap-2 mb-1.5 sm:mb-3">
              <span className="text-base sm:text-2xl font-bold text-gray-900">
                {product.price?.toLocaleString()}
              </span>
              <span className="text-sm sm:text-lg text-gray-900">₴</span>
              {product.oldPrice && (
                <span className="text-[10px] sm:text-sm text-gray-400 line-through">
                  {product.oldPrice?.toLocaleString()} ₴
                </span>
              )}
            </div>

            {/* Stock Status - Compact */}
            <div className="flex items-center gap-1 mb-1.5 sm:mb-3">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-[10px] sm:text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'В наявності' : 'Немає'}
              </span>
            </div>

            {/* Action Buttons - Compact */}
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock === 0 || addedToCart}
                className={`flex-1 py-2 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl font-semibold text-[11px] sm:text-sm transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40 active:scale-[0.98]'
                }`}
                data-testid={`add-to-cart-${product.id}`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Додано</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Купити</span>
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickOrder(true);
                }}
                disabled={product.stock === 0}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Швидке замовлення"
                data-testid={`quick-order-${product.id}`}
              >
                <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Order Modal */}
      {showQuickOrder && (
        <QuickOrderModal
          product={product}
          onClose={() => setShowQuickOrder(false)}
        />
      )}
    </>
  );
};

export default ProductCard;

import React, { useState } from 'react';
import { ShoppingCart, Heart, Zap, GitCompare, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import QuickOrderModal from './QuickOrderModal';
import { toast } from './CustomToast';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const isFavorite = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const hasSale = product.badges?.includes('sale');
  const isNew = product.badges?.includes('new');
  const isHit = product.badges?.includes('hit');

  const handleCompare = (e) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product);
    setAddedToCart(true);
    toast.cartAdd(product.name);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    const wasInWishlist = isFavorite;
    toggleWishlist(product);
    if (!wasInWishlist) {
      toast.wishlistAdd(product.name);
    }
  };

  return (
    <>
      <div 
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative h-full flex flex-col cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Badges - Improved mobile layout */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {isNew && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shadow-lg shadow-green-500/30">
                НОВИНКА
              </span>
            )}
            {isHit && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shadow-lg shadow-orange-500/30">
                ХІТ
              </span>
            )}
            {hasSale && (
              <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shadow-lg shadow-red-500/30">
                РОЗПРОДАЖ
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full shadow-lg">
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
              <button
                onClick={handleCompare}
                className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all ${
                  isCompared 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/90 text-gray-700 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <GitCompare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Action Buttons - Always visible */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 sm:hidden">
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-all ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/95 text-gray-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleCompare}
              className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-all ${
                isCompared 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/95 text-gray-500'
              }`}
            >
              <GitCompare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          {/* Category */}
          <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
            {product.category}
          </span>

          {/* Name */}
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors min-h-[2.5rem] sm:min-h-[3rem]">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                {product.price?.toLocaleString()}
              </span>
              <span className="text-base sm:text-lg text-gray-900">₴</span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.oldPrice?.toLocaleString()} ₴
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'В наявності' : 'Немає в наявності'}
              </span>
            </div>

            {/* Action Buttons - Mobile optimized */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock === 0 || addedToCart}
                className={`flex-1 py-2.5 sm:py-3 px-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : product.stock === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40 active:scale-[0.98]'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Додано</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
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
                className="p-2.5 sm:p-3 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Швидке замовлення"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
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

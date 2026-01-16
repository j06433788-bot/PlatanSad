import React, { useState } from 'react';
import { ShoppingCart, Heart, Zap, GitCompare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import QuickOrderModal from './QuickOrderModal';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  
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

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative group h-full flex flex-col">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
        {hasSale && (
          <span className="bg-red-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-bold shadow-sm">
            SALE
          </span>
        )}
        {isNew && (
          <span className="bg-green-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-bold shadow-sm">
            NEW
          </span>
        )}
        {isHit && (
          <span className="bg-orange-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-bold shadow-sm">
            HIT
          </span>
        )}
      </div>

      {/* Discount badge */}
      {product.discount > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md font-bold shadow-sm">
            -{product.discount}%
          </span>
        </div>
      )}

      {/* Action Buttons Group (Top Right - visible on hover desktop, always visible mobile but subtle) */}
      <div className="absolute top-10 right-2 z-20 flex flex-col gap-2">
        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          disabled={wishlistLoading}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-90 ${
            isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'
          }`}
          aria-label="Додати до улюблених"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>

        {/* Compare */}
        <button
          onClick={handleCompare}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-90 ${
            isCompared ? 'bg-green-50 text-green-600' : 'bg-white/90 text-gray-400 hover:text-green-600'
          }`}
          aria-label="Порівняти"
        >
          <GitCompare className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image */}
      <div 
        className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-gray-50 cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quick Buy Overlay Button (Desktop) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickOrder(true);
            }}
            className="w-full bg-white/95 backdrop-blur-sm text-gray-800 py-2 rounded-lg font-medium text-sm shadow-lg hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-orange-500" />
            Купити швидко
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="text-xs text-gray-500 mb-1 line-clamp-1">{product.category}</div>
        <h3 
          className="text-sm sm:text-base font-medium text-gray-800 mb-auto line-clamp-2 leading-tight hover:text-green-600 transition-colors cursor-pointer min-h-[2.5em]"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.name}
        </h3>

        {/* Price & Stock */}
        <div className="mt-3 mb-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-gray-900">{product.price} ₴</span>
            {product.oldPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through decoration-red-400">
                {product.oldPrice} ₴
              </span>
            )}
          </div>
          <div className="text-xs mt-1">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                В наявності
              </span>
            ) : (
              <span className="text-red-500 font-medium">Немає в наявності</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-[1fr,auto] gap-2 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            disabled={cartLoading || product.stock === 0}
            className="flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">В кошик</span>
            <span className="sm:hidden">Купити</span>
          </button>
          
          {/* Mobile Quick Buy Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickOrder(true);
            }}
            disabled={product.stock === 0}
            className="sm:hidden w-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </div>

      <QuickOrderModal 
        product={product}
        isOpen={showQuickOrder}
        onClose={() => setShowQuickOrder(false)}
        quantity={1}
      />
    </div>
  );
};

export default ProductCard;

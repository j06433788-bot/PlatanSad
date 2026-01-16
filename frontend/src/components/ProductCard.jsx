import React, { useState } from 'react';
import { ShoppingCart, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import QuickOrderModal from './QuickOrderModal';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  
  const isFavorite = isInWishlist(product.id);

  const hasSale = product.badges?.includes('sale');
  const isNew = product.badges?.includes('new');
  const isHit = product.badges?.includes('hit');

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 relative group">
      {/* Badges - Stacked vertically like in example */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {hasSale && (
          <span className="bg-red-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded font-medium">
            Розпродаж
          </span>
        )}
        {isNew && (
          <span className="bg-green-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded font-medium">
            Новинка
          </span>
        )}
        {isHit && (
          <span className="bg-orange-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded font-medium">
            Хіт
          </span>
        )}
      </div>

      {/* Discount badge - Bottom left like in example */}
      {product.discount > 0 && (
        <div className="absolute bottom-[120px] sm:bottom-[140px] left-2 z-10">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
            −{product.discount}%
          </span>
        </div>
      )}

      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        disabled={wishlistLoading}
        className="absolute top-2 right-2 z-20 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 active:scale-95 disabled:opacity-50"
        data-testid={`wishlist-btn-${product.id}`}
        aria-label="Додати до улюблених"
      >
        <Heart
          className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Product image */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
        data-testid={`product-card-${product.id}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product info */}
      <div className="p-3 sm:p-4">
        {/* Product name */}
        <h3 
          className="text-sm sm:text-base font-medium text-gray-800 mb-2 h-11 sm:h-12 line-clamp-2 leading-tight hover:text-green-600 transition-colors cursor-pointer"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg sm:text-lg font-bold text-gray-900">{product.price} грн</span>
          {product.oldPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">{product.oldPrice} грн</span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
          disabled={cartLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-300 text-sm active:scale-95 disabled:opacity-50"
          data-testid={`add-to-cart-btn-${product.id}`}
          aria-label="Додати в кошик"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>В кошик</span>
        </button>

        {/* Quick buy button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowQuickOrder(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-300 text-sm active:scale-95 mt-2"
          data-testid={`quick-buy-btn-${product.id}`}
          aria-label="Купити швидко"
        >
          <Zap className="w-4 h-4" />
          <span>Купити швидко</span>
        </button>
      </div>

      {/* Quick Order Modal */}
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

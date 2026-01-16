import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { productsApi } from '../api/productsApi';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch full product details for wishlist items
        const productPromises = wishlistItems.map(item => 
          productsApi.getProduct(item.productId)
        );
        const productsData = await Promise.all(productPromises);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (wishlistItems.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [wishlistItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Завантаження...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <Heart className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Список бажань порожній</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              Додайте товари до списку бажань, щоб не забути про них
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 sm:py-3 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95"
            >
              Перейти до каталогу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8" data-testid="wishlist-title">
          Список бажань <span className="text-gray-500 font-normal text-lg sm:text-2xl">({products.length} {products.length === 1 ? 'товар' : 'товарів'})</span>
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
              data-testid={`wishlist-item-${product.id}`}
            >
              {/* Product Image */}
              <div 
                className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.badges?.includes('sale') && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                      Розпродаж
                    </span>
                  )}
                  {product.badges?.includes('new') && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                      Новинка
                    </span>
                  )}
                  {product.badges?.includes('hit') && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                      Хіт
                    </span>
                  )}
                </div>

                {product.discount > 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-full font-bold">
                      −{product.discount}%
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-2">Артикул: {product.article}</div>
                <h3 
                  className="text-sm font-medium text-gray-800 mb-3 h-12 line-clamp-2 hover:text-green-600 cursor-pointer transition-colors"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  {product.oldPrice ? (
                    <>
                      <span className="text-lg font-bold text-green-600">{product.price} грн</span>
                      <span className="text-sm text-gray-400 line-through">{product.oldPrice} грн</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-green-600">{product.price} грн</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    data-testid={`add-to-cart-wishlist-${product.id}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>В кошик</span>
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 hover:bg-red-50 hover:text-red-500 transition-all"
                    data-testid={`remove-wishlist-${product.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
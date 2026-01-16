import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../api/wishlistApi';
import { toast } from 'sonner';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = 'guest';

  // Fetch wishlist on mount
  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const items = await wishlistApi.getWishlist(userId);
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  // Get wishlist item by product ID
  const getWishlistItem = (productId) => {
    return wishlistItems.find(item => item.productId === productId);
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      await wishlistApi.addToWishlist(productId, userId);
      await fetchWishlist();
      toast.success('Додано до списку бажань');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Помилка додавання до списку бажань');
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      const item = getWishlistItem(productId);
      if (item) {
        await wishlistApi.removeFromWishlist(item.id);
        await fetchWishlist();
        toast.success('Видалено зі списку бажань');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Помилка видалення зі списку бажань');
    } finally {
      setLoading(false);
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const value = {
    wishlistItems,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
    wishlistCount: wishlistItems.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
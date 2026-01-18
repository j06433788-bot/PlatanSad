import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { toast } from 'sonner';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = 'guest'; // For now, using guest user

  // Fetch cart on mount
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const items = await cartApi.getCart(userId);
      setCartItems(items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Don't show error toast on initial load, just set empty cart
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      await cartApi.addToCart(product.id, quantity, userId);
      await fetchCart(); // Refresh cart
      toast.success(`${product.name} додано до кошика!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Помилка додавання до кошика');
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setLoading(true);
      await cartApi.updateCartItem(itemId, newQuantity);
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Помилка оновлення кількості');
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId, productName) => {
    try {
      setLoading(true);
      await cartApi.removeFromCart(itemId);
      await fetchCart();
      toast.success(`${productName} видалено з кошика`);
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Помилка видалення з кошика');
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      await cartApi.clearCart(userId);
      setCartItems([]);
      // Removed toast - cart is cleared silently after order
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    cartTotal,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
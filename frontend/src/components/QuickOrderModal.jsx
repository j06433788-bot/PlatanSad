import React, { useState } from 'react';
import { X, Phone, User, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const QuickOrderModal = ({ product, isOpen, onClose, quantity = 1 }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customerName.trim()) {
      toast.error("Будь ласка, введіть ім'я");
      return;
    }
    
    if (!formData.customerPhone.trim()) {
      toast.error('Будь ласка, введіть номер телефону');
      return;
    }

    // Phone validation (simple)
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(formData.customerPhone.replace(/\s/g, ''))) {
      toast.error('Будь ласка, введіть коректний номер телефону');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/quick-order`, {
        productId: product.id,
        quantity: quantity,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        notes: formData.notes
      });

      toast.success('Замовлення успішно оформлено! Ми зв\'яжемося з вами найближчим часом.');
      
      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        notes: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating quick order:', error);
      const message = error.response?.data?.detail || 'Помилка оформлення замовлення';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          data-testid="quick-order-close-btn"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Купити швидко</h2>
              <p className="text-sm text-gray-600">Заповніть дані для швидкого замовлення</p>
            </div>
          </div>

          {/* Product info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm line-clamp-2">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-600 font-bold">{product.price} грн</span>
                {quantity > 1 && (
                  <span className="text-sm text-gray-600">× {quantity}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ім'я <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Ваше ім'я"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                data-testid="quick-order-name-input"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер телефону <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="+380 XX XXX XX XX"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                data-testid="quick-order-phone-input"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Коментар (необов'язково)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ваші побажання або запитання..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              data-testid="quick-order-notes-input"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="quick-order-submit-btn"
          >
            {loading ? 'Обробка...' : 'Замовити'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Після оформлення замовлення наш менеджер зв'яжеться з вами для підтвердження
          </p>
        </form>
      </div>
    </div>
  );
};

export default QuickOrderModal;

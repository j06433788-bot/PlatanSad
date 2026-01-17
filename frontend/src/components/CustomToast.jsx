import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { ShoppingCart, Check, Sparkles, PartyPopper, Rocket, Heart, Package } from 'lucide-react';

// Кастомні анімовані toast повідомлення
const CustomToast = ({ icon: Icon, title, description, variant = 'success' }) => {
  const variants = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      iconBg: 'bg-white/20',
      glow: 'shadow-lg shadow-green-500/50',
    },
    cart: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      iconBg: 'bg-white/20',
      glow: 'shadow-lg shadow-blue-500/50',
    },
    order: {
      bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      iconBg: 'bg-white/20',
      glow: 'shadow-lg shadow-purple-500/50',
    },
    wishlist: {
      bg: 'bg-gradient-to-r from-rose-500 to-pink-500',
      iconBg: 'bg-white/20',
      glow: 'shadow-lg shadow-rose-500/50',
    },
  };

  const v = variants[variant] || variants.success;

  return (
    <div className={`${v.bg} ${v.glow} rounded-2xl p-4 text-white min-w-[280px] animate-toast-slide`}>
      <div className="flex items-center gap-3">
        {/* Animated Icon */}
        <div className={`${v.iconBg} p-2.5 rounded-xl animate-toast-bounce`}>
          <Icon className="w-6 h-6 animate-toast-sparkle" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <p className="font-bold text-base">{title}</p>
          {description && (
            <p className="text-sm text-white/80 mt-0.5">{description}</p>
          )}
        </div>

        {/* Sparkles */}
        <div className="absolute -top-1 -right-1 animate-toast-sparkle">
          <Sparkles className="w-5 h-5 text-yellow-300" />
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute top-2 left-4 w-1 h-1 bg-white/40 rounded-full animate-float-1" />
        <div className="absolute top-4 right-8 w-1.5 h-1.5 bg-white/30 rounded-full animate-float-2" />
        <div className="absolute bottom-3 left-8 w-1 h-1 bg-white/50 rounded-full animate-float-3" />
        <div className="absolute bottom-2 right-4 w-1 h-1 bg-white/40 rounded-full animate-float-1" />
      </div>
    </div>
  );
};

// Toast functions
export const toast = {
  // Додано в кошик
  cartAdd: (productName) => {
    sonnerToast.custom(() => (
      <CustomToast
        icon={ShoppingCart}
        title="Додано в кошик! 🛒"
        description={productName}
        variant="cart"
      />
    ), {
      duration: 3000,
      position: 'top-center',
    });
  },

  // Успішне замовлення
  orderSuccess: () => {
    sonnerToast.custom(() => (
      <CustomToast
        icon={PartyPopper}
        title="Замовлення оформлено! 🎉"
        description="Очікуйте дзвінок менеджера"
        variant="order"
      />
    ), {
      duration: 4000,
      position: 'top-center',
    });
  },

  // Перенаправлення на оплату
  paymentRedirect: () => {
    sonnerToast.custom(() => (
      <CustomToast
        icon={Rocket}
        title="Переходимо до оплати! 💳"
        description="Зачекайте..."
        variant="order"
      />
    ), {
      duration: 3000,
      position: 'top-center',
    });
  },

  // Додано в список бажань
  wishlistAdd: (productName) => {
    sonnerToast.custom(() => (
      <CustomToast
        icon={Heart}
        title="Додано в бажання! ❤️"
        description={productName}
        variant="wishlist"
      />
    ), {
      duration: 3000,
      position: 'top-center',
    });
  },

  // Видалено з бажань
  wishlistRemove: () => {
    sonnerToast.custom(() => (
      <CustomToast
        icon={Heart}
        title="Видалено з бажань"
        variant="wishlist"
      />
    ), {
      duration: 2000,
      position: 'top-center',
    });
  },

  // Успіх загальний
  success: (title, description) => {
    sonnerToast.custom(() => (
      <CustomToast
        icon={Check}
        title={title}
        description={description}
        variant="success"
      />
    ), {
      duration: 3000,
      position: 'top-center',
    });
  },

  // Швидке замовлення
  quickOrder: () => {
    sonnerToast.custom(() => (
      <CustomToast
        icon={Package}
        title="Швидке замовлення! ⚡"
        description="Ми зателефонуємо вам"
        variant="order"
      />
    ), {
      duration: 4000,
      position: 'top-center',
    });
  },

  // Помилка
  error: (message) => {
    sonnerToast.error(message, {
      duration: 4000,
      position: 'top-center',
    });
  },
};

export default toast;

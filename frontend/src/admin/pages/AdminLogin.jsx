import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const { login } = useAdminAuth();

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(credentials.username, credentials.password);

    if (!result.success) {
      toast.error(result.error || 'Помилка входу');
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/admin-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 max-w-md w-full px-4">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center shadow-md mb-4">
              <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              PlatanSad
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Адміністративна панель
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Логін
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="Введіть логін"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Пароль
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="Введіть пароль"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 transition-all active:scale-[0.98] text-white font-semibold py-3 rounded-lg shadow-lg disabled:opacity-60"
            >
              {loading ? 'Вхід...' : 'Увійти'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

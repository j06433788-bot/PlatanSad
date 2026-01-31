import React, { useMemo, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const { login } = useAdminAuth();

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const bgUrl = useMemo(() => "/admin-bg.jpg", []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(credentials.username, credentials.password);
    if (!result.success) toast.error(result.error || 'Помилка входу');

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background image */}
      <div
        className="absolute inset-0 scale-[1.03] will-change-transform"
        style={{
          backgroundImage: `url('${bgUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'saturate(1.05) contrast(1.05)',
        }}
        aria-hidden="true"
      />

      {/* Premium overlay: gradient + vignette */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* main tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/35 to-emerald-950/35" />
        {/* vignette */}
        <div className="absolute inset-0"
             style={{ boxShadow: 'inset 0 0 220px rgba(0,0,0,0.65)' }} />
        {/* subtle blur layer (cheap but nice) */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl shadow-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center
                            bg-white/15 border border-white/15 shadow-lg mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white leading-tight">
              PlatanSad
            </h1>

            <p className="text-sm text-white/75 mt-1">
              Адміністративна панель
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Логін
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/55" size={18} />
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Введіть логін"
                  className="w-full pl-10 pr-4 py-3 rounded-lg
                             bg-white/10 text-white placeholder:text-white/50
                             border border-white/15 focus:border-emerald-400/60
                             focus:ring-2 focus:ring-emerald-400/30 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Пароль
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/55" size={18} />
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Введіть пароль"
                  className="w-full pl-10 pr-4 py-3 rounded-lg
                             bg-white/10 text-white placeholder:text-white/50
                             border border-white/15 focus:border-emerald-400/60
                             focus:ring-2 focus:ring-emerald-400/30 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white
                         bg-emerald-500/90 hover:bg-emerald-500
                         active:scale-[0.99] transition
                         shadow-lg shadow-emerald-500/20
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>
        </div>

        {/* tiny hint (optional, clean) */}
        <p className="text-center text-xs text-white/55 mt-4">
          Protected area • PlatanSad CMS
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

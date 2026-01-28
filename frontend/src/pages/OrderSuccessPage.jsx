import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  // Підтримка двох варіантів роуту:
  // /order-success/:id  -> params.id
  // /order-success/:orderId -> params.orderId
  const orderId = useMemo(() => params?.id || params?.orderId || '', [params]);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Якщо orderId нема — просто показуємо сторінку без падіння, і даємо кнопку на головну
    if (!orderId) {
      setLoading(false);
      setOrder(null);
      setError('');
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError('');

      try {
        // Якщо у тебе немає такого ендпоїнту — цей fetch просто впаде,
        // але сторінка НЕ крашнеться, бо ми це обробляємо.
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          // не кидаємо помилку на весь React — тільки показуємо текст
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (!cancelled) setOrder(data);
      } catch (e) {
        if (!cancelled) {
          setOrder(null);
          setError('Не вдалося завантажити деталі замовлення. Але замовлення могло бути створене успішно.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h1 className="text-2xl font-bold text-gray-900">Дякуємо! Замовлення прийнято ✅</h1>

          <p className="mt-2 text-sm text-gray-600">
            Ми зв’яжемося з вами найближчим часом для підтвердження та деталей доставки.
          </p>

          <div className="mt-4 rounded-2xl bg-gray-50 p-4 ring-1 ring-black/5">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Номер замовлення:</span>{' '}
              <span className="font-mono">{orderId || '—'}</span>
            </p>

            {loading && (
              <p className="mt-2 text-sm text-gray-500">Завантаження деталей…</p>
            )}

            {!loading && error && (
              <p className="mt-2 text-sm text-amber-700">{error}</p>
            )}

            {!loading && order && (
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                {order?.total != null && (
                  <p>
                    <span className="font-semibold">Сума:</span> {order.total} {order.currency || '₴'}
                  </p>
                )}
                {order?.status && (
                  <p>
                    <span className="font-semibold">Статус:</span> {order.status}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => navigate('/catalog')}
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-600/90 active:scale-[0.99]"
            >
              Перейти в каталог
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900/90 active:scale-[0.99]"
            >
              На головну
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  FileText,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

const emptyHero = {
  title: '',
  subtitle: '',
  button_text: '',
  button_link: '',
  background_image: ''
};

const emptyFooterLink = {
  section: '',
  title: '',
  url: '',
  order: 0,
  is_active: true
};

const normalizeBaseUrl = (u) => (u || '').replace(/\/+$/, '');

const AdminCMS = () => {
  const [pages, setPages] = useState([]);
  const [heroSection, setHeroSection] = useState(emptyHero);
  const [footerLinks, setFooterLinks] = useState([]);

  const [loading, setLoading] = useState(true);

  // Drafts (важливо: окремо від списків!)
  const [editingPageKey, setEditingPageKey] = useState(null);
  const [pageDraft, setPageDraft] = useState(null);

  const [editingHero, setEditingHero] = useState(false);
  const [heroDraft, setHeroDraft] = useState(emptyHero);

  const [editingFooterId, setEditingFooterId] = useState(null);
  const [footerDraft, setFooterDraft] = useState(emptyFooterLink);

  const [previewPageKey, setPreviewPageKey] = useState(null);
  const [pageFilter, setPageFilter] = useState('');

  const API_URL = normalizeBaseUrl(process.env.REACT_APP_BACKEND_URL || '');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    const h = { 'Content-Type': 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  };

  const apiFetch = useCallback(
    async (path, options = {}) => {
      const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;

      const mergedOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          ...(options.method && options.method !== 'GET' ? getAuthHeaders() : getAuthHeaders())
        }
      };

      let res;
      try {
        res = await fetch(url, mergedOptions);
      } catch (e) {
        throw new Error('Помилка мережі. Перевірте API_URL / сервер.');
      }

      // пробуємо прочитати JSON (але не падаємо, якщо бекенд віддав текст)
      let data = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      } else {
        // інколи бекенд віддає plain-text на помилці
        const text = await res.text().catch(() => '');
        data = text ? { message: text } : null;
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          `HTTP ${res.status} ${res.statusText || ''}`.trim();
        const err = new Error(msg);
        err.status = res.status;
        err.payload = data;
        throw err;
      }

      return data;
    },
    [API_URL]
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [pagesData, heroData, footerData] = await Promise.all([
        apiFetch('/api/cms/pages', { method: 'GET' }),
        apiFetch('/api/cms/hero', { method: 'GET' }),
        apiFetch('/api/cms/footer-links', { method: 'GET' })
      ]);

      setPages(Array.isArray(pagesData) ? pagesData : []);
      setHeroSection({ ...emptyHero, ...(heroData || {}) });
      setFooterLinks(Array.isArray(footerData) ? footerData : []);
    } catch (error) {
      console.error(error);
      toast.error(`Помилка завантаження даних: ${error.message || 'невідомо'}`);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ===================== PAGES =====================
  const startEditPage = (page) => {
    setEditingPageKey(page.page_key);
    setPageDraft({
      // копія, щоб не мутити pages[]
      id: page.id,
      page_key: page.page_key,
      title: page.title || '',
      content: page.content || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || ''
    });
    setPreviewPageKey(null);
  };

  const cancelEditPage = () => {
    setEditingPageKey(null);
    setPageDraft(null);
    setPreviewPageKey(null);
  };

  const handleSavePage = async () => {
    if (!editingPageKey || !pageDraft) return;

    try {
      await apiFetch(`/api/cms/pages/${editingPageKey}`, {
        method: 'PUT',
        body: JSON.stringify(pageDraft)
      });

      toast.success('Сторінку оновлено!');
      cancelEditPage();
      await loadData(); // важливо: підтягнути "теперішні" дані з БД
    } catch (error) {
      console.error(error);
      toast.error(`Помилка оновлення сторінки: ${error.message || 'невідомо'}`);
    }
  };

  // ===================== HERO =====================
  const startEditHero = () => {
    setEditingHero(true);
    setHeroDraft({ ...emptyHero, ...heroSection });
  };

  const cancelEditHero = () => {
    setEditingHero(false);
    setHeroDraft({ ...emptyHero });
  };

  const handleSaveHero = async () => {
    try {
      await apiFetch('/api/cms/hero', {
        method: 'PUT',
        body: JSON.stringify(heroDraft)
      });

      toast.success('Hero секцію оновлено!');
      setEditingHero(false);
      await loadData(); // актуалізація з БД
    } catch (error) {
      console.error(error);
      toast.error(`Помилка оновлення Hero: ${error.message || 'невідомо'}`);
    }
  };

  // ===================== FOOTER LINKS =====================
  const startEditFooter = (link) => {
    setEditingFooterId(link.id);
    setFooterDraft({
      section: link.section || '',
      title: link.title || '',
      url: link.url || '',
      order: Number(link.order || 0),
      is_active: !!link.is_active
    });
  };

  const cancelEditFooter = () => {
    setEditingFooterId(null);
    setFooterDraft(emptyFooterLink);
  };

  const handleSaveFooterLink = async (linkId) => {
    try {
      const updatePayload = {
        title: footerDraft.title,
        url: footerDraft.url,
        order: Number(footerDraft.order || 0),
        is_active: !!footerDraft.is_active
        // section зазвичай не міняють у редагуванні, але якщо треба — додай сюди
      };

      await apiFetch(`/api/cms/footer-links/${linkId}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload)
      });

      toast.success('Посилання у футері оновлено!');
      cancelEditFooter();
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(`Помилка оновлення посилання: ${error.message || 'невідомо'}`);
    }
  };

  const handleCreateFooterLink = async () => {
    try {
      const payload = {
        section: footerDraft.section,
        title: footerDraft.title,
        url: footerDraft.url,
        order: Number(footerDraft.order || 0),
        is_active: !!footerDraft.is_active
      };

      await apiFetch('/api/cms/footer-links', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      toast.success('Посилання у футері додано!');
      setFooterDraft(emptyFooterLink);
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(`Помилка створення посилання: ${error.message || 'невідомо'}`);
    }
  };

  const handleDeleteFooterLink = async (linkId) => {
    try {
      await apiFetch(`/api/cms/footer-links/${linkId}`, { method: 'DELETE' });

      toast.success('Посилання видалено');
      if (editingFooterId === linkId) cancelEditFooter();
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(`Помилка видалення: ${error.message || 'невідомо'}`);
    }
  };

  // ===================== MEMOS =====================
  const groupedFooterLinks = useMemo(() => {
    const grouped = footerLinks.reduce((acc, link) => {
      const sectionKey = link.section || 'Без секції';
      if (!acc[sectionKey]) acc[sectionKey] = [];
      acc[sectionKey].push(link);
      return acc;
    }, {});

    // Сортування по order усередині секції
    Object.keys(grouped).forEach((k) => {
      grouped[k] = grouped[k].slice().sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    });

    return grouped;
  }, [footerLinks]);

  const filteredPages = useMemo(() => {
    const normalizedFilter = pageFilter.trim().toLowerCase();
    if (!normalizedFilter) return pages;

    return pages.filter((page) => {
      const t = (page.title || '').toLowerCase();
      const k = (page.page_key || '').toLowerCase();
      return t.includes(normalizedFilter) || k.includes(normalizedFilter);
    });
  }, [pageFilter, pages]);

  // ===================== UI =====================
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Управління контентом</h1>
            <p className="text-gray-600 mt-1">Редагуйте тексти на сайті</p>
          </div>

          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black"
            title="Оновити дані з сервера"
          >
            Оновити
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Головна секція (Hero)</h2>

            {!editingHero ? (
              <button
                onClick={startEditHero}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Edit2 className="w-4 h-4" />
                Редагувати
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveHero}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Save className="w-4 h-4" />
                  Зберегти
                </button>
                <button
                  onClick={async () => {
                    cancelEditHero();
                    await loadData();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  title="Скасувати"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {editingHero ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                <input
                  type="text"
                  value={heroDraft.title}
                  onChange={(e) => setHeroDraft({ ...heroDraft, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Підзаголовок</label>
                <input
                  type="text"
                  value={heroDraft.subtitle || ''}
                  onChange={(e) => setHeroDraft({ ...heroDraft, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Текст кнопки</label>
                <input
                  type="text"
                  value={heroDraft.button_text || ''}
                  onChange={(e) => setHeroDraft({ ...heroDraft, button_text: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Посилання кнопки</label>
                <input
                  type="text"
                  value={heroDraft.button_link || ''}
                  onChange={(e) => setHeroDraft({ ...heroDraft, button_link: e.target.value })}
                  placeholder="/catalog"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Фонова картинка (URL)</label>
                <input
                  type="text"
                  value={heroDraft.background_image || ''}
                  onChange={(e) => setHeroDraft({ ...heroDraft, background_image: e.target.value })}
                  placeholder="https://"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Заголовок:</strong> {heroSection?.title}
              </p>
              <p className="text-gray-700">
                <strong>Підзаголовок:</strong> {heroSection?.subtitle}
              </p>
              <p className="text-gray-700">
                <strong>Кнопка:</strong> {heroSection?.button_text}
              </p>
              <p className="text-gray-700">
                <strong>Посилання:</strong> {heroSection?.button_link || '—'}
              </p>
              <p className="text-gray-700">
                <strong>Фонова картинка:</strong> {heroSection?.background_image || '—'}
              </p>
            </div>
          )}
        </div>

        {/* Pages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Сторінки сайту</h2>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={pageFilter}
                onChange={(e) => setPageFilter(e.target.value)}
                placeholder="Пошук сторінки..."
                className="w-full lg:w-72 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPages.map((page) => {
              const isEditing = editingPageKey === page.page_key;

              return (
                <div key={page.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <h3 className="font-bold text-lg">{page.title}</h3>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => startEditPage(page)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Редагувати
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setPreviewPageKey(previewPageKey === page.page_key ? null : page.page_key)
                          }
                          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
                        >
                          {previewPageKey === page.page_key ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          {previewPageKey === page.page_key ? 'Сховати превʼю' : 'Превʼю'}
                        </button>

                        <button
                          onClick={handleSavePage}
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Зберегти
                        </button>

                        <button
                          onClick={async () => {
                            cancelEditPage();
                            await loadData();
                          }}
                          className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                          title="Скасувати"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                        <input
                          type="text"
                          value={pageDraft?.title || ''}
                          onChange={(e) => setPageDraft((p) => ({ ...p, title: e.target.value }))}
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Контент (HTML)
                        </label>
                        <textarea
                          value={pageDraft?.content || ''}
                          onChange={(e) => setPageDraft((p) => ({ ...p, content: e.target.value }))}
                          rows={10}
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Символів: {pageDraft?.content?.length || 0}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Description
                        </label>
                        <input
                          type="text"
                          value={pageDraft?.meta_description || ''}
                          onChange={(e) =>
                            setPageDraft((p) => ({ ...p, meta_description: e.target.value }))
                          }
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Keywords
                        </label>
                        <input
                          type="text"
                          value={pageDraft?.meta_keywords || ''}
                          onChange={(e) =>
                            setPageDraft((p) => ({ ...p, meta_keywords: e.target.value }))
                          }
                          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {previewPageKey === page.page_key && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-700">Превʼю контенту</p>
                            <a
                              href={`/${page.page_key}`}
                              className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Переглянути на сайті
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>

                          <div
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: pageDraft?.content || '' }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        <strong>Сторінка:</strong> /{page.page_key}
                      </p>
                      <p>
                        <strong>Останнє оновлення:</strong>{' '}
                        {page.updated_at ? new Date(page.updated_at).toLocaleString('uk-UA') : '—'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredPages.length === 0 && (
              <p className="text-gray-500 text-sm">Немає сторінок, що відповідають фільтру.</p>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Footer посилання</h2>
          </div>

          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-3">Додати нове посилання</h3>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <input
                type="text"
                value={footerDraft.section}
                onChange={(e) => setFooterDraft({ ...footerDraft, section: e.target.value })}
                placeholder="Секція (наприклад, Компанія)"
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                value={footerDraft.title}
                onChange={(e) => setFooterDraft({ ...footerDraft, title: e.target.value })}
                placeholder="Назва"
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                value={footerDraft.url}
                onChange={(e) => setFooterDraft({ ...footerDraft, url: e.target.value })}
                placeholder="/delivery"
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                value={footerDraft.order}
                onChange={(e) => setFooterDraft({ ...footerDraft, order: Number(e.target.value) })}
                placeholder="Порядок"
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={footerDraft.is_active}
                  onChange={(e) => setFooterDraft({ ...footerDraft, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-500"
                />
                Активне посилання
              </label>

              <button
                onClick={handleCreateFooterLink}
                disabled={!footerDraft.section || !footerDraft.title || !footerDraft.url}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Додати
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedFooterLinks).map(([section, links]) => (
              <div key={section} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">{section}</h3>

                <div className="space-y-3">
                  {links.map((link) => (
                    <div key={link.id} className="flex flex-col gap-3 border rounded-lg p-3">
                      {editingFooterId === link.id ? (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          <div className="text-sm text-gray-600">
                            <p className="font-semibold">Секція</p>
                            <p>{link.section}</p>
                          </div>

                          <input
                            type="text"
                            value={footerDraft.title}
                            onChange={(e) => setFooterDraft({ ...footerDraft, title: e.target.value })}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />

                          <input
                            type="text"
                            value={footerDraft.url}
                            onChange={(e) => setFooterDraft({ ...footerDraft, url: e.target.value })}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />

                          <input
                            type="number"
                            value={footerDraft.order}
                            onChange={(e) => setFooterDraft({ ...footerDraft, order: Number(e.target.value) })}
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />

                          <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={footerDraft.is_active}
                              onChange={(e) => setFooterDraft({ ...footerDraft, is_active: e.target.checked })}
                              className="h-4 w-4 text-blue-500"
                            />
                            Активне
                          </label>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveFooterLink(link.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                            >
                              <Save className="w-4 h-4" />
                              Зберегти
                            </button>

                            <button
                              onClick={cancelEditFooter}
                              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                            >
                              Скасувати
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div className="text-sm text-gray-700 space-y-1">
                            <p>
                              <strong>Назва:</strong> {link.title}
                            </p>
                            <p>
                              <strong>URL:</strong> {link.url}
                            </p>
                            <p>
                              <strong>Порядок:</strong> {link.order}
                            </p>
                            <p>
                              <strong>Статус:</strong> {link.is_active ? 'Активне' : 'Неактивне'}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditFooter(link)}
                              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                              <Edit2 className="w-4 h-4" />
                              Редагувати
                            </button>

                            <button
                              onClick={() => handleDeleteFooterLink(link.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              Видалити
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {footerLinks.length === 0 && (
              <p className="text-gray-500 text-sm">Немає посилань у футері.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCMS;

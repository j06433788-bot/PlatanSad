import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { FileText, Edit2, Save, X, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const AdminCMS = () => {
  const [pages, setPages] = useState([]);
  const [heroSection, setHeroSection] = useState(null);
  const [footerLinks, setFooterLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [editingHero, setEditingHero] = useState(false);

  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  // Завантаження даних
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Завантажити сторінки
      const pagesRes = await fetch(`${API_URL}/api/cms/pages`);
      const pagesData = await pagesRes.json();
      setPages(pagesData);

      // Завантажити hero
      const heroRes = await fetch(`${API_URL}/api/cms/hero`);
      const heroData = await heroRes.json();
      setHeroSection(heroData);

      // Завантажити footer links
      const footerRes = await fetch(`${API_URL}/api/cms/footer-links`);
      const footerData = await footerRes.json();
      setFooterLinks(footerData);

    } catch (error) {
      toast.error('Помилка завантаження даних');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Редагування сторінки
  const handleSavePage = async (pageKey) => {
    try {
      const response = await fetch(`${API_URL}/api/cms/pages/${pageKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPage)
      });

      if (response.ok) {
        toast.success('Сторінку оновлено!');
        setEditingPage(null);
        loadData();
      } else {
        toast.error('Помилка оновлення');
      }
    } catch (error) {
      toast.error('Помилка збереження');
      console.error(error);
    }
  };

  // Редагування Hero
  const handleSaveHero = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cms/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroSection)
      });

      if (response.ok) {
        toast.success('Hero секцію оновлено!');
        setEditingHero(false);
        loadData();
      } else {
        toast.error('Помилка оновлення');
      }
    } catch (error) {
      toast.error('Помилка збереження');
      console.error(error);
    }
  };

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
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Головна секція (Hero)</h2>
            {!editingHero ? (
              <button
                onClick={() => setEditingHero(true)}
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
                  onClick={() => {
                    setEditingHero(false);
                    loadData();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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
                  value={heroSection.title}
                  onChange={(e) => setHeroSection({ ...heroSection, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Підзаголовок</label>
                <input
                  type="text"
                  value={heroSection.subtitle || ''}
                  onChange={(e) => setHeroSection({ ...heroSection, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Текст кнопки</label>
                <input
                  type="text"
                  value={heroSection.button_text || ''}
                  onChange={(e) => setHeroSection({ ...heroSection, button_text: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Заголовок:</strong> {heroSection?.title}</p>
              <p className="text-gray-700"><strong>Підзаголовок:</strong> {heroSection?.subtitle}</p>
              <p className="text-gray-700"><strong>Кнопка:</strong> {heroSection?.button_text}</p>
            </div>
          )}
        </div>

        {/* Pages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Сторінки сайту</h2>
          <div className="space-y-4">
            {pages.map(page => (
              <div key={page.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-lg">{page.title}</h3>
                  </div>
                  {editingPage?.page_key !== page.page_key ? (
                    <button
                      onClick={() => setEditingPage(page)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Редагувати
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSavePage(page.page_key)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        <Save className="w-4 h-4" />
                        Зберегти
                      </button>
                      <button
                        onClick={() => setEditingPage(null)}
                        className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {editingPage?.page_key === page.page_key ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                      <input
                        type="text"
                        value={editingPage.title}
                        onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Контент (HTML)</label>
                      <textarea
                        value={editingPage.content}
                        onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                        rows={10}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <input
                        type="text"
                        value={editingPage.meta_description || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p className="mb-2"><strong>Сторінка:</strong> /{page.page_key}</p>
                    <p><strong>Останнє оновлення:</strong> {new Date(page.updated_at).toLocaleString('uk-UA')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCMS;

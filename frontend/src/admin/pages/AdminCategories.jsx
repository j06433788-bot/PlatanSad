import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../api/adminApi';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    count: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Помилка завантаження категорій');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
        count: category.count
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        icon: '',
        count: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success('Категорію оновлено');
      } else {
        await createCategory(formData);
        toast.success('Категорію створено');
      }
      closeModal();
      loadCategories();
    } catch (error) {
      toast.error('Помилка збереження категорії');
      console.error(error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю категорію?')) return;

    try {
      await deleteCategory(categoryId);
      toast.success('Категорію видалено');
      loadCategories();
    } catch (error) {
      toast.error('Помилка видалення категорії');
      console.error(error);
    }
  };

  // Popular category icons
  const iconOptions = [
    { value: '🌲', label: 'Ялинка' },
    { value: '🌿', label: 'Листя' },
    { value: '🌳', label: 'Дерево' },
    { value: '🌺', label: 'Квітка' },
    { value: '🌱', label: 'Росток' },
    { value: '🍃', label: 'Листочок' },
    { value: '🌾', label: 'Колосок' },
    { value: '🌻', label: 'Соняшник' },
    { value: '🌹', label: 'Троянда' },
    { value: '🏵️', label: 'Розетка' },
    { value: '🌵', label: 'Кактус' },
    { value: '🌴', label: 'Пальма' }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Категорії</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Управління категоріями товарів
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            data-testid="add-category-btn"
          >
            <Plus size={20} className="mr-2" />
            Додати категорію
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              data-testid={`category-card-${category.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{category.icon || '📁'}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.count} товарів
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(category)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  data-testid={`edit-category-${category.id}`}
                >
                  <Edit size={16} className="mr-1" />
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  data-testid={`delete-category-${category.id}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <FolderTree className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 dark:text-gray-400">Категорій не знайдено</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingCategory ? 'Редагувати категорію' : 'Додати категорію'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Назва категорії *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Наприклад: Хвойні рослини"
                  required
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Іконка *
                </label>
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {iconOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: option.value })}
                      className={`p-3 text-2xl rounded-lg border-2 transition-colors ${
                        formData.icon === option.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                      }`}
                      title={option.label}
                    >
                      {option.value}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Або введіть свій емодзі"
                  required
                />
              </div>

              {/* Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Кількість товарів
                </label>
                <input
                  type="number"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Буде автоматично оновлюватися при додаванні товарів
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  data-testid="save-category-btn"
                >
                  {editingCategory ? 'Оновити' : 'Створити'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 rounded-lg transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;

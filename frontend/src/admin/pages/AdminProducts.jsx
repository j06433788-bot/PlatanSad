import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getAllCategories, uploadImage } from '../api/adminApi';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  X,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    article: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    image: '',
    category: '',
    badges: [],
    description: '',
    stock: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Помилка завантаження даних');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Виберіть файл зображення');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(file);
      setFormData({ ...formData, image: result.url });
      toast.success('Зображення завантажено');
    } catch (error) {
      toast.error('Помилка завантаження зображення');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        article: product.article,
        price: product.price,
        oldPrice: product.oldPrice || 0,
        discount: product.discount || 0,
        image: product.image,
        category: product.category,
        badges: product.badges || [],
        description: product.description,
        stock: product.stock
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        article: '',
        price: 0,
        oldPrice: 0,
        discount: 0,
        image: '',
        category: '',
        badges: [],
        description: '',
        stock: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success('Товар оновлено');
      } else {
        await createProduct(formData);
        toast.success('Товар створено');
      }
      closeModal();
      loadData();
    } catch (error) {
      toast.error('Помилка збереження товару');
      console.error(error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей товар?')) return;

    try {
      await deleteProduct(productId);
      toast.success('Товар видалено');
      loadData();
    } catch (error) {
      toast.error('Помилка видалення товару');
      console.error(error);
    }
  };

  const toggleBadge = (badge) => {
    setFormData({
      ...formData,
      badges: formData.badges.includes(badge)
        ? formData.badges.filter(b => b !== badge)
        : [...formData.badges, badge]
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.article.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Товари</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Управління товарами магазину
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            data-testid="add-product-btn"
          >
            <Plus size={20} className="mr-2" />
            Додати товар
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Пошук за назвою або артикулом"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Всі категорії</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              data-testid={`product-card-${product.id}`}
            >
              <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {!product.image && (
                  <div className="flex items-center justify-center h-full">
                    <Package className="text-gray-400" size={48} />
                  </div>
                )}
                {product.badges && product.badges.length > 0 && (
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {product.badges.map(badge => (
                      <span
                        key={badge}
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          badge === 'hit' ? 'bg-red-500 text-white' :
                          badge === 'sale' ? 'bg-orange-500 text-white' :
                          'bg-green-500 text-white'
                        }`}
                      >
                        {badge === 'hit' ? 'ХІТ' : badge === 'sale' ? 'РОЗПРОДАЖ' : 'НОВИНКА'}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Артикул: {product.article}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {product.price} грн
                    </span>
                    {product.oldPrice && product.oldPrice > 0 && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {product.oldPrice} грн
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  На складі: <span className={product.stock < 10 ? 'text-red-500 font-medium' : 'font-medium'}>{product.stock}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(product)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    data-testid={`edit-product-${product.id}`}
                  >
                    <Edit size={16} className="mr-1" />
                    Редагувати
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    data-testid={`delete-product-${product.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 dark:text-gray-400">Товарів не знайдено</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Редагувати товар' : 'Додати товар'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Зображення
                </label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <div className="relative w-32 h-32 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      <img
                        src={process.env.REACT_APP_BACKEND_URL + formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer transition-colors">
                    <Upload size={20} className="mr-2" />
                    {uploading ? 'Завантаження...' : 'Завантажити'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Назва *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Article */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Артикул *
                </label>
                <input
                  type="text"
                  value={formData.article}
                  onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Price & Old Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ціна (грн) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Стара ціна (грн)
                  </label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Stock & Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Кількість на складі *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Знижка (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Категорія *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Оберіть категорію</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Badges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Бейджі
                </label>
                <div className="flex gap-2">
                  {['hit', 'sale', 'new'].map(badge => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleBadge(badge)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        formData.badges.includes(badge)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {badge === 'hit' ? 'ХІТ' : badge === 'sale' ? 'РОЗПРОДАЖ' : 'НОВИНКА'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Опис *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  data-testid="save-product-btn"
                >
                  {editingProduct ? 'Оновити' : 'Створити'}
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

export default AdminProducts;

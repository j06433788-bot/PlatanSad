import React, { useState, useEffect } from 'react';
import { Save, Phone, MapPin, Clock, Instagram, Globe, Image as ImageIcon, FileText, Palette, CreditCard, Mail, Tag, Zap, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'sonner';
import { getSiteSettings, saveSiteSettings } from '../api/adminApi';
import { useSettings } from '../../context/SettingsContext';

const AdminSiteSettings = () => {
  const { theme } = useTheme();
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contacts');
  
  const [settings, setSettings] = useState({
    // Контакти
    phone1: '+380 (63) 650-74-49',
    phone2: '+380 (95) 251-03-47',
    email: 'info@platansad.ua',
    viber: '+380636507449',
    address: 'смт. Смига, вул. Садова, 15',
    workingHours: 'Пн-Сб: 9:00-18:00',
    weekend: 'Нд: вихідний',
    
    // Соцмережі
    instagram: 'https://www.instagram.com/platansad.uaa?igsh=cmhhbG4zbjNkMTBr',
    tiktok: 'https://www.tiktok.com/@platansad.ua?_r=1&_t=ZM-939QCCJ5tAx',
    facebook: '',
    youtube: '',
    
    // SEO
    siteName: 'PlatanSad',
    siteDescription: 'Професійний розсадник рослин в Україні',
    siteKeywords: 'розсадник, рослини, туя, бонсай, хвойні',
    
    // Hero слайдер
    heroSlides: [
      { id: 1, image: 'https://images.unsplash.com/photo-1494825514961-674db1ac2700', title: 'PlatanSad', subtitle: 'Професійний розсадник рослин', active: true },
      { id: 2, image: 'https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg', title: 'Бонсай Нівакі', subtitle: 'Японський стиль для вашого саду', active: true },
      { id: 3, image: 'https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg', title: 'Туя Смарагд', subtitle: 'Ідеальний живопліт', active: true },
      { id: 4, image: 'https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg', title: 'Хвойні рослини', subtitle: 'Вічнозелена краса', active: true },
    ],
    
    // Банери
    topBanner: { text: '🎉 Знижка 20% на всі туї до кінця місяця!', active: false, color: '#10b981' },
    
    // Оплата та доставка
    deliveryText: 'Ми працюємо з Новою Поштою. Безкоштовна доставка при замовленні від 1000₴.',
    paymentText: 'Приймаємо оплату: накладений платіж, LiqPay (Visa/Mastercard).',
    returnPolicy: 'Повернення та обмін товару протягом 14 днів.',
    
    // Знижки
    freeDeliveryFrom: 1000,
    firstOrderDiscount: 0,
    bulkOrderDiscount: 0,
    
    // Кольорова схема
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    accentColor: '#f59e0b',
    
    // Email налаштування
    orderNotificationEmail: 'orders@platansad.ua',
    supportEmail: 'support@platansad.ua',
    
    // Загальні
    currency: '₴',
    language: 'uk',
    timezone: 'Europe/Kiev',
    showStock: true,
    showReviews: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setInitialLoading(true);
    try {
      const data = await getSiteSettings();
      if (data.settings_data) {
        setSettings(data.settings_data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Помилка завантаження налаштувань');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveSiteSettings(settings);
      // Refresh public settings context
      refreshSettings();
      toast.success('✅ Налаштування успішно збережені!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('❌ Помилка збереження');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const updateSlide = (index, field, value) => {
    const newSlides = [...settings.heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSettings(prev => ({ ...prev, heroSlides: newSlides }));
  };

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      image: '',
      title: 'Новий слайд',
      subtitle: 'Опис слайду',
      active: true
    };
    setSettings(prev => ({ ...prev, heroSlides: [...prev.heroSlides, newSlide] }));
  };

  const deleteSlide = (index) => {
    setSettings(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'contacts', label: '📞 Контакти', icon: Phone },
    { id: 'social', label: '🌐 Соцмережі', icon: Globe },
    { id: 'hero', label: '🖼️ Hero слайдер', icon: ImageIcon },
    { id: 'content', label: '📝 Контент', icon: FileText },
    { id: 'payments', label: '💳 Оплата', icon: CreditCard },
    { id: 'design', label: '🎨 Дизайн', icon: Palette },
    { id: 'promo', label: '🎁 Акції', icon: Tag },
    { id: 'advanced', label: '⚙️ Додатково', icon: Zap },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'contacts':
        return (
          <div className="space-y-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Контактна інформація
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Телефон 1
                  </label>
                  <input
                    type="text"
                    value={settings.phone1}
                    onChange={(e) => handleChange('phone1', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Телефон 2
                  </label>
                  <input
                    type="text"
                    value={settings.phone2}
                    onChange={(e) => handleChange('phone2', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Viber
                  </label>
                  <input
                    type="text"
                    value={settings.viber}
                    onChange={(e) => handleChange('viber', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Адреса розсадника
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Графік роботи
                  </label>
                  <input
                    type="text"
                    value={settings.workingHours}
                    onChange={(e) => handleChange('workingHours', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Вихідні
                  </label>
                  <input
                    type="text"
                    value={settings.weekend}
                    onChange={(e) => handleChange('weekend', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                SEO налаштування
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Назва сайту
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Опис сайту
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Ключові слова (через кому)
                  </label>
                  <input
                    type="text"
                    value={settings.siteKeywords}
                    onChange={(e) => handleChange('siteKeywords', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Соціальні мережі
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  TikTok URL
                </label>
                <input
                  type="url"
                  value={settings.tiktok}
                  onChange={(e) => handleChange('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/..."
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Facebook URL (опціонально)
                </label>
                <input
                  type="url"
                  value={settings.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  YouTube URL (опціонально)
                </label>
                <input
                  type="url"
                  value={settings.youtube}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-6">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Hero слайдер ({settings.heroSlides.length} слайдів)
                </h2>
                <button
                  onClick={addSlide}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Додати слайд
                </button>
              </div>
              <div className="space-y-4">
                {settings.heroSlides.map((slide, index) => (
                  <div key={slide.id} className={`p-4 border-2 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Слайд #{index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={slide.active}
                            onChange={(e) => updateSlide(index, 'active', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Активний</span>
                        </label>
                        {settings.heroSlides.length > 1 && (
                          <button
                            onClick={() => deleteSlide(index)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            Видалити
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          URL зображення
                        </label>
                        <input
                          type="url"
                          value={slide.image}
                          onChange={(e) => updateSlide(index, 'image', e.target.value)}
                          className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Заголовок
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(index, 'title', e.target.value)}
                          className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Підзаголовок
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                          className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Banner */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Верхній банер (акційний)
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.topBanner.active}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      topBanner: { ...prev.topBanner, active: e.target.checked }
                    }))}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Показувати банер</span>
                </label>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Текст банеру
                  </label>
                  <input
                    type="text"
                    value={settings.topBanner.text}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      topBanner: { ...prev.topBanner, text: e.target.value }
                    }))}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Колір банеру
                  </label>
                  <input
                    type="color"
                    value={settings.topBanner.color}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      topBanner: { ...prev.topBanner, color: e.target.value }
                    }))}
                    className="w-20 h-10 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Тексти сторінок
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Доставка (короткий опис)
                </label>
                <textarea
                  value={settings.deliveryText}
                  onChange={(e) => handleChange('deliveryText', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Оплата (короткий опис)
                </label>
                <textarea
                  value={settings.paymentText}
                  onChange={(e) => handleChange('paymentText', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Політика повернення
                </label>
                <textarea
                  value={settings.returnPolicy}
                  onChange={(e) => handleChange('returnPolicy', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Налаштування оплати та доставки
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Безкоштовна доставка від (₴)
                </label>
                <input
                  type="number"
                  value={settings.freeDeliveryFrom}
                  onChange={(e) => handleChange('freeDeliveryFrom', Number(e.target.value))}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email для сповіщень про замовлення
                </label>
                <input
                  type="email"
                  value={settings.orderNotificationEmail}
                  onChange={(e) => handleChange('orderNotificationEmail', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email підтримки
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
          </div>
        );

      case 'design':
        return (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Кольорова схема
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Основний колір
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-16 h-10 rounded"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className={`flex-1 px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Вторинний колір
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="w-16 h-10 rounded"
                    />
                    <input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className={`flex-1 px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Акцентний колір
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="w-16 h-10 rounded"
                    />
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className={`flex-1 px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Попередній перегляд:</p>
                <div className="flex gap-2">
                  <div style={{ backgroundColor: settings.primaryColor }} className="w-20 h-20 rounded-lg shadow-md"></div>
                  <div style={{ backgroundColor: settings.secondaryColor }} className="w-20 h-20 rounded-lg shadow-md"></div>
                  <div style={{ backgroundColor: settings.accentColor }} className="w-20 h-20 rounded-lg shadow-md"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'promo':
        return (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Знижки та акції
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Знижка на перше замовлення (%)
                </label>
                <input
                  type="number"
                  value={settings.firstOrderDiscount}
                  onChange={(e) => handleChange('firstOrderDiscount', Number(e.target.value))}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Знижка на оптові замовлення (%)
                </label>
                <input
                  type="number"
                  value={settings.bulkOrderDiscount}
                  onChange={(e) => handleChange('bulkOrderDiscount', Number(e.target.value))}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Додаткові налаштування
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Валюта
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="₴">₴ (Гривня)</option>
                    <option value="$">$ (Долар)</option>
                    <option value="€">€ (Євро)</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Мова
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="uk">Українська</option>
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Часовий пояс
                  </label>
                  <input
                    type="text"
                    value={settings.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showStock}
                    onChange={(e) => handleChange('showStock', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Показувати залишки товару</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showReviews}
                    onChange={(e) => handleChange('showReviews', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Включити відгуки на товари</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (initialLoading) {
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
      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Налаштування сайту
            </h1>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Збереження...' : 'Зберегти все'}
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-md'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {renderTabContent()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSiteSettings;
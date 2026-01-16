import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, X, Menu, Phone, Info, Truck, RefreshCw, MapPin, BookOpen, GitCompare, Clock, Trees, TreePine, Leaf, Circle, Flower2, Flower, Sprout, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { categoriesApi } from '../api/categoriesApi';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartCount, clearCart, cartTotal } = useCart();
  const { wishlistCount } = useWishlist();

  // Structured categories with subcategories based on platansad.prom.ua
  const categoriesStructure = [
    {
      id: 'cat-001',
      name: 'Бонсай Нівакі',
      icon: 'bonsai',
      subcategories: [
        { id: 'sub-001-1', name: 'Pinus sylvestris (Сосна звичайна)', count: 101 },
        { id: 'sub-001-2', name: 'Нівакі на штамбі', count: 15 },
        { id: 'sub-001-3', name: 'Топіари формовані', count: 25 },
      ]
    },
    {
      id: 'cat-002',
      name: 'Туя',
      icon: 'thuja',
      subcategories: [
        { id: 'sub-002-1', name: 'Туя Колумна (Columna)', count: 13 },
        { id: 'sub-002-2', name: 'Туя Смарагд (Smaragd)', count: 23 },
        { id: 'sub-002-3', name: 'Куляста Туя Глобоса (Globosa)', count: 6 },
        { id: 'sub-002-4', name: 'Туя карликова', count: 8 },
        { id: 'sub-002-5', name: 'Топіари з туї', count: 12 },
      ]
    },
    {
      id: 'cat-003',
      name: 'Самшит',
      icon: 'boxwood',
      subcategories: [
        { id: 'sub-003-1', name: 'Самшит Арборесценс', count: 33 },
        { id: 'sub-003-2', name: 'Топіари з самшиту', count: 15 },
        { id: 'sub-003-3', name: 'Самшит формований', count: 10 },
      ]
    },
    {
      id: 'cat-004',
      name: 'Хвойні рослини',
      icon: 'conifer',
      subcategories: [
        { id: 'sub-004-1', name: 'Ялина', count: 20 },
        { id: 'sub-004-2', name: 'Ялиця біла', count: 8 },
        { id: 'sub-004-3', name: 'Зебріна голд', count: 5 },
        { id: 'sub-004-4', name: 'Ельвангера', count: 7 },
        { id: 'sub-004-5', name: 'Інші хвойні', count: 7 },
      ]
    },
    {
      id: 'cat-005',
      name: 'Листопадні дерева та кущі',
      icon: 'deciduous',
      subcategories: [
        { id: 'sub-005-1', name: 'Катальпа (Catalpa)', count: 4 },
        { id: 'sub-005-2', name: 'Верба Хакуро Нішікі', count: 12 },
        { id: 'sub-005-3', name: 'Спіралі формовані', count: 15 },
        { id: 'sub-005-4', name: 'Інші листопадні', count: 16 },
      ]
    },
    {
      id: 'cat-006',
      name: 'Кімнатні рослини',
      icon: 'indoor',
      subcategories: [
        { id: 'sub-006-1', name: 'Декоративні рослини', count: 21 },
      ]
    },
  ];

  // Fetch categories for burger menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Get icon for category based on type
  const getCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'bonsai':
        return <Trees className="w-5 h-5" />;
      case 'thuja':
        return <TreePine className="w-5 h-5" />;
      case 'boxwood':
        return <Leaf className="w-5 h-5" />;
      case 'conifer':
        return <TreePine className="w-5 h-5" />;
      case 'deciduous':
        return <Trees className="w-5 h-5" />;
      case 'indoor':
        return <Flower className="w-5 h-5" />;
      default:
        return <Sprout className="w-5 h-5" />;
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
        {/* Main header */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-5 md:py-6 lg:py-8">
            <div className="flex items-center justify-between w-full">
              {/* Left - Menu & Search (mobile) / Search only (desktop) */}
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                {/* Burger menu - mobile only - Extra large touch target */}
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="p-3 md:p-2 text-gray-600 hover:text-green-500 transition-colors hover:bg-gray-100 rounded-full md:hidden active:scale-95"
                  data-testid="menu-toggle"
                  aria-label="Відкрити меню"
                >
                  <Menu className="w-7 h-7 md:w-6 md:h-6" />
                </button>
                
                {/* Search icon - Extra large touch target */}
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-3 md:p-2 text-gray-600 hover:text-green-500 transition-colors hover:bg-gray-100 rounded-full active:scale-95"
                  data-testid="search-toggle"
                  aria-label="Пошук"
                >
                  <Search className="w-7 h-7 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Center - Logo - Extra large */}
              <div 
                className="flex items-center gap-0.5 sm:gap-1 md:gap-2 cursor-pointer active:scale-95 transition-transform flex-1 justify-center md:justify-center"
                onClick={() => navigate('/')}
              >
                <img 
                  src="/logo.webp" 
                  alt="PlatanSad Logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain mix-blend-multiply"
                  style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
                />
                <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                  Platan<span className="text-green-500">Sad</span>
                </span>
              </div>

              {/* Right - Wishlist & Cart - Larger touch targets */}
              <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                {/* Wishlist - Extra large touch area */}
                <button 
                  onClick={() => navigate('/wishlist')}
                  className={`p-3 md:p-2 transition-all duration-300 rounded-full relative active:scale-95 ${
                    wishlistCount > 0 
                      ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
                      : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100 cursor-default'
                  }`}
                  data-testid="wishlist-icon"
                  aria-label="Список бажань"
                  disabled={wishlistCount === 0}
                >
                  <Heart 
                    className={`w-7 h-7 md:w-6 md:h-6 transition-all duration-300 ${
                      wishlistCount > 0 ? 'fill-red-500' : ''
                    }`} 
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 md:-top-1 md:-right-1 bg-red-500 text-white text-xs min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center font-bold animate-pulse shadow-md">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart - Extra large touch area - Opens side panel */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="p-3 md:p-2 text-gray-600 hover:text-green-500 transition-colors hover:bg-gray-100 rounded-full relative active:scale-95"
                  data-testid="cart-icon"
                  aria-label="Кошик"
                >
                  <div className="relative">
                    <ShoppingBag className="w-7 h-7 md:w-6 md:h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center font-bold shadow-md" data-testid="cart-count">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - desktop only */}
        <nav className="bg-[#2d2d39] text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-2 md:py-3">
              <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm">
                <button onClick={() => navigate('/about')} className="hover:text-green-400 transition-colors whitespace-nowrap">Про нас</button>
                <button onClick={() => navigate('/delivery')} className="hover:text-green-400 transition-colors whitespace-nowrap">Оплата і доставка</button>
                <button onClick={() => navigate('/return')} className="hover:text-green-400 transition-colors whitespace-nowrap">Обмін та повернення</button>
                <button onClick={() => navigate('/contacts')} className="hover:text-green-400 transition-colors whitespace-nowrap">Контакти</button>
                <button onClick={() => navigate('/blog')} className="hover:text-green-400 transition-colors whitespace-nowrap">Блог</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Slide-out Menu */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-0 left-0 h-full w-[92vw] max-w-[400px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="bg-green-500 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <img src="/logo.webp" alt="PlatanSad" className="w-9 h-9 bg-white rounded-full p-0.5" />
              <span className="font-bold text-lg">PlatanSad</span>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items - Scrollable */}
          <div className="flex-1 overflow-y-auto py-1">
            {/* Categories Section */}
            <div className="px-4 py-3 bg-green-50 border-b border-green-100">
              <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide">Категорії товарів</h3>
            </div>
            
            {/* Categories with Subcategories */}
            {categoriesStructure.map((category) => (
              <div key={category.id} className="border-b border-gray-100">
                {/* Main Category Button */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors group"
                >
                  <div className="text-green-500 group-hover:text-green-600 transition-colors">
                    {getCategoryIcon(category.icon)}
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <div className="text-gray-400 group-hover:text-green-600 transition-all">
                    {expandedCategories[category.id] ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Subcategories - Collapsible */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedCategories[category.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-gray-50">
                    {category.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => {
                          navigate(`/catalog?search=${encodeURIComponent(subcategory.name)}`);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 pl-12 pr-4 py-2.5 text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors text-left"
                      >
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" />
                        <span className="text-sm flex-1">{subcategory.name}</span>
                        <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full">
                          {subcategory.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="border-t-4 border-gray-200 my-3" />

            {/* Про нас */}
            <button
              onClick={() => {
                navigate('/about');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <Info className="w-5 h-5" />
              <span className="font-medium text-sm">Про нас</span>
            </button>

            {/* Оплата і доставка */}
            <button
              onClick={() => {
                navigate('/delivery');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <Truck className="w-5 h-5" />
              <span className="font-medium text-sm">Оплата і доставка</span>
            </button>

            {/* Обмін та повернення */}
            <button
              onClick={() => {
                navigate('/return');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium text-sm">Обмін та повернення</span>
            </button>

            {/* Контактна інформація */}
            <button
              onClick={() => {
                navigate('/contacts');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium text-sm">Контакти</span>
            </button>

            {/* Блог */}
            <button
              onClick={() => {
                navigate('/blog');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium text-sm">Блог</span>
            </button>

            {/* Порівняння товарів */}
            <button
              onClick={() => {
                navigate('/compare');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-500 transition-colors"
            >
              <GitCompare className="w-5 h-5" />
              <span className="font-medium text-sm">Порівняння</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2" />

            {/* Контактні номери */}
            <div className="px-4 py-2">
              <a href="tel:+380636507449" className="flex items-center gap-3 text-gray-700 py-2 hover:text-green-500">
                <img src="/viber.png" alt="Viber" className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">+380 (63) 650-74-49</span>
                  <span className="text-xs text-gray-500">Анастасія</span>
                </div>
              </a>
              <a href="tel:+380952510347" className="flex items-center gap-3 text-gray-700 py-2 hover:text-green-500">
                <img src="/vodafone.png" alt="Vodafone" className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">+380 (95) 251-03-47</span>
                  <span className="text-xs text-gray-500">Ігор</span>
                </div>
              </a>
            </div>

            {/* Графік роботи */}
            <div className="px-4 py-2">
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Пн-Нд: 8:00 - 20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer with Social Icons */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Ми в соц мережах</p>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a 
                href="https://instagram.com/platansad.ua.rezerv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
              >
                <img src="/instagram.png" alt="Instagram" className="w-11 h-11 rounded-full" />
              </a>
              
              {/* TikTok */}
              <a 
                href="https://tiktok.com/@platansad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
              >
                <img src="/tiktok.png" alt="TikTok" className="w-11 h-11 rounded-full" />
              </a>

              {/* Viber */}
              <a 
                href="viber://chat?number=+380636507449" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
              >
                <img src="/viber.png" alt="Viber" className="w-11 h-11 rounded-full" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Side Panel */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isCartOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsCartOpen(false)}
        />
        
        {/* Cart Panel - from right */}
        <div 
          className={`absolute top-0 right-0 h-full w-[92vw] max-w-[400px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Cart Header */}
          <div className="bg-green-500 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              <span className="font-bold text-lg">Кошик</span>
              {cartCount > 0 && (
                <span className="bg-white text-green-600 text-sm font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Кошик порожній</h3>
                <p className="text-sm text-gray-500 mb-4">Додайте товари до кошика</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/catalog');
                  }}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Перейти до каталогу
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-white border border-gray-200 rounded-lg p-3">
                    {/* Product Image */}
                    <img
                      src={item.product?.image || '/placeholder.png'}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                        {item.product?.name}
                      </h4>
                      <p className="text-sm font-bold text-green-600 mb-2">
                        {item.product?.price} ₴
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-600 text-sm"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer - Fixed */}
          {cartItems.length > 0 && (
            <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 space-y-3">
              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Всього:</span>
                <span className="text-green-600">{cartTotal.toFixed(2)} ₴</span>
              </div>
              
              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Оформити замовлення
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Переглянути кошик
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-300 ${
          isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        />
        
        {/* Search Panel */}
        <div 
          className={`absolute top-0 left-0 right-0 bg-white shadow-2xl transition-transform duration-300 ${
            isSearchOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
            {/* Close button */}
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Search form */}
            <form onSubmit={handleSearch} className="mt-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                Пошук товарів
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Введіть назву товару..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
                  data-testid="search-input"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-colors"
                  data-testid="search-btn"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              
              {/* Quick suggestions */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-gray-500">Популярні:</span>
                {['Туя', 'Бонсай', 'Нівакі', 'Самшит'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      navigate(`/catalog?search=${encodeURIComponent(term)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'cat-001',
    name: 'Бонсай Нівакі',
    icon: 'https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg',
  },
  {
    id: 'cat-002',
    name: 'Туя Колумна',
    icon: 'https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg',
  },
  {
    id: 'cat-003',
    name: 'Туя Смарагд',
    icon: 'https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg',
  },
  {
    id: 'cat-004',
    name: 'Самшит',
    icon: 'https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg',
  },
  {
    id: 'cat-005',
    name: 'Хвойні рослини',
    icon: 'https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg',
  },
  {
    id: 'cat-006',
    name: 'Листопадні дерева та кущі',
    icon: 'https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg',
  },
  {
    id: 'cat-007',
    name: 'Куляста Туя Глобоса',
    icon: 'https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg',
  },
  {
    id: 'cat-008',
    name: 'Катальпа',
    icon: 'https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg',
  },
  {
    id: 'cat-009',
    name: 'Ялина',
    icon: 'https://images.prom.ua/5027326802_w640_h640_yalina.jpg',
  },
  {
    id: 'cat-010',
    name: 'Кімнатні рослини',
    icon: 'https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg',
  },
];

const CatalogModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      
      {/* Modal Panel - Full screen on mobile */}
      <div className="absolute inset-0 bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="w-10"></div>
          <h2 className="text-lg font-medium text-gray-800">Каталог</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
              data-testid={`catalog-modal-${category.id}`}
            >
              {/* Category Image */}
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={category.icon} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Category Name */}
              <span className="flex-1 text-left text-base text-gray-800">
                {category.name}
              </span>
              
              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogModal;

// API для роботи з Новою Поштою
const API_URL = 'https://api.novaposhta.ua/v2.0/json/';

// Реальний API ключ Нової Пошти
const API_KEY = '99f431ebd000e0b8f49d8fceb9669b4a';

/**
 * Пошук міст України
 * @param {string} query - Назва міста для пошуку
 * @returns {Promise<Array>} Список міст
 */
export const searchCities = async (query) => {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {
          FindByString: query,
          Limit: '50'
        }
      })
    });

    const data = await response.json();
    
    if (data.success && data.data) {
      // Фільтруємо окуповані території (Крим, частина Донецької, Луганської областей)
      const occupiedRegions = [
        'Автономна Республіка Крим',
        'Севастопольська',
      ];
      
      const occupiedCities = [
        'Донецьк',
        'Макіївка',
        'Горлівка',
        'Єнакієве',
        'Дебальцеве',
        'Луганськ',
        'Алчевськ',
        'Краснодон',
        'Стаханов',
        'Ровеньки'
      ];

      return data.data
        .filter(city => {
          // Виключаємо окуповані області
          if (occupiedRegions.includes(city.AreaDescription)) {
            return false;
          }
          // Виключаємо окуповані міста
          if (occupiedCities.includes(city.Description)) {
            return false;
          }
          return true;
        })
        .map(city => ({
          ref: city.Ref,
          name: city.Description,
          nameRu: city.DescriptionRu,
          area: city.AreaDescription,
          region: city.RegionsDescription
        }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

/**
 * Отримати відділення Нової Пошти в місті
 * @param {string} cityRef - Ref міста
 * @returns {Promise<Array>} Список відділень
 */
export const getWarehouses = async (cityRef) => {
  if (!cityRef) return [];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: cityRef,
          Limit: '500'
        }
      })
    });

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data
        .filter(warehouse => warehouse.TypeOfWarehouse !== '9a68df70-0267-42a8-bb5c-37f427e36ee4') // Виключаємо поштомати за потреби
        .map(warehouse => ({
          ref: warehouse.Ref,
          description: warehouse.Description,
          shortAddress: warehouse.ShortAddress,
          number: warehouse.Number,
          cityRef: warehouse.CityRef
        }))
        .sort((a, b) => parseInt(a.number) - parseInt(b.number));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting warehouses:', error);
    return [];
  }
};

/**
 * Популярні міста України для швидкого доступу
 */
export const popularCities = [
  'Київ',
  'Харків', 
  'Одеса',
  'Дніпро',
  'Львів',
  'Запоріжжя',
  'Кривий Ріг',
  'Миколаїв',
  'Вінниця',
  'Херсон',
  'Полтава',
  'Чернігів',
  'Черкаси',
  'Житомир',
  'Суми',
  'Хмельницький',
  'Рівне',
  'Чернівці',
  'Тернопіль',
  'Івано-Франківськ',
  'Луцьк',
  'Ужгород'
];

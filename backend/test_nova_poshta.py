"""
Тестовий скрипт для перевірки API Нової Пошти
"""
import requests
import json

API_URL = 'https://api.novaposhta.ua/v2.0/json/'
API_KEY = '99f431ebd000e0b8f49d8fceb9669b4a'

def search_city(query):
    """Пошук міста"""
    response = requests.post(API_URL, json={
        'apiKey': API_KEY,
        'modelName': 'Address',
        'calledMethod': 'getCities',
        'methodProperties': {
            'FindByString': query,
            'Limit': '10',
            'Language': 'UA'
        }
    })
    data = response.json()
    if data['success'] and data['data']:
        return data['data']
    return []

def get_warehouses(city_ref):
    """Отримати відділення"""
    response = requests.post(API_URL, json={
        'apiKey': API_KEY,
        'modelName': 'Address',
        'calledMethod': 'getWarehouses',
        'methodProperties': {
            'CityRef': city_ref,
            'Limit': '50',
            'Language': 'UA'
        }
    })
    data = response.json()
    if data['success'] and data['data']:
        return data['data']
    return []

# Шукаємо Смигу
print("=" * 80)
print("Пошук міста 'Смига'")
print("=" * 80)

cities = search_city('Смига')
if cities:
    city = cities[0]
    print(f"\nЗнайдено місто: {city['Description']}")
    print(f"Область: {city['AreaDescription']}")
    print(f"Ref: {city['Ref']}")
    
    print("\n" + "=" * 80)
    print("Відділення у Смизі:")
    print("=" * 80)
    
    warehouses = get_warehouses(city['Ref'])
    for w in warehouses:
        print(f"\n{'='*60}")
        print(f"Назва: {w['Description']}")
        print(f"Номер: {w.get('Number', 'N/A')}")
        print(f"Адреса: {w.get('ShortAddress', 'N/A')}")
        print(f"TypeOfWarehouse: {w.get('TypeOfWarehouse', 'N/A')}")
        print(f"TypeOfWarehouseDescription: {w.get('TypeOfWarehouseDescription', 'N/A')}")
        print(f"WarehouseStatus: {w.get('WarehouseStatus', 'N/A')}")
        print(f"CategoryOfWarehouse: {w.get('CategoryOfWarehouse', 'N/A')}")
        print(f"{'='*60}")
else:
    print("Місто не знайдено")

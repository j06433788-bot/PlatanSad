"""
Script to import products from platansad.prom.ua website
"""
import asyncio
import json
import re
from typing import List, Dict
import httpx
from bs4 import BeautifulSoup

# Categories from the website
CATEGORIES = [
    {
        "id": "cat-001",
        "name": "Бонсай Нівакі",
        "url": "https://platansad.prom.ua/ua/g125670178-bonsaj-nivaki-pinus",
        "icon": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg"
    },
    {
        "id": "cat-002",
        "name": "Туя Колумна",
        "url": "https://platansad.prom.ua/ua/g18766610-tuya-kolumna-columna",
        "icon": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg"
    },
    {
        "id": "cat-003",
        "name": "Туя Смарагд",
        "url": "https://platansad.prom.ua/ua/g18767376-tuya-zahidna-smaragd",
        "icon": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg"
    },
    {
        "id": "cat-004",
        "name": "Самшит",
        "url": "https://platansad.prom.ua/ua/g18723912-samshit-vichnozelenij-arborestsens",
        "icon": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg"
    },
    {
        "id": "cat-005",
        "name": "Хвойні рослини",
        "url": "https://platansad.prom.ua/ua/g18714713-hvojni-roslini",
        "icon": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg"
    },
    {
        "id": "cat-006",
        "name": "Листопадні дерева та кущі",
        "url": "https://platansad.prom.ua/ua/g18842921-listopadni-dereva-kuschi",
        "icon": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg"
    },
    {
        "id": "cat-007",
        "name": "Куляста Туя Глобоса",
        "url": "https://platansad.prom.ua/ua/g18770568-tuya-sharovidnaya-globosa",
        "icon": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg"
    },
    {
        "id": "cat-008",
        "name": "Катальпа",
        "url": "https://platansad.prom.ua/ua/g18842392-katalpa-catalpa",
        "icon": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg"
    },
    {
        "id": "cat-009",
        "name": "Ялина",
        "url": "https://platansad.prom.ua/ua/g18806760-yalina",
        "icon": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg"
    },
    {
        "id": "cat-010",
        "name": "Кімнатні рослини",
        "url": "https://platansad.prom.ua/ua/g148273888-kimnatni-roslini",
        "icon": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg"
    }
]


async def scrape_category_products(category_url: str, category_name: str) -> List[Dict]:
    """Scrape all products from a category"""
    products = []
    page = 1
    
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        while True:
            if page == 1:
                url = category_url
            else:
                url = f"{category_url}/page_{page}"
            
            print(f"Scraping {category_name} - Page {page}: {url}")
            
            try:
                response = await client.get(url)
                if response.status_code != 200:
                    break
                    
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find all product items
                product_items = soup.find_all('div', class_='b-product-item')
                
                if not product_items:
                    break
                
                for item in product_items:
                    try:
                        # Extract product info
                        title_elem = item.find('a', class_='b-product-item__title-link')
                        if not title_elem:
                            continue
                            
                        product_name = title_elem.get_text(strip=True)
                        product_url = title_elem.get('href', '')
                        
                        # Extract image
                        img_elem = item.find('img', class_='b-product-item__image')
                        image_url = img_elem.get('src', '') if img_elem else ''
                        
                        # Extract price
                        price_elem = item.find('span', class_='b-product-item__price-value')
                        price_text = price_elem.get_text(strip=True) if price_elem else '0'
                        price = float(re.sub(r'[^\d.]', '', price_text)) if price_text else 0
                        
                        # Check if in stock
                        in_stock_elem = item.find('span', class_='b-product-item__availability')
                        in_stock = in_stock_elem and 'наявності' in in_stock_elem.get_text().lower()
                        
                        product = {
                            'name': product_name,
                            'url': product_url,
                            'image': image_url,
                            'price': price,
                            'category': category_name,
                            'in_stock': in_stock
                        }
                        
                        products.append(product)
                        
                    except Exception as e:
                        print(f"Error parsing product: {e}")
                        continue
                
                page += 1
                await asyncio.sleep(1)  # Be polite to the server
                
            except Exception as e:
                print(f"Error fetching page: {e}")
                break
    
    return products


async def main():
    """Main function to scrape all categories"""
    all_products = []
    
    for category in CATEGORIES:
        print(f"\n{'='*60}")
        print(f"Processing category: {category['name']}")
        print(f"{'='*60}")
        
        products = await scrape_category_products(category['url'], category['name'])
        all_products.extend(products)
        
        print(f"Found {len(products)} products in {category['name']}")
        
        # Wait between categories
        await asyncio.sleep(2)
    
    # Save to JSON file
    output_file = '/app/backend/platansad_products.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'categories': CATEGORIES,
            'products': all_products,
            'total_products': len(all_products)
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print(f"SCRAPING COMPLETE!")
    print(f"Total products scraped: {len(all_products)}")
    print(f"Data saved to: {output_file}")
    print(f"{'='*60}")


if __name__ == "__main__":
    asyncio.run(main())

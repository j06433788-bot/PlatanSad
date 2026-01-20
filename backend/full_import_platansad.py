"""
Full import script from platansad.prom.ua
This will scrape all products from all categories
"""
import asyncio
import json
import re
import uuid
from datetime import datetime
from sqlalchemy import create_engine, select, delete
from sqlalchemy.orm import sessionmaker
from database import Category, Product, Base
import httpx
from bs4 import BeautifulSoup

# Database setup
DATABASE_URL = "sqlite+aiosqlite:///./platansad.db"
SYNC_DATABASE_URL = "sqlite:///./platansad.db"
engine = create_engine(SYNC_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

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


def extract_price(price_text):
    """Extract numeric price from text"""
    if not price_text:
        return 0
    # Remove all non-digit characters except decimal point
    price_clean = re.sub(r'[^\d.]', '', price_text.replace(',', '.').replace(' ', ''))
    try:
        return float(price_clean) if price_clean else 0
    except:
        return 0


def clean_product_name(name):
    """Clean product name by removing numbering"""
    # Remove patterns like *44, *45, etc.
    name = re.sub(r'^\*\d+\s*', '', name)
    return name.strip()


async def scrape_category_products(category_url, category_name, category_id):
    """Scrape all products from a category"""
    products = []
    page = 1
    max_pages = 20  # Safety limit
    
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        while page <= max_pages:
            if page == 1:
                url = category_url
            else:
                url = f"{category_url}/page_{page}"
            
            print(f"📄 Scraping {category_name} - Page {page}")
            
            try:
                response = await client.get(url)
                if response.status_code != 200:
                    print(f"   ⚠️  Status {response.status_code}, stopping pagination")
                    break
                    
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find all product links in the category listing
                product_links = []
                for link in soup.find_all('a', href=True):
                    href = link.get('href', '')
                    # Product URLs typically match pattern /ua/p{numbers}-{slug}.html
                    if '/ua/p' in href and '.html' in href:
                        full_url = href if href.startswith('http') else f"https://platansad.prom.ua{href}"
                        if full_url not in [p['url'] for p in products]:
                            product_links.append(full_url)
                
                if not product_links:
                    print(f"   ℹ️  No products found on page {page}")
                    break
                
                print(f"   ✓ Found {len(product_links)} products on this page")
                
                # Extract product info from listing page
                for link in product_links:
                    try:
                        # Get product name from title attribute or text
                        product_elem = soup.find('a', href=link.replace('https://platansad.prom.ua', ''))
                        if not product_elem:
                            continue
                        
                        # Get product name
                        name = product_elem.get('title') or product_elem.get_text(strip=True)
                        name = clean_product_name(name)
                        
                        # Get image - look for img within product card
                        image_url = ""
                        img_elem = product_elem.find_parent().find('img') if product_elem.find_parent() else None
                        if img_elem:
                            image_url = img_elem.get('src', '')
                            # Convert to higher resolution
                            if '_w274_h200_' in image_url:
                                image_url = image_url.replace('_w274_h200_', '_w640_h640_')
                        
                        # Get price from the listing
                        price = 0
                        price_elem = product_elem.find_parent().find(string=re.compile(r'₴'))
                        if price_elem:
                            price = extract_price(price_elem)
                        
                        product = {
                            'id': str(uuid.uuid4()),
                            'name': name,
                            'article': link.split('/')[-1].replace('.html', ''),
                            'price': price,
                            'url': link,
                            'image': image_url,
                            'category': category_name,
                            'category_id': category_id,
                            'description': f"{name}. Декоративні рослини для ландшафтного дизайну від розсадника PlatanSad.",
                            'stock': 10,
                            'badges': ['new'] if page == 1 and len(products) < 5 else []
                        }
                        
                        products.append(product)
                        
                    except Exception as e:
                        print(f"   ⚠️  Error parsing product: {e}")
                        continue
                
                page += 1
                await asyncio.sleep(1)  # Be polite to the server
                
            except Exception as e:
                print(f"   ❌ Error fetching page: {e}")
                break
    
    return products


def clear_database():
    """Clear existing products and categories"""
    print("\n🗑️  Clearing existing database...")
    db = SessionLocal()
    try:
        db.execute(delete(Product))
        db.execute(delete(Category))
        db.commit()
        print("   ✓ Database cleared")
    finally:
        db.close()


def save_categories():
    """Save categories to database"""
    print("\n💾 Saving categories to database...")
    db = SessionLocal()
    try:
        for cat_data in CATEGORIES:
            category = Category(
                id=cat_data['id'],
                name=cat_data['name'],
                icon=cat_data['icon']
            )
            db.add(category)
        
        db.commit()
        print(f"   ✓ Saved {len(CATEGORIES)} categories")
    finally:
        db.close()


def save_products(all_products):
    """Save products to database"""
    print(f"\n💾 Saving {len(all_products)} products to database...")
    db = SessionLocal()
    try:
        for prod_data in all_products:
            product = Product(
                id=prod_data['id'],
                name=prod_data['name'],
                article=prod_data['article'],
                price=prod_data['price'],
                image=prod_data['image'],
                category=prod_data['category'],
                badges=json.dumps(prod_data['badges']),
                description=prod_data['description'],
                stock=prod_data['stock'],
                created_at=datetime.utcnow()
            )
            db.add(product)
        
        db.commit()
        print(f"   ✓ Saved {len(all_products)} products")
    finally:
        db.close()


async def main():
    """Main function"""
    print("="*70)
    print("🌿 PLATANSAD FULL IMPORT - Starting...")
    print("="*70)
    
    # Clear existing data
    clear_database()
    
    # Save categories
    save_categories()
    
    # Scrape all products
    all_products = []
    total_categories = len(CATEGORIES)
    
    for idx, category in enumerate(CATEGORIES, 1):
        print(f"\n{'='*70}")
        print(f"📂 [{idx}/{total_categories}] Processing: {category['name']}")
        print(f"{'='*70}")
        
        products = await scrape_category_products(
            category['url'], 
            category['name'],
            category['id']
        )
        
        all_products.extend(products)
        print(f"   ✅ Category complete: {len(products)} products")
        
        # Wait between categories
        await asyncio.sleep(2)
    
    # Save all products to database
    save_products(all_products)
    
    # Save to JSON for backup
    output_file = '/app/backend/platansad_import_backup.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'categories': CATEGORIES,
            'products': all_products,
            'total_products': len(all_products),
            'import_date': datetime.utcnow().isoformat()
        }, f, ensure_ascii=False, indent=2)
    
    print("\n" + "="*70)
    print("🎉 IMPORT COMPLETE!")
    print("="*70)
    print(f"✓ Total categories: {len(CATEGORIES)}")
    print(f"✓ Total products imported: {len(all_products)}")
    print(f"✓ Backup saved to: {output_file}")
    print(f"✓ Database updated: platansad.db")
    print("="*70)


if __name__ == "__main__":
    asyncio.run(main())

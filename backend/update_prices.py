"""
Update prices for products by scraping individual product pages
"""
import asyncio
import json
import re
from sqlalchemy import create_engine, select, update
from sqlalchemy.orm import sessionmaker
from database import Product
import httpx
from bs4 import BeautifulSoup

# Database setup
SYNC_DATABASE_URL = "sqlite:///./platansad.db"
engine = create_engine(SYNC_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


def extract_price(text):
    """Extract price from text"""
    if not text:
        return 0
    # Find price pattern like "5 000 ₴" or "5000 ₴"
    price_match = re.search(r'([\d\s,]+)\s*₴', text)
    if price_match:
        price_str = price_match.group(1).replace(' ', '').replace(',', '.')
        try:
            return float(price_str)
        except:
            return 0
    return 0


async def fetch_product_price(url):
    """Fetch price from product page"""
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.get(url)
            if response.status_code != 200:
                return 0
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Try multiple price selectors
            price = 0
            
            # Method 1: Look for price in meta tags
            price_meta = soup.find('meta', {'property': 'product:price:amount'})
            if price_meta:
                price = float(price_meta.get('content', 0))
                return price
            
            # Method 2: Look for price in structured data
            script_tag = soup.find('script', {'type': 'application/ld+json'})
            if script_tag:
                try:
                    data = json.loads(script_tag.string)
                    if isinstance(data, dict) and 'offers' in data:
                        price = float(data['offers'].get('price', 0))
                        return price
                except:
                    pass
            
            # Method 3: Look for price in common price containers
            price_containers = [
                soup.find('span', class_='b-product-cost__current-price'),
                soup.find('div', class_='product-price'),
                soup.find('span', {'itemprop': 'price'}),
            ]
            
            for container in price_containers:
                if container:
                    price_text = container.get_text()
                    price = extract_price(price_text)
                    if price > 0:
                        return price
            
            # Method 4: Search for price pattern in page
            page_text = soup.get_text()
            price = extract_price(page_text)
            
            return price
            
    except Exception as e:
        print(f"   ⚠️ Error fetching {url}: {e}")
        return 0


async def update_product_prices_batch(products, start_idx, batch_size):
    """Update prices for a batch of products"""
    tasks = []
    batch = products[start_idx:start_idx + batch_size]
    
    for product in batch:
        if product.price == 0 or product.price is None:
            # Build full URL if needed
            url = product.article if product.article.startswith('http') else f"https://platansad.prom.ua/ua/{product.article}.html"
            tasks.append((product.id, fetch_product_price(url)))
    
    # Fetch prices concurrently
    results = []
    for product_id, task in tasks:
        price = await task
        if price > 0:
            results.append((product_id, price))
    
    return results


def main():
    """Main function to update all prices"""
    print("="*70)
    print("💰 UPDATING PRODUCT PRICES")
    print("="*70)
    
    db = SessionLocal()
    
    try:
        # Get all products
        result = db.execute(select(Product))
        products = result.scalars().all()
        
        total = len(products)
        print(f"\n📊 Found {total} products")
        
        # Count products without prices
        no_price = sum(1 for p in products if p.price == 0 or p.price is None)
        print(f"📋 Products needing price update: {no_price}")
        
        if no_price == 0:
            print("✅ All products already have prices!")
            return
        
        print(f"\n🔄 Starting price updates...")
        print("   (This may take 10-15 minutes)\n")
        
        # Process in batches to avoid overwhelming the server
        batch_size = 20
        updated_count = 0
        
        for i in range(0, total, batch_size):
            batch_num = (i // batch_size) + 1
            total_batches = (total + batch_size - 1) // batch_size
            
            print(f"📦 Batch {batch_num}/{total_batches} (products {i+1}-{min(i+batch_size, total)})")
            
            # Update prices for this batch
            batch_products = products[i:i+batch_size]
            results = asyncio.run(update_product_prices_batch(batch_products, 0, len(batch_products)))
            
            # Update database
            for product_id, price in results:
                db.execute(
                    update(Product)
                    .where(Product.id == product_id)
                    .values(price=price)
                )
                updated_count += 1
                print(f"   ✓ Updated product {product_id}: {price} ₴")
            
            db.commit()
            
            # Progress update
            print(f"   Progress: {updated_count}/{no_price} prices updated\n")
            
            # Be polite to the server
            asyncio.run(asyncio.sleep(2))
        
        print("="*70)
        print(f"✅ PRICE UPDATE COMPLETE!")
        print(f"   Updated: {updated_count} products")
        print("="*70)
        
    finally:
        db.close()


if __name__ == "__main__":
    main()

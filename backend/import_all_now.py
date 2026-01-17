import asyncio
import sys
sys.path.insert(0, '/app/backend')

from database import AsyncSessionLocal, Product
from sqlalchemy import delete

# Load all products
exec(open('/app/backend/seed_data_extended.py').read())

async def import_all():
    print(f"🌱 Importing {len(PRODUCTS)} products...")
    
    async with AsyncSessionLocal() as session:
        # Don't clear - add to existing
        print("Adding new products...")
        
        count = 0
        for prod_data in PRODUCTS:
            try:
                # Fix field names
                product_dict = {
                    'id': prod_data['id'],
                    'name': prod_data['name'],
                    'article': prod_data['id'],
                    'price': prod_data['price'],
                    'old_price': prod_data.get('old_price'),
                    'discount': prod_data.get('discount', 0),
                    'image': prod_data['image'],
                    'category': prod_data['category'],
                    'badges': prod_data.get('badges', []),
                    'description': prod_data.get('description', ''),
                    'stock': prod_data.get('stock', 10)
                }
                
                product = Product(**product_dict)
                session.add(product)
                count += 1
                
                if count % 20 == 0:
                    await session.commit()
                    print(f"  ✅ {count}/{len(PRODUCTS)}")
            except Exception as e:
                print(f"  ⚠️  {prod_data['id']}: {str(e)[:80]}")
        
        await session.commit()
        print(f"✅ Total: {count} products!")

try:
    asyncio.run(import_all())
except Exception as e:
    print(f"Error: {e}")

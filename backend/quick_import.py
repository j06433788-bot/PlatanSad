import asyncio
import sys
sys.path.insert(0, '/app/backend')

from database import AsyncSessionLocal, Product
from sqlalchemy import delete

# Load products
exec(open('/app/backend/seed_data_extended.py').read())

async def quick_import():
    print(f"🌱 Importing {len(PRODUCTS)} products...")
    
    async with AsyncSessionLocal() as session:
        # Clear existing
        print("Clearing old products...")
        await session.execute(delete(Product))
        await session.commit()
        
        # Add new
        count = 0
        for prod_data in PRODUCTS:
            product = Product(**prod_data)
            session.add(product)
            count += 1
            if count % 20 == 0:
                await session.commit()
                print(f"  ✅ {count}/{len(PRODUCTS)}")
        
        await session.commit()
        print(f"✅ Imported {count} products!")

asyncio.run(quick_import())

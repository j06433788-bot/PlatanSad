"""
Add badges to products for homepage display
"""
from sqlalchemy import create_engine, select, update
from sqlalchemy.orm import sessionmaker
from database import Product
import json
import random

# Database setup
SYNC_DATABASE_URL = "sqlite:///./platansad.db"
engine = create_engine(SYNC_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


def main():
    """Add badges to products"""
    print("="*70)
    print("🏷️  ADDING BADGES TO PRODUCTS")
    print("="*70)
    
    db = SessionLocal()
    
    try:
        # Get all products
        result = db.execute(select(Product))
        products = result.scalars().all()
        
        print(f"\n📊 Total products: {len(products)}")
        
        # Split products into groups
        products_list = list(products)
        
        # Top 30 products as "hits" (популярні)
        hit_products = products_list[:30]
        
        # Next 30 as "new" (новинки)
        new_products = products_list[30:60]
        
        # Next 30 as "sale" (розпродаж) - можна зробити discount
        sale_products = products_list[60:90]
        
        updated = 0
        
        # Update hit products
        for product in hit_products:
            badges = ['hit']
            db.execute(
                update(Product)
                .where(Product.id == product.id)
                .values(badges=json.dumps(badges))
            )
            updated += 1
        
        print(f"✅ Added 'hit' badge to {len(hit_products)} products")
        
        # Update new products
        for product in new_products:
            badges = ['new']
            db.execute(
                update(Product)
                .where(Product.id == product.id)
                .values(badges=json.dumps(badges))
            )
            updated += 1
        
        print(f"✅ Added 'new' badge to {len(new_products)} products")
        
        # Update sale products with discount
        for product in sale_products:
            badges = ['sale']
            # Add 10-30% discount
            discount = random.choice([10, 15, 20, 25, 30])
            old_price = product.price
            new_price = old_price * (1 - discount / 100)
            
            db.execute(
                update(Product)
                .where(Product.id == product.id)
                .values(
                    badges=json.dumps(badges),
                    old_price=old_price,
                    price=new_price,
                    discount=discount
                )
            )
            updated += 1
        
        print(f"✅ Added 'sale' badge to {len(sale_products)} products with discounts")
        
        db.commit()
        
        print("="*70)
        print(f"✅ BADGES ADDED!")
        print(f"   Total updated: {updated} products")
        print(f"   - Хіти: {len(hit_products)} products")
        print(f"   - Новинки: {len(new_products)} products")
        print(f"   - Розпродаж: {len(sale_products)} products (з знижками)")
        print("="*70)
        
    finally:
        db.close()


if __name__ == "__main__":
    main()

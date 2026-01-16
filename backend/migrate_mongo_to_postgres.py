"""
Migration script to transfer data from MongoDB to PostgreSQL
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import select
from database import engine, Base, AsyncSessionLocal
from database import Product, Category, CartItem, WishlistItem, Order, QuickOrder
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
mongo_client = AsyncIOMotorClient(mongo_url)
mongo_db = mongo_client[os.environ['DB_NAME']]


async def migrate_products():
    """Migrate products from MongoDB to PostgreSQL"""
    print("🔄 Migrating products...")
    
    # Fetch from MongoDB
    products = await mongo_db.products.find({}, {"_id": 0}).to_list(None)
    
    # Insert to PostgreSQL
    async with AsyncSessionLocal() as session:
        for product_data in products:
            # Convert field names from camelCase to snake_case
            pg_product = Product(
                id=product_data['id'],
                name=product_data['name'],
                article=product_data['article'],
                price=product_data['price'],
                old_price=product_data.get('oldPrice'),
                discount=product_data.get('discount', 0),
                image=product_data['image'],
                category=product_data['category'],
                badges=product_data.get('badges', []),
                description=product_data['description'],
                stock=product_data.get('stock', 100),
                created_at=product_data.get('createdAt')
            )
            session.add(pg_product)
        
        await session.commit()
    
    print(f"✅ Migrated {len(products)} products")


async def migrate_categories():
    """Migrate categories from MongoDB to PostgreSQL"""
    print("🔄 Migrating categories...")
    
    # Fetch from MongoDB
    categories = await mongo_db.categories.find({}, {"_id": 0}).to_list(None)
    
    # Insert to PostgreSQL
    async with AsyncSessionLocal() as session:
        for category_data in categories:
            pg_category = Category(
                id=category_data['id'],
                name=category_data['name'],
                icon=category_data['icon'],
                count=category_data.get('count', 0)
            )
            session.add(pg_category)
        
        await session.commit()
    
    print(f"✅ Migrated {len(categories)} categories")


async def migrate_cart():
    """Migrate cart items from MongoDB to PostgreSQL"""
    print("🔄 Migrating cart items...")
    
    # Fetch from MongoDB
    cart_items = await mongo_db.cart.find({}, {"_id": 0}).to_list(None)
    
    # Insert to PostgreSQL
    async with AsyncSessionLocal() as session:
        for cart_data in cart_items:
            pg_cart = CartItem(
                id=cart_data['id'],
                product_id=cart_data['productId'],
                product_name=cart_data['productName'],
                product_image=cart_data['productImage'],
                price=cart_data['price'],
                quantity=cart_data['quantity'],
                user_id=cart_data.get('userId', 'guest')
            )
            session.add(pg_cart)
        
        await session.commit()
    
    print(f"✅ Migrated {len(cart_items)} cart items")


async def migrate_wishlist():
    """Migrate wishlist items from MongoDB to PostgreSQL"""
    print("🔄 Migrating wishlist items...")
    
    # Fetch from MongoDB
    wishlist_items = await mongo_db.wishlist.find({}, {"_id": 0}).to_list(None)
    
    # Insert to PostgreSQL
    async with AsyncSessionLocal() as session:
        for wishlist_data in wishlist_items:
            pg_wishlist = WishlistItem(
                id=wishlist_data['id'],
                product_id=wishlist_data['productId'],
                user_id=wishlist_data.get('userId', 'guest'),
                created_at=wishlist_data.get('createdAt')
            )
            session.add(pg_wishlist)
        
        await session.commit()
    
    print(f"✅ Migrated {len(wishlist_items)} wishlist items")


async def migrate_orders():
    """Migrate orders from MongoDB to PostgreSQL"""
    print("🔄 Migrating orders...")
    
    # Fetch from MongoDB
    orders = await mongo_db.orders.find({}, {"_id": 0}).to_list(None)
    
    # Insert to PostgreSQL
    async with AsyncSessionLocal() as session:
        for order_data in orders:
            pg_order = Order(
                id=order_data['id'],
                user_id=order_data.get('userId', 'guest'),
                items=order_data['items'],
                total_amount=order_data['totalAmount'],
                customer_name=order_data['customerName'],
                customer_phone=order_data['customerPhone'],
                customer_email=order_data['customerEmail'],
                delivery_address=order_data['deliveryAddress'],
                delivery_method=order_data['deliveryMethod'],
                payment_method=order_data['paymentMethod'],
                status=order_data.get('status', 'pending'),
                notes=order_data.get('notes'),
                created_at=order_data.get('createdAt')
            )
            session.add(pg_order)
        
        await session.commit()
    
    print(f"✅ Migrated {len(orders)} orders")


async def migrate_quick_orders():
    """Migrate quick orders from MongoDB to PostgreSQL"""
    print("🔄 Migrating quick orders...")
    
    # Fetch from MongoDB
    quick_orders = await mongo_db.quick_orders.find({}, {"_id": 0}).to_list(None)
    
    # Insert to PostgreSQL
    async with AsyncSessionLocal() as session:
        for qo_data in quick_orders:
            pg_qo = QuickOrder(
                id=qo_data['id'],
                product_id=qo_data['productId'],
                product_name=qo_data['productName'],
                product_image=qo_data['productImage'],
                price=qo_data['price'],
                quantity=qo_data['quantity'],
                customer_name=qo_data['customerName'],
                customer_phone=qo_data['customerPhone'],
                status=qo_data.get('status', 'pending'),
                notes=qo_data.get('notes'),
                created_at=qo_data.get('createdAt')
            )
            session.add(pg_qo)
        
        await session.commit()
    
    print(f"✅ Migrated {len(quick_orders)} quick orders")


async def main():
    """Main migration function"""
    print("🚀 Starting migration from MongoDB to PostgreSQL...")
    print("=" * 60)
    
    # Create tables
    print("📋 Creating PostgreSQL tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created\n")
    
    # Migrate data
    try:
        await migrate_products()
        await migrate_categories()
        await migrate_cart()
        await migrate_wishlist()
        await migrate_orders()
        await migrate_quick_orders()
        
        print("\n" + "=" * 60)
        print("✨ Migration completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {str(e)}")
        raise
    finally:
        # Close connections
        mongo_client.close()
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())

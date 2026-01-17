"""
Import products via API - safe method
"""
import requests
import time
import json

# Load products from seed file
exec(open('/app/backend/seed_data_extended.py').read())

BASE_URL = "http://localhost:8001/api"

def clear_existing_products():
    """Clear all existing products"""
    print("🗑️  Clearing existing products...")
    try:
        response = requests.get(f"{BASE_URL}/products?limit=10000")
        if response.status_code == 200:
            existing = response.json()
            print(f"Found {len(existing)} existing products")
            for product in existing:
                try:
                    del_response = requests.delete(f"{BASE_URL}/products/{product['id']}")
                    if del_response.status_code == 200:
                        print(f"  ✅ Deleted: {product['id']}")
                except Exception as e:
                    print(f"  ⚠️  Could not delete {product['id']}: {e}")
    except Exception as e:
        print(f"⚠️  Error clearing products: {e}")

def import_products_batch(products, batch_size=10):
    """Import products in batches"""
    total = len(products)
    success = 0
    failed = 0
    
    print(f"\n📦 Starting import of {total} products in batches of {batch_size}...")
    
    for i in range(0, total, batch_size):
        batch = products[i:i+batch_size]
        batch_num = (i // batch_size) + 1
        total_batches = (total + batch_size - 1) // batch_size
        
        print(f"\n🔄 Batch {batch_num}/{total_batches} ({len(batch)} products)...")
        
        for product in batch:
            try:
                # Prepare data for API
                product_data = {
                    "id": product["id"],
                    "name": product["name"],
                    "article": product.get("article", product["id"]),
                    "price": product["price"],
                    "oldPrice": product.get("oldPrice"),
                    "discount": product.get("discount", 0),
                    "image": product["image"],
                    "category": product["category"],
                    "badges": product.get("badges", []),
                    "description": product.get("description", ""),
                    "stock": product.get("stock", 10)
                }
                
                response = requests.post(
                    f"{BASE_URL}/products",
                    json=product_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code in [200, 201]:
                    success += 1
                    print(f"  ✅ {product['id']}: {product['name'][:50]}")
                else:
                    failed += 1
                    print(f"  ❌ {product['id']}: {response.status_code} - {response.text[:100]}")
                
                # Small delay to avoid overwhelming
                time.sleep(0.1)
                
            except Exception as e:
                failed += 1
                print(f"  ❌ {product['id']}: {str(e)[:100]}")
        
        # Progress update
        print(f"\n📊 Progress: {success} success, {failed} failed ({success+failed}/{total})")
        time.sleep(0.5)
    
    return success, failed

def verify_import():
    """Verify imported products"""
    print("\n🔍 Verifying import...")
    try:
        response = requests.get(f"{BASE_URL}/products?limit=10000")
        if response.status_code == 200:
            products = response.json()
            print(f"\n✅ Total products in database: {len(products)}")
            
            # Count by category
            from collections import Counter
            categories = Counter(p['category'] for p in products)
            print("\n📊 Products by category:")
            for cat, count in sorted(categories.items()):
                print(f"  • {cat}: {count}")
            
            return len(products)
    except Exception as e:
        print(f"❌ Verification error: {e}")
    return 0

if __name__ == "__main__":
    print("=" * 60)
    print("🌱 PlatanSad Product Import via API")
    print("=" * 60)
    
    # Optional: clear existing
    # clear_existing_products()
    
    # Import products
    success, failed = import_products_batch(PRODUCTS, batch_size=15)
    
    # Verify
    total = verify_import()
    
    # Summary
    print("\n" + "=" * 60)
    print("📈 IMPORT SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully imported: {success}")
    print(f"❌ Failed: {failed}")
    print(f"📦 Total in database: {total}")
    print("=" * 60)
    
    if success == len(PRODUCTS):
        print("\n🎉 ALL PRODUCTS IMPORTED SUCCESSFULLY!")
    elif success > 0:
        print(f"\n⚠️  Partial success: {success}/{len(PRODUCTS)} imported")
    else:
        print("\n❌ Import failed. Check errors above.")

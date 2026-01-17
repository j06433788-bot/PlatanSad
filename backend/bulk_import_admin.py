import requests
import json

# Load products
exec(open('/app/backend/seed_data_extended.py').read())

BASE_URL = "http://localhost:8001/api"

# Step 1: Login as admin
print("🔐 Logging in as admin...")
login_response = requests.post(
    f"{BASE_URL}/admin/login",
    json={"username": "admin", "password": "admin123"}
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    exit(1)

token = login_response.json()['token']
print(f"✅ Logged in! Token: {token[:20]}...")

# Step 2: Prepare products for import
products_data = []
for p in PRODUCTS:
    products_data.append({
        "id": p["id"],
        "name": p["name"],
        "article": p["id"],
        "price": p["price"],
        "oldPrice": p.get("old_price"),
        "discount": p.get("discount", 0),
        "image": p["image"],
        "category": p["category"],
        "badges": p.get("badges", []),
        "description": p.get("description", ""),
        "stock": p.get("stock", 10)
    })

# Step 3: Bulk import in batches
batch_size = 20
total = len(products_data)
imported = 0

print(f"\n📦 Importing {total} products in batches of {batch_size}...")

for i in range(0, total, batch_size):
    batch = products_data[i:i+batch_size]
    batch_num = (i // batch_size) + 1
    total_batches = (total + batch_size - 1) // batch_size
    
    print(f"\n🔄 Batch {batch_num}/{total_batches} ({len(batch)} products)...")
    
    response = requests.post(
        f"{BASE_URL}/products/bulk-import",
        json=batch,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if response.status_code == 200:
        result = response.json()
        imported += result.get('imported', 0)
        print(f"  ✅ Imported: {result['imported']}/{result['total']}")
        if result.get('errors'):
            for error in result['errors'][:5]:
                print(f"  ⚠️  {error}")
    else:
        print(f"  ❌ Error: {response.status_code} - {response.text[:200]}")

print(f"\n✅ Total imported: {imported}/{total}")

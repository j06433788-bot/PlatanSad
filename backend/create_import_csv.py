"""
Create CSV file with all 180 products for import
"""
import csv

# Load products from extended seed
exec(open('/app/backend/seed_data_extended.py').read())

# Create CSV
csv_file = '/app/frontend/public/products_import.csv'

with open(csv_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=[
        'id', 'article', 'name', 'price', 'old_price', 'discount', 
        'image', 'category', 'badges', 'description', 'stock'
    ])
    
    writer.writeheader()
    
    for product in PRODUCTS:
        writer.writerow({
            'id': product['id'],
            'article': product['id'],  # Use id as article
            'name': product['name'],
            'price': product['price'],
            'old_price': product.get('old_price') or '',
            'discount': product.get('discount', 0),
            'image': product['image'],
            'category': product['category'],
            'badges': '|'.join(product.get('badges', [])),  # Join with |
            'description': product.get('description', ''),
            'stock': product.get('stock', 10)
        })

print(f"✅ Created CSV with {len(PRODUCTS)} products")
print(f"📄 File: {csv_file}")

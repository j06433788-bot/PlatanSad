# Add article field to all products
import re

with open('/app/backend/seed_data.py', 'r') as f:
    content = f.read()

# Find all product dictionaries and add article if missing
def add_article(match):
    prod_dict = match.group(0)
    prod_id = re.search(r'"id":\s*"([^"]+)"', prod_dict)
    if prod_id and '"article"' not in prod_dict:
        # Insert article after id
        prod_dict = prod_dict.replace(
            f'"id": "{prod_id.group(1)}"',
            f'"id": "{prod_id.group(1)}", "article": "{prod_id.group(1)}"'
        )
    return prod_dict

# Replace all product definitions
content = re.sub(r'\{"id":[^}]+\}', add_article, content)

with open('/app/backend/seed_data.py', 'w') as f:
    f.write(content)

print("✅ Added article fields")

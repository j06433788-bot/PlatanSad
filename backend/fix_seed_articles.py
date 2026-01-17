import re

with open('/app/backend/seed_data_extended.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add article field after id in product definitions
def add_article_field(match):
    text = match.group(0)
    # Find id value
    id_match = re.search(r'"id":\s*"([^"]+)"', text)
    if id_match and '"article"' not in text:
        prod_id = id_match.group(1)
        # Insert article after id line
        text = text.replace(
            f'"id": "{prod_id}"',
            f'"id": "{prod_id}", "article": "{prod_id}"'
        )
    return text

# Fix each product definition
content = re.sub(r'\{"id":\s*"prod-[^}]+\}', add_article_field, content, flags=re.DOTALL)

with open('/app/backend/seed_data_extended.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added article fields to all products")

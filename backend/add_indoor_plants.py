"""
Add more indoor plants to the catalog
"""
import asyncio
from database import AsyncSessionLocal, Product

# Extended indoor plants catalog (30 more items)
new_indoor_plants = [
    # Фікуси
    {"id": "prod-kimn016", "article": "KIMN-016", "name": "Фікус лірата 100-120см", "price": 650, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 10},
    {"id": "prod-kimn017", "article": "KIMN-017", "name": "Фікус еластика Робуста 80-100см", "price": 480, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 12},
    {"id": "prod-kimn018", "article": "KIMN-018", "name": "Фікус Бенджаміна Даніель 60-80см", "price": 380, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["new"], "stock": 15},
    
    # Пальми
    {"id": "prod-kimn019", "article": "KIMN-019", "name": "Хамедорея елегантна 60-80см", "price": 520, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 8},
    {"id": "prod-kimn020", "article": "KIMN-020", "name": "Кентія 100-120см", "price": 950, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 6},
    {"id": "prod-kimn021", "article": "KIMN-021", "name": "Фінікова пальма 80-100см", "price": 700, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["new"], "stock": 8},
    
    # Кактуси та сукуленти
    {"id": "prod-kimn022", "article": "KIMN-022", "name": "Кактус мікс 15-20см", "price": 150, "old_price": 180, "discount": 17, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["sale"], "stock": 40},
    {"id": "prod-kimn023", "article": "KIMN-023", "name": "Ехінокактус Грузона 20-25см", "price": 280, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 15},
    {"id": "prod-kimn024", "article": "KIMN-024", "name": "Молочай тригранний 60-80см", "price": 420, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 10},
    {"id": "prod-kimn025", "article": "KIMN-025", "name": "Крассула (грошове дерево) 40-50см", "price": 320, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 20},
    
    # Декоративнолистяні
    {"id": "prod-kimn026", "article": "KIMN-026", "name": "Калатея Медальйон 30-40см", "price": 450, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["new"], "stock": 12},
    {"id": "prod-kimn027", "article": "KIMN-027", "name": "Маранта трьохколірна 30-40см", "price": 380, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 15},
    {"id": "prod-kimn028", "article": "KIMN-028", "name": "Аглаонема Сільвер Квін 40-50см", "price": 420, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 10},
    {"id": "prod-kimn029", "article": "KIMN-029", "name": "Фіттонія червона 20-25см", "price": 180, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 25},
    {"id": "prod-kimn030", "article": "KIMN-030", "name": "Колеус мікс 25-30см", "price": 200, "old_price": 250, "discount": 20, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["sale"], "stock": 30},
    
    # Ампельні рослини
    {"id": "prod-kimn031", "article": "KIMN-031", "name": "Сциндапсус золотистий 40-50см", "price": 280, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 20},
    {"id": "prod-kimn032", "article": "KIMN-032", "name": "Циссус ромболистий 50-60см", "price": 250, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 18},
    {"id": "prod-kimn033", "article": "KIMN-033", "name": "Плющ звичайний 40-50см", "price": 220, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["new"], "stock": 22},
    {"id": "prod-kimn034", "article": "KIMN-034", "name": "Традесканція зебрина 30-40см", "price": 180, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 25},
    
    # Квітучі
    {"id": "prod-kimn035", "article": "KIMN-035", "name": "Бегонія еліатор червона 25-30см", "price": 320, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 15},
    {"id": "prod-kimn036", "article": "KIMN-036", "name": "Цикламен персидський 25-30см", "price": 350, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 12},
    {"id": "prod-kimn037", "article": "KIMN-037", "name": "Каланхое Блоссфельда мікс 20-25см", "price": 200, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["new"], "stock": 20},
    {"id": "prod-kimn038", "article": "KIMN-038", "name": "Сенполія (фіалка) мікс 15-20см", "price": 150, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 30},
    {"id": "prod-kimn039", "article": "KIMN-039", "name": "Азалія індійська 30-40см", "price": 480, "old_price": 550, "discount": 13, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["sale"], "stock": 10},
    
    # Орхідеї
    {"id": "prod-kimn040", "article": "KIMN-040", "name": "Орхідея Фаленопсис біла 50-60см", "price": 550, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 12},
    {"id": "prod-kimn041", "article": "KIMN-041", "name": "Орхідея Фаленопсис рожева 50-60см", "price": 550, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 12},
    {"id": "prod-kimn042", "article": "KIMN-042", "name": "Орхідея Фаленопсис мікс 45-55см", "price": 500, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 15},
    {"id": "prod-kimn043", "article": "KIMN-043", "name": "Орхідея Дендробіум 50-60см", "price": 620, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["new"], "stock": 8},
    
    # Великі рослини
    {"id": "prod-kimn044", "article": "KIMN-044", "name": "Стрелітція королівська 100-120см", "price": 1200, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 5},
    {"id": "prod-kimn045", "article": "KIMN-045", "name": "Філодендрон монстера делісіоза 80-100см", "price": 750, "old_price": 850, "discount": 12, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["sale"], "stock": 8},
]

# Add descriptions
for p in new_indoor_plants:
    p["category"] = "Кімнатні рослини"
    p["description"] = f"{p['name']}. Декоративна кімнатна рослина для дому та офісу. Очищає повітря."
    if "old_price" not in p:
        p["old_price"] = None
    if "discount" not in p:
        p["discount"] = 0
    if "badges" not in p:
        p["badges"] = []

async def add_plants():
    print(f"🌿 Додавання {len(new_indoor_plants)} кімнатних рослин...")
    
    async with AsyncSessionLocal() as session:
        count = 0
        for prod_data in new_indoor_plants:
            try:
                product = Product(**prod_data)
                session.add(product)
                count += 1
                if count % 10 == 0:
                    await session.commit()
                    print(f"  ✅ {count}/{len(new_indoor_plants)}")
            except Exception as e:
                print(f"  ⚠️  {prod_data['id']}: {str(e)[:80]}")
        
        await session.commit()
        print(f"✅ Додано {count} кімнатних рослин!")

asyncio.run(add_plants())

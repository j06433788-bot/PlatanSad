"""
Script to seed the PostgreSQL database with initial data
"""
import asyncio
import os
from database import engine, Base, AsyncSessionLocal
from database import Product, Category
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Products data from platansad.prom.ua
PRODUCTS = [
    # ===== БОНСАЙ НІВАКІ =====
    {
        "id": "prod-001",
        "name": "Нівакі з сосни звичайної 185-190см",
        "article": "BN-044",
        "price": 47000,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg",
        "category": "Бонсай Нівакі",
        "badges": ["hit"],
        "description": "Ексклюзивний нівакі з сосни звичайної висотою 185-190 см. Японський стиль формування.",
        "stock": 1
    },
    {
        "id": "prod-002",
        "name": "Нівакі з сосни звичайної 130см",
        "article": "BN-073",
        "price": 6000,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6826569009_w640_h640_nivaki-z-sosni.jpg",
        "category": "Бонсай Нівакі",
        "badges": ["new"],
        "description": "Нівакі з сосни звичайної висотою 130 см. Ідеально для невеликого саду.",
        "stock": 3
    },
    {
        "id": "prod-003",
        "name": "Нівакі з туї Міккі",
        "article": "BN-011",
        "price": 1200,
        "oldPrice": 1400,
        "discount": 14,
        "image": "https://images.prom.ua/5914702282_w640_h640_nivaki-z-tuyi.jpg",
        "category": "Бонсай Нівакі",
        "badges": ["sale", "hit"],
        "description": "Нівакі формований з туї Міккі. Компактний та декоративний.",
        "stock": 14
    },
    {
        "id": "prod-004",
        "name": "Нівакі з сосни звичайної 165-170см",
        "article": "BN-012",
        "price": 12000,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6808172167_w640_h640_nivaki-z-sosni.jpg",
        "category": "Бонсай Нівакі",
        "badges": ["hit"],
        "description": "Нівакі з сосни звичайної висотою 165-170 см.",
        "stock": 2
    },
    {
        "id": "prod-005",
        "name": "Нівакі з сосни звичайної 180см",
        "article": "BN-016",
        "price": 52000,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6808176030_w640_h640_nivaki-z-sosni.jpg",
        "category": "Бонсай Нівакі",
        "badges": ["hit"],
        "description": "Преміум нівакі з сосни звичайної висотою 180 см. Унікальна форма.",
        "stock": 1
    },
    {
        "id": "prod-006",
        "name": "Нівакі з сосни звичайної 200-210см",
        "article": "BN-019",
        "price": 75000,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6808180971_w640_h640_nivaki-z-sosni.jpg",
        "category": "Бонсай Нівакі",
        "badges": ["hit"],
        "description": "Ексклюзивний великий нівакі з сосни звичайної висотою 200-210 см.",
        "stock": 1
    },
    {
        "id": "prod-007",
        "name": "Нівакі з сосни звичайної 160см",
        "article": "BN-021",
        "price": 14000,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6808182554_w640_h640_nivaki-z-sosni.jpg",
        "category": "Бонсай Нівакі",
        "badges": ["new"],
        "description": "Нівакі з сосни звичайної висотою 160 см.",
        "stock": 2
    },
    {
        "id": "prod-008",
        "name": "Нівакі з сосни звичайної 250см",
        "article": "BN-024",
        "price": 85000,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6826415143_w640_h640_nivaki-z-sosni.jpg",
        "category": "Бонсай Нівакі",
        "badges": ["hit"],
        "description": "Найбільший нівакі з сосни звичайної висотою 250 см. Для великих ділянок.",
        "stock": 1
    },
    {
        "id": "prod-009",
        "name": "Сосна на штамбі 200см",
        "article": "BN-025",
        "price": 6500,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6808184185_w640_h640_sosna-na-shtambi.jpg",
        "category": "Бонсай Нівакі",
        "badges": ["new"],
        "description": "Сосна на штамбі висотою 200 см.",
        "stock": 3
    },
    {
        "id": "prod-010",
        "name": "Сосна на штамбі 145-150см",
        "article": "BN-030",
        "price": 4500,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6808188513_w640_h640_sosna-na-shtambi.jpg",
        "category": "Бонсай Нівакі",
        "badges": [],
        "description": "Сосна на штамбі висотою 145-150 см.",
        "stock": 5
    },
    # ===== ТУЯ СМАРАГД =====
    {
        "id": "prod-011",
        "name": "Туя Смарагд 60 см",
        "article": "TS-060",
        "price": 180,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6760915146_w640_h640_tuya-smaragd-60.jpg",
        "category": "Туя Смарагд",
        "badges": [],
        "description": "Туя Смарагд висотою 60 см. Ідеальна для живоплоту.",
        "stock": 50
    },
    {
        "id": "prod-012",
        "name": "Туя Смарагд 80 см",
        "article": "TS-080",
        "price": 250,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/5065359244_w640_h640_tuya-smaragd-80.jpg",
        "category": "Туя Смарагд",
        "badges": [],
        "description": "Туя Смарагд висотою 80 см.",
        "stock": 40
    },
    {
        "id": "prod-013",
        "name": "Туя Смарагд 100 см",
        "article": "TS-100",
        "price": 300,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6698604456_w640_h640_tuya-smaragd-100.jpg",
        "category": "Туя Смарагд",
        "badges": ["hit"],
        "description": "Туя Смарагд висотою 100 см. Топ продажів!",
        "stock": 35
    },
    {
        "id": "prod-014",
        "name": "Туя Смарагд 180-200 см",
        "article": "TS-180",
        "price": 850,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6698603881_w640_h640_tuya-smaragd-180-200.jpg",
        "category": "Туя Смарагд",
        "badges": ["hit"],
        "description": "Туя Смарагд висотою 180-200 см.",
        "stock": 20
    },
    {
        "id": "prod-015",
        "name": "Туя Смарагд 200-220 см",
        "article": "TS-200",
        "price": 950,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6563421916_w640_h640_tuya-smaragd-200-220.jpg",
        "category": "Туя Смарагд",
        "badges": ["hit"],
        "description": "Туя Смарагд висотою 200-220 см. Топ продажів!",
        "stock": 15
    },
    {
        "id": "prod-016",
        "name": "Туя Смарагд 2.2 м+",
        "article": "TS-220",
        "price": 1100,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6102340297_w640_h640_tuya-smaragd-22.jpg",
        "category": "Туя Смарагд",
        "badges": [],
        "description": "Туя Смарагд висотою від 2.2 метра.",
        "stock": 10
    },
    {
        "id": "prod-017",
        "name": "Туя Смарагд 2.5-2.7м",
        "article": "TS-250",
        "price": 1800,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6698621119_w640_h640_tuya-smaragd-25-27m.jpg",
        "category": "Туя Смарагд",
        "badges": [],
        "description": "Туя Смарагд висотою 2.5-2.7 метра.",
        "stock": 8
    },
    {
        "id": "prod-018",
        "name": "Туя Смарагд 300 см",
        "article": "TS-300",
        "price": 3200,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6772165290_w640_h640_tuya-smaragd-300.jpg",
        "category": "Туя Смарагд",
        "badges": ["new"],
        "description": "Туя Смарагд висотою 300 см. Велика рослина.",
        "stock": 5
    },
    {
        "id": "prod-019",
        "name": "Туя Смарагд 350 см",
        "article": "TS-350",
        "price": 4500,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6772166768_w640_h640_tuya-smaragd-350.jpg",
        "category": "Туя Смарагд",
        "badges": [],
        "description": "Туя Смарагд висотою 350 см.",
        "stock": 3
    },
    {
        "id": "prod-020",
        "name": "Туя Смарагд 400 см",
        "article": "TS-400",
        "price": 6500,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6293670891_w640_h640_tuya-smaragd-400.jpg",
        "category": "Туя Смарагд",
        "badges": ["hit"],
        "description": "Туя Смарагд висотою 400 см. Ексклюзивний розмір!",
        "stock": 2
    },
    {
        "id": "prod-021",
        "name": "Туя Смарагд преміум 130 см",
        "article": "TSP-130",
        "price": 650,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/4873260355_w640_h640_tuya-smaragd-premium.jpg",
        "category": "Туя Смарагд",
        "badges": ["new"],
        "description": "Туя Смарагд преміум якості висотою 130 см.",
        "stock": 12
    },
    {
        "id": "prod-022",
        "name": "Туя Смарагд преміум 200 см+",
        "article": "TSP-200",
        "price": 1350,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6761402555_w640_h640_tuya-smaragd-premium.jpg",
        "category": "Туя Смарагд",
        "badges": ["new"],
        "description": "Туя Смарагд преміум якості висотою від 200 см.",
        "stock": 6
    },
    {
        "id": "prod-023",
        "name": "Топіар з туї Смарагд",
        "article": "TTS-001",
        "price": 3200,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/5827114652_w640_h640_topiar-z-tuyi.jpg",
        "category": "Туя Смарагд",
        "badges": ["hit", "new"],
        "description": "Топіар з туї Смарагд - декоративна формована рослина.",
        "stock": 8
    },
    {
        "id": "prod-024",
        "name": "Топіар формований з туя Смарагд 3.5м+",
        "article": "TTS-350",
        "price": 4800,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6698623263_w640_h640_topiar-formovanij-z.jpg",
        "category": "Туя Смарагд",
        "badges": ["new"],
        "description": "Топіар формований з туї Смарагд висотою від 3.5 м.",
        "stock": 2
    },
    # ===== ТУЯ КОЛУМНА =====
    {
        "id": "prod-025",
        "name": "Спіраль з туї Колумна 2.2м",
        "article": "TK-220",
        "price": 3900,
        "oldPrice": 4300,
        "discount": 9,
        "image": "https://images.prom.ua/6698631500_w640_h640_spiral-z-tuyi.jpg",
        "category": "Туя Колумна",
        "badges": ["sale", "hit"],
        "description": "Спіраль з туї Колумна висотою 2.2 метри.",
        "stock": 5
    },
    {
        "id": "prod-026",
        "name": "Спіраль з туї Колумна 2.5м",
        "article": "TK-250",
        "price": 4500,
        "oldPrice": 5000,
        "discount": 10,
        "image": "https://images.prom.ua/6698630840_w640_h640_spiral-z-tuyi.jpg",
        "category": "Туя Колумна",
        "badges": ["sale"],
        "description": "Спіраль з туї Колумна висотою 2.5 метри.",
        "stock": 4
    },
    # ===== САМШИТ =====
    {
        "id": "prod-027",
        "name": "Топіари стрижені з самшиту ярусами 1.3м+",
        "article": "SA-130",
        "price": 2500,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6163584185_w640_h640_topiari-strizheni-z.jpg",
        "category": "Самшит",
        "badges": ["hit"],
        "description": "Топіарі стрижені з самшиту ярусами висотою від 1.3 метра.",
        "stock": 10
    },
    # ===== ХВОЙНІ РОСЛИНИ =====
    {
        "id": "prod-028",
        "name": "Тоскана 1.7 м +",
        "article": "HR-170",
        "price": 3200,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6347644996_w640_h640_toskana-17-m.jpg",
        "category": "Хвойні рослини",
        "badges": ["hit", "new"],
        "description": "Тоскана висотою від 1.7 метра.",
        "stock": 6
    },
    {
        "id": "prod-029",
        "name": "Тоскана 1.5 м",
        "article": "HR-150",
        "price": 2400,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6347645156_w640_h640_toskana-15-m.jpg",
        "category": "Хвойні рослини",
        "badges": [],
        "description": "Тоскана висотою 1.5 метра.",
        "stock": 8
    },
    {
        "id": "prod-030",
        "name": "Карликова туя 1.0м+",
        "article": "HR-100",
        "price": 550,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/5914733530_w640_h640_karlikova-tuya-vid.jpg",
        "category": "Хвойні рослини",
        "badges": ["new"],
        "description": "Карликова туя висотою від 1.0 метра.",
        "stock": 15
    },
    {
        "id": "prod-031",
        "name": "Топіар з Зебріни голд 1.7 м",
        "article": "HR-ZG",
        "price": 13000,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6300640174_w640_h640_topiar-z-zebrini.jpg",
        "category": "Хвойні рослини",
        "badges": ["hit"],
        "description": "Унікальний топіар з Зебріни голд висотою 1.7 м.",
        "stock": 1
    },
    {
        "id": "prod-032",
        "name": "Нівакі формований з Ельвангери",
        "article": "HR-EL",
        "price": 9700,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6287866689_w640_h640_nivaki-formovanij-z.jpg",
        "category": "Хвойні рослини",
        "badges": ["new"],
        "description": "Нівакі формований з Ельвангери.",
        "stock": 2
    },
    {
        "id": "prod-033",
        "name": "Топіар формований з Ялиці білої 1.7 м",
        "article": "HR-YB",
        "price": 5100,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6288011648_w640_h640_topiar-formovanij-z.jpg",
        "category": "Хвойні рослини",
        "badges": [],
        "description": "Топіар формований з Ялиці білої висотою 1.7 м.",
        "stock": 3
    },
    {
        "id": "prod-034",
        "name": "Топіар з туї Смарагд 1.7 м+",
        "article": "HR-TS17",
        "price": 3200,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6287861219_w640_h640_topiar-z-tuyi.jpg",
        "category": "Хвойні рослини",
        "badges": ["hit"],
        "description": "Топіар з туї Смарагд висотою від 1.7 м.",
        "stock": 4
    },
    # ===== ЛИСТОПАДНІ ДЕРЕВА ТА КУЩІ =====
    {
        "id": "prod-035",
        "name": "Верба Хакуро Нішікі 1.2-1.3 м штамб",
        "article": "LD-VH",
        "price": 550,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6929254264_w640_h640_verba-hakuro-nishiki12-13.jpg",
        "category": "Листопадні дерева та кущі",
        "badges": ["new", "hit"],
        "description": "Верба Хакуро Нішікі на штамбі висотою 1.2-1.3 метра.",
        "stock": 12
    },
    # ===== КУЛЯСТА ТУЯ ГЛОБОСА =====
    {
        "id": "prod-036",
        "name": "Куляста Туя Глобоса",
        "article": "TG-001",
        "price": 420,
        "oldPrice": 480,
        "discount": 13,
        "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg",
        "category": "Куляста Туя Глобоса",
        "badges": ["sale"],
        "description": "Туя кулястої форми Глобоза.",
        "stock": 20
    },
    # ===== ЯЛИНА =====
    {
        "id": "prod-037",
        "name": "Ялина звичайна",
        "article": "YA-001",
        "price": 350,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg",
        "category": "Ялина",
        "badges": [],
        "description": "Ялина звичайна для озеленення.",
        "stock": 25
    },
    # ===== КАТАЛЬПА =====
    {
        "id": "prod-038",
        "name": "Катальпа",
        "article": "KA-001",
        "price": 800,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg",
        "category": "Катальпа",
        "badges": [],
        "description": "Катальпа - декоративне листопадне дерево.",
        "stock": 8
    },
    # ===== КІМНАТНІ РОСЛИНИ =====
    {
        "id": "prod-039",
        "name": "Кімнатна рослина",
        "article": "KR-001",
        "price": 250,
        "oldPrice": None,
        "discount": 0,
        "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg",
        "category": "Кімнатні рослини",
        "badges": ["new"],
        "description": "Кімнатна декоративна рослина.",
        "stock": 30
    }
]

# Categories data from platansad.prom.ua
CATEGORIES = [
    {
        "id": "cat-001",
        "name": "Бонсай Нівакі",
        "icon": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg",
        "count": 101
    },
    {
        "id": "cat-002",
        "name": "Туя Колумна",
        "icon": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg",
        "count": 13
    },
    {
        "id": "cat-003",
        "name": "Туя Смарагд",
        "icon": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg",
        "count": 23
    },
    {
        "id": "cat-004",
        "name": "Самшит",
        "icon": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg",
        "count": 33
    },
    {
        "id": "cat-005",
        "name": "Хвойні рослини",
        "icon": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg",
        "count": 47
    },
    {
        "id": "cat-006",
        "name": "Листопадні дерева та кущі",
        "icon": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg",
        "count": 47
    },
    {
        "id": "cat-007",
        "name": "Куляста Туя Глобоса",
        "icon": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg",
        "count": 6
    },
    {
        "id": "cat-008",
        "name": "Катальпа",
        "icon": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg",
        "count": 4
    },
    {
        "id": "cat-009",
        "name": "Ялина",
        "icon": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg",
        "count": 20
    },
    {
        "id": "cat-010",
        "name": "Кімнатні рослини",
        "icon": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg",
        "count": 21
    }
]


async def seed_database():
    """Seed the PostgreSQL database with initial data"""
    print("🌱 Starting PostgreSQL database seeding...")
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("📋 Tables created")
    
    # Clear existing data and insert new
    async with AsyncSessionLocal() as session:
        # Clear existing data
        print("Clearing existing products and categories...")
        await session.execute(Product.__table__.delete())
        await session.execute(Category.__table__.delete())
        await session.commit()
        
        # Insert products
        print(f"Inserting {len(PRODUCTS)} products...")
        for product_data in PRODUCTS:
            product = Product(
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
                stock=product_data.get('stock', 100)
            )
            session.add(product)
        
        await session.commit()
        print(f"✅ Inserted {len(PRODUCTS)} products")
        
        # Insert categories
        print(f"Inserting {len(CATEGORIES)} categories...")
        for category_data in CATEGORIES:
            category = Category(
                id=category_data['id'],
                name=category_data['name'],
                icon=category_data['icon'],
                count=category_data.get('count', 0)
            )
            session.add(category)
        
        await session.commit()
        print(f"✅ Inserted {len(CATEGORIES)} categories")
    
    print("✨ PostgreSQL database seeding completed!")
    
    # Close engine
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_database())

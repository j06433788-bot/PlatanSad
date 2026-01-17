"""
Extended seed data with full product catalog - 200+ products
"""
import asyncio
import os
from database import engine, Base, AsyncSessionLocal
from database import Product, Category
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# CATEGORIES
CATEGORIES = [
    {"id": "cat-001", "name": "Бонсай Нівакі", "icon": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg"},
    {"id": "cat-002", "name": "Туя Колумна", "icon": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg"},
    {"id": "cat-003", "name": "Туя Смарагд", "icon": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg"},
    {"id": "cat-004", "name": "Самшит", "icon": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg"},
    {"id": "cat-005", "name": "Хвойні рослини", "icon": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg"},
    {"id": "cat-006", "name": "Листопадні дерева та кущі", "icon": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg"},
    {"id": "cat-007", "name": "Куляста Туя Глобоса", "icon": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg"},
    {"id": "cat-008", "name": "Катальпа", "icon": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg"},
    {"id": "cat-009", "name": "Ялина", "icon": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg"},
    {"id": "cat-010", "name": "Кімнатні рослини", "icon": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg"},
]

# PRODUCTS - 200+ items across all categories
PRODUCTS = []

# === БОНСАЙ НІВАКІ (20 товарів) ===
bonsai_products = [
    {"id": "prod-b001", "name": "Нівакі з сосни звичайної 185-190см", "price": 47000, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "badges": ["hit"], "stock": 1},
    {"id": "prod-b002", "name": "Нівакі з сосни звичайної 130см", "price": 6000, "image": "https://images.prom.ua/6826569009_w640_h640_nivaki-z-sosni.jpg", "badges": ["new"], "stock": 3},
    {"id": "prod-b003", "name": "Нівакі з туї Міккі", "price": 1200, "oldPrice": 1400, "discount": 14, "image": "https://images.prom.ua/5914702282_w640_h640_nivaki-z-tuyi.jpg", "badges": ["sale"], "stock": 5},
    {"id": "prod-b004", "name": "Нівакі з сосни чорної 150см", "price": 12000, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "stock": 2},
    {"id": "prod-b005", "name": "Нівакі з ялини колючої Глаука Глобоза", "price": 8500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["hit"], "stock": 4},
    {"id": "prod-b006", "name": "Нівакі з ялини звичайної 120см", "price": 5500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "stock": 3},
    {"id": "prod-b007", "name": "Бонсай з сосни гірської Мугус", "price": 3500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["new"], "stock": 6},
    {"id": "prod-b008", "name": "Нівакі з можжевельника китайського", "price": 7500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "stock": 2},
    {"id": "prod-b009", "name": "Нівакі з сосни Веймутова 140см", "price": 9500, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "stock": 3},
    {"id": "prod-b010", "name": "Бонсай з ялиці корейської", "price": 6500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["hit"], "stock": 4},
    {"id": "prod-b011", "name": "Нівакі з ялиці одноколірної 160см", "price": 15000, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "stock": 1},
    {"id": "prod-b012", "name": "Нівакі з сосни кедрової європейської", "price": 11000, "image": "https://images.prom.ua/6826569009_w640_h640_nivaki-z-sosni.jpg", "stock": 2},
    {"id": "prod-b013", "name": "Бонсай з модрини європейської", "price": 5000, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["new"], "stock": 5},
    {"id": "prod-b014", "name": "Нівакі з тису ягідного 130см", "price": 14000, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["hit"], "stock": 2},
    {"id": "prod-b015", "name": "Нівакі з кипарисовика Лавсона", "price": 7800, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "stock": 3},
    {"id": "prod-b016", "name": "Бонсай з туї західної Даніка", "price": 2500, "oldPrice": 3000, "discount": 17, "image": "https://images.prom.ua/5914702282_w640_h640_nivaki-z-tuyi.jpg", "badges": ["sale"], "stock": 8},
    {"id": "prod-b017", "name": "Нівакі з сосни звичайної Ватереріподібна", "price": 10500, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "stock": 2},
    {"id": "prod-b018", "name": "Нівакі з ялиці благородної 150см", "price": 18000, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["hit"], "stock": 1},
    {"id": "prod-b019", "name": "Бонсай з псевдотсуги Мензіса", "price": 8000, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "stock": 3},
    {"id": "prod-b020", "name": "Нівакі з ялини сербської 170см", "price": 13500, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "badges": ["new"], "stock": 2},
]
for p in bonsai_products:
    p["category"] = "Бонсай Нівакі"
    p["description"] = f"{p['name']}. Формована рослина в японському стилі. Ідеально для декоративного саду."
    if "oldPrice" not in p: p["oldPrice"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(bonsai_products)

# === ТУЯ КОЛУМНА (20 товарів) ===
columna_products = [
    {"id": "prod-tc001", "name": "Туя Колумна 80-100см", "price": 350, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 50},
    {"id": "prod-tc002", "name": "Туя Колумна 100-120см", "price": 450, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 45},
    {"id": "prod-tc003", "name": "Туя Колумна 120-140см", "price": 550, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["new"], "stock": 40},
    {"id": "prod-tc004", "name": "Туя Колумна 140-160см", "price": 700, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 35},
    {"id": "prod-tc005", "name": "Туя Колумна 160-180см", "price": 850, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 30},
    {"id": "prod-tc006", "name": "Туя Колумна 180-200см", "price": 1000, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 25},
    {"id": "prod-tc007", "name": "Туя Колумна 200-220см", "price": 1200, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 20},
    {"id": "prod-tc008", "name": "Туя Колумна 220-240см", "price": 1400, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 18},
    {"id": "prod-tc009", "name": "Туя Колумна 240-260см", "price": 1650, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 15},
    {"id": "prod-tc010", "name": "Туя Колумна 260-280см", "price": 1900, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 12},
    {"id": "prod-tc011", "name": "Туя Колумна 280-300см", "price": 2200, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 10},
    {"id": "prod-tc012", "name": "Туя Колумна 300-320см", "price": 2500, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 8},
    {"id": "prod-tc013", "name": "Туя Колумна 320-340см", "price": 2850, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 6},
    {"id": "prod-tc014", "name": "Туя Колумна 340-360см", "price": 3200, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["new"], "stock": 5},
    {"id": "prod-tc015", "name": "Туя Колумна 360-380см", "price": 3600, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 4},
    {"id": "prod-tc016", "name": "Туя Колумна 380-400см", "price": 4000, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 3},
    {"id": "prod-tc017", "name": "Туя Колумна 400-420см", "price": 4500, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 2},
    {"id": "prod-tc018", "name": "Туя Колумна формована 150см", "price": 900, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["new"], "stock": 15},
    {"id": "prod-tc019", "name": "Туя Колумна формована 200см", "price": 1300, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 12},
    {"id": "prod-tc020", "name": "Туя Колумна формована 250см", "price": 1800, "oldPrice": 2000, "discount": 10, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["sale"], "stock": 10},
]
for p in columna_products:
    p["category"] = "Туя Колумна"
    p["description"] = f"{p['name']}. Колоновидна форма, ідеально для живоплоту та акцентів в саду."
    if "oldPrice" not in p: p["oldPrice"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(columna_products)

print("Part 1 loaded: Bonsai Nivaki (20) + Tuya Columna (20)")

# === ТУЯ СМАРАГД (25 товарів) ===
smaragd_products = [
    {"id": "prod-ts001", "name": "Туя Смарагд 60-80см", "price": 280, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 60},
    {"id": "prod-ts002", "name": "Туя Смарагд 80-100см", "price": 350, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 55},
    {"id": "prod-ts003", "name": "Туя Смарагд 100-120см", "price": 450, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["new"], "stock": 50},
    {"id": "prod-ts004", "name": "Туя Смарагд 120-140см", "price": 550, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 45},
    {"id": "prod-ts005", "name": "Туя Смарагд 140-160см", "price": 700, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 40},
    {"id": "prod-ts006", "name": "Туя Смарагд 160-180см", "price": 850, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 35},
    {"id": "prod-ts007", "name": "Туя Смарагд 180-200см", "price": 1000, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 30},
    {"id": "prod-ts008", "name": "Туя Смарагд 200-220см", "price": 1200, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 25},
    {"id": "prod-ts009", "name": "Туя Смарагд 220-240см", "price": 1400, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 20},
    {"id": "prod-ts010", "name": "Туя Смарагд 240-260см", "price": 1650, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 18},
    {"id": "prod-ts011", "name": "Туя Смарагд 260-280см", "price": 1900, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 15},
    {"id": "prod-ts012", "name": "Туя Смарагд 280-300см", "price": 2200, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 12},
    {"id": "prod-ts013", "name": "Туя Смарагд 300-320см", "price": 2500, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 10},
    {"id": "prod-ts014", "name": "Туя Смарагд 320-340см", "price": 2850, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["new"], "stock": 8},
    {"id": "prod-ts015", "name": "Туя Смарагд 340-360см", "price": 3200, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 6},
    {"id": "prod-ts016", "name": "Туя Смарагд 360-380см", "price": 3600, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 5},
    {"id": "prod-ts017", "name": "Туя Смарагд 380-400см", "price": 4000, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 4},
    {"id": "prod-ts018", "name": "Туя Смарагд 400-420см", "price": 4500, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 3},
    {"id": "prod-ts019", "name": "Туя Смарагд формована 150см", "price": 900, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["new"], "stock": 20},
    {"id": "prod-ts020", "name": "Туя Смарагд формована 200см", "price": 1300, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 15},
    {"id": "prod-ts021", "name": "Туя Смарагд формована 250см", "price": 1800, "oldPrice": 2000, "discount": 10, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["sale"], "stock": 12},
    {"id": "prod-ts022", "name": "Туя Смарагд спіраль 180см", "price": 1500, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 8},
    {"id": "prod-ts023", "name": "Туя Смарагд спіраль 220см", "price": 2000, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 6},
    {"id": "prod-ts024", "name": "Туя Смарагд помпон 150см", "price": 1200, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["new"], "stock": 10},
    {"id": "prod-ts025", "name": "Туя Смарагд помпон 200см", "price": 1700, "oldPrice": 1900, "discount": 11, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["sale"], "stock": 8},
]
for p in smaragd_products:
    p["category"] = "Туя Смарагд"
    p["description"] = f"{p['name']}. Вузькоконічна форма, насичений зелений колір цілий рік."
    if "oldPrice" not in p: p["oldPrice"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(smaragd_products)

# === САМШИТ (15 товарів) ===
samshit_products = [
    {"id": "prod-sam001", "name": "Самшит вічнозелений 20-30см", "price": 180, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 100},
    {"id": "prod-sam002", "name": "Самшит вічнозелений 30-40см", "price": 250, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 90},
    {"id": "prod-sam003", "name": "Самшит вічнозелений 40-50см", "price": 350, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["new"], "stock": 80},
    {"id": "prod-sam004", "name": "Самшит вічнозелений 50-60см", "price": 450, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 70},
    {"id": "prod-sam005", "name": "Самшит вічнозелений 60-70см", "price": 600, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 60},
    {"id": "prod-sam006", "name": "Самшит вічнозелений куля D30см", "price": 400, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 40},
    {"id": "prod-sam007", "name": "Самшит вічнозелений куля D40см", "price": 600, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 35},
    {"id": "prod-sam008", "name": "Самшит вічнозелений куля D50см", "price": 850, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 25},
    {"id": "prod-sam009", "name": "Самшит вічнозелений спіраль 80см", "price": 1200, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["new"], "stock": 15},
    {"id": "prod-sam010", "name": "Самшит вічнозелений спіраль 100см", "price": 1500, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 12},
    {"id": "prod-sam011", "name": "Самшит вічнозелений конус 60см", "price": 700, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 30},
    {"id": "prod-sam012", "name": "Самшит вічнозелений конус 80см", "price": 950, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 25},
    {"id": "prod-sam013", "name": "Самшит вічнозелений помпон 70см", "price": 1000, "oldPrice": 1200, "discount": 17, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["sale"], "stock": 20},
    {"id": "prod-sam014", "name": "Самшит вічнозелений куб 50х50см", "price": 1100, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["new"], "stock": 15},
    {"id": "prod-sam015", "name": "Самшит вічнозелений штамб 120см", "price": 1800, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 10},
]
for p in samshit_products:
    p["category"] = "Самшит"
    p["description"] = f"{p['name']}. Вічнозелена рослина, відмінно формується, для живоплоту та топіарію."
    if "oldPrice" not in p: p["oldPrice"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(samshit_products)

print("Part 2 loaded: Tuya Smaragd (25) + Samshit (15)")

# === ХВОЙНІ РОСЛИНИ (30 товарів) ===
hvoyni_products = [
    {"id": "prod-hv001", "name": "Ялина звичайна 80-100см", "price": 300, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 45},
    {"id": "prod-hv002", "name": "Ялина колюча Глаука 60-80см", "price": 850, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 30},
    {"id": "prod-hv003", "name": "Ялина сербська 100-120см", "price": 550, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["new"], "stock": 25},
    {"id": "prod-hv004", "name": "Сосна звичайна 80-100см", "price": 280, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 50},
    {"id": "prod-hv005", "name": "Сосна чорна 60-80см", "price": 650, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 20},
    {"id": "prod-hv006", "name": "Сосна гірська Мугус 40-50см", "price": 450, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 40},
    {"id": "prod-hv007", "name": "Можжевельник казацький 30-40см", "price": 320, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 60},
    {"id": "prod-hv008", "name": "Можжевельник скельний Блю Арроу 80-100см", "price": 750, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 25},
    {"id": "prod-hv009", "name": "Можжевельник горизонтальний 30-40см", "price": 350, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 35},
    {"id": "prod-hv010", "name": "Ялиця корейська 60-80см", "price": 1200, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 15},
    {"id": "prod-hv011", "name": "Ялиця одноколірна 80-100см", "price": 1500, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 12},
    {"id": "prod-hv012", "name": "Ялиця Нордмана 60-80см", "price": 950, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 18},
    {"id": "prod-hv013", "name": "Модрина європейська 100-120см", "price": 600, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 20},
    {"id": "prod-hv014", "name": "Тис ягідний 40-50см", "price": 850, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 25},
    {"id": "prod-hv015", "name": "Кипарисовик Лавсона 60-80см", "price": 550, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 30},
    {"id": "prod-hv016", "name": "Псевдотсуга Мензіса 80-100см", "price": 900, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 15},
    {"id": "prod-hv017", "name": "Сосна Веймутова 80-100см", "price": 700, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 22},
    {"id": "prod-hv018", "name": "Сосна кедрова європейська 60-80см", "price": 1100, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 10},
    {"id": "prod-hv019", "name": "Ялина Енгельмана 80-100см", "price": 850, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "stock": 12},
    {"id": "prod-hv020", "name": "Можжевельник китайський Стрікта 60-80см", "price": 550, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 28},
    {"id": "prod-hv021", "name": "Туя західна Брабант 80-100см", "price": 350, "oldPrice": 400, "discount": 13, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["sale"], "stock": 40},
    {"id": "prod-hv022", "name": "Туя західна Голден Глоб 30-40см", "price": 400, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 35},
    {"id": "prod-hv023", "name": "Ялиця благородна 60-80см", "price": 1800, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 8},
    {"id": "prod-hv024", "name": "Кедр атласький 80-100см", "price": 2200, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 5},
    {"id": "prod-hv025", "name": "Можжевельник звичайний Хіберніка 80-100см", "price": 600, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 20},
    {"id": "prod-hv026", "name": "Ялина колюча Хопсі 60-80см", "price": 1200, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 15},
    {"id": "prod-hv027", "name": "Туя західна Тедді 20-30см", "price": 280, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 50},
    {"id": "prod-hv028", "name": "Сосна Банкса 60-80см", "price": 450, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 18},
    {"id": "prod-hv029", "name": "Ялина канадська Коніка 40-50см", "price": 500, "oldPrice": 600, "discount": 17, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["sale"], "stock": 30},
    {"id": "prod-hv030", "name": "Туя західна Даніка 20-25см", "price": 320, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 45},
]
for p in hvoyni_products:
    p["category"] = "Хвойні рослини"
    p["description"] = f"{p['name']}. Декоративна хвойна рослина для саду. Морозостійка, невибаглива."
    if "oldPrice" not in p: p["oldPrice"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(hvoyni_products)

print("Part 3 loaded: Hvoyni (30)")

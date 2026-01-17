"""
Extended seed data with full product catalog - 200+ products
"""
import asyncio
import os
from database import engine, Base, AsyncSessionLocal
from database import Product, Category
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path("/app/backend")
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
    {"id": "prod-b001", "article": "prod-b001", "name": "Нівакі з сосни звичайної 185-190см", "price": 47000, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "badges": ["hit"], "stock": 1},
    {"id": "prod-b002", "article": "prod-b002", "name": "Нівакі з сосни звичайної 130см", "price": 6000, "image": "https://images.prom.ua/6826569009_w640_h640_nivaki-z-sosni.jpg", "badges": ["new"], "stock": 3},
    {"id": "prod-b003", "article": "prod-b003", "name": "Нівакі з туї Міккі", "price": 1200, "old_price": 1400, "discount": 14, "image": "https://images.prom.ua/5914702282_w640_h640_nivaki-z-tuyi.jpg", "badges": ["sale"], "stock": 5},
    {"id": "prod-b004", "article": "prod-b004", "name": "Нівакі з сосни чорної 150см", "price": 12000, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "stock": 2},
    {"id": "prod-b005", "article": "prod-b005", "name": "Нівакі з ялини колючої Глаука Глобоза", "price": 8500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["hit"], "stock": 4},
    {"id": "prod-b006", "article": "prod-b006", "name": "Нівакі з ялини звичайної 120см", "price": 5500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "stock": 3},
    {"id": "prod-b007", "article": "prod-b007", "name": "Бонсай з сосни гірської Мугус", "price": 3500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["new"], "stock": 6},
    {"id": "prod-b008", "article": "prod-b008", "name": "Нівакі з можжевельника китайського", "price": 7500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "stock": 2},
    {"id": "prod-b009", "article": "prod-b009", "name": "Нівакі з сосни Веймутова 140см", "price": 9500, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "stock": 3},
    {"id": "prod-b010", "article": "prod-b010", "name": "Бонсай з ялиці корейської", "price": 6500, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["hit"], "stock": 4},
    {"id": "prod-b011", "article": "prod-b011", "name": "Нівакі з ялиці одноколірної 160см", "price": 15000, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "stock": 1},
    {"id": "prod-b012", "article": "prod-b012", "name": "Нівакі з сосни кедрової європейської", "price": 11000, "image": "https://images.prom.ua/6826569009_w640_h640_nivaki-z-sosni.jpg", "stock": 2},
    {"id": "prod-b013", "article": "prod-b013", "name": "Бонсай з модрини європейської", "price": 5000, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["new"], "stock": 5},
    {"id": "prod-b014", "article": "prod-b014", "name": "Нівакі з тису ягідного 130см", "price": 14000, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["hit"], "stock": 2},
    {"id": "prod-b015", "article": "prod-b015", "name": "Нівакі з кипарисовика Лавсона", "price": 7800, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "stock": 3},
    {"id": "prod-b016", "article": "prod-b016", "name": "Бонсай з туї західної Даніка", "price": 2500, "old_price": 3000, "discount": 17, "image": "https://images.prom.ua/5914702282_w640_h640_nivaki-z-tuyi.jpg", "badges": ["sale"], "stock": 8},
    {"id": "prod-b017", "article": "prod-b017", "name": "Нівакі з сосни звичайної Ватереріподібна", "price": 10500, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "stock": 2},
    {"id": "prod-b018", "article": "prod-b018", "name": "Нівакі з ялиці благородної 150см", "price": 18000, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "badges": ["hit"], "stock": 1},
    {"id": "prod-b019", "article": "prod-b019", "name": "Бонсай з псевдотсуги Мензіса", "price": 8000, "image": "https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg", "stock": 3},
    {"id": "prod-b020", "article": "prod-b020", "name": "Нівакі з ялини сербської 170см", "price": 13500, "image": "https://images.prom.ua/6815175822_w640_h640_nivaki-z-sosni.jpg", "badges": ["new"], "stock": 2},
]
for p in bonsai_products:
    p["category"] = "Бонсай Нівакі"
    p["description"] = f"{p['name']}. Формована рослина в японському стилі. Ідеально для декоративного саду."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(bonsai_products)

# === ТУЯ КОЛУМНА (20 товарів) ===
columna_products = [
    {"id": "prod-tc001", "article": "prod-tc001", "name": "Туя Колумна 80-100см", "price": 350, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 50},
    {"id": "prod-tc002", "article": "prod-tc002", "name": "Туя Колумна 100-120см", "price": 450, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 45},
    {"id": "prod-tc003", "article": "prod-tc003", "name": "Туя Колумна 120-140см", "price": 550, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["new"], "stock": 40},
    {"id": "prod-tc004", "article": "prod-tc004", "name": "Туя Колумна 140-160см", "price": 700, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 35},
    {"id": "prod-tc005", "article": "prod-tc005", "name": "Туя Колумна 160-180см", "price": 850, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 30},
    {"id": "prod-tc006", "article": "prod-tc006", "name": "Туя Колумна 180-200см", "price": 1000, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 25},
    {"id": "prod-tc007", "article": "prod-tc007", "name": "Туя Колумна 200-220см", "price": 1200, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 20},
    {"id": "prod-tc008", "article": "prod-tc008", "name": "Туя Колумна 220-240см", "price": 1400, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 18},
    {"id": "prod-tc009", "article": "prod-tc009", "name": "Туя Колумна 240-260см", "price": 1650, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 15},
    {"id": "prod-tc010", "article": "prod-tc010", "name": "Туя Колумна 260-280см", "price": 1900, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 12},
    {"id": "prod-tc011", "article": "prod-tc011", "name": "Туя Колумна 280-300см", "price": 2200, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 10},
    {"id": "prod-tc012", "article": "prod-tc012", "name": "Туя Колумна 300-320см", "price": 2500, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 8},
    {"id": "prod-tc013", "article": "prod-tc013", "name": "Туя Колумна 320-340см", "price": 2850, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 6},
    {"id": "prod-tc014", "article": "prod-tc014", "name": "Туя Колумна 340-360см", "price": 3200, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["new"], "stock": 5},
    {"id": "prod-tc015", "article": "prod-tc015", "name": "Туя Колумна 360-380см", "price": 3600, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 4},
    {"id": "prod-tc016", "article": "prod-tc016", "name": "Туя Колумна 380-400см", "price": 4000, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["hit"], "stock": 3},
    {"id": "prod-tc017", "article": "prod-tc017", "name": "Туя Колумна 400-420см", "price": 4500, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 2},
    {"id": "prod-tc018", "article": "prod-tc018", "name": "Туя Колумна формована 150см", "price": 900, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["new"], "stock": 15},
    {"id": "prod-tc019", "article": "prod-tc019", "name": "Туя Колумна формована 200см", "price": 1300, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "stock": 12},
    {"id": "prod-tc020", "article": "prod-tc020", "name": "Туя Колумна формована 250см", "price": 1800, "old_price": 2000, "discount": 10, "image": "https://images.prom.ua/5107358816_w640_h640_tuya-kolumna-columna.jpg", "badges": ["sale"], "stock": 10},
]
for p in columna_products:
    p["category"] = "Туя Колумна"
    p["description"] = f"{p['name']}. Колоновидна форма, ідеально для живоплоту та акцентів в саду."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(columna_products)

print("Part 1 loaded: Bonsai Nivaki (20) + Tuya Columna (20)")

# === ТУЯ СМАРАГД (25 товарів) ===
smaragd_products = [
    {"id": "prod-ts001", "article": "prod-ts001", "name": "Туя Смарагд 60-80см", "price": 280, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 60},
    {"id": "prod-ts002", "article": "prod-ts002", "name": "Туя Смарагд 80-100см", "price": 350, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 55},
    {"id": "prod-ts003", "article": "prod-ts003", "name": "Туя Смарагд 100-120см", "price": 450, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["new"], "stock": 50},
    {"id": "prod-ts004", "article": "prod-ts004", "name": "Туя Смарагд 120-140см", "price": 550, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 45},
    {"id": "prod-ts005", "article": "prod-ts005", "name": "Туя Смарагд 140-160см", "price": 700, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 40},
    {"id": "prod-ts006", "article": "prod-ts006", "name": "Туя Смарагд 160-180см", "price": 850, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 35},
    {"id": "prod-ts007", "article": "prod-ts007", "name": "Туя Смарагд 180-200см", "price": 1000, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 30},
    {"id": "prod-ts008", "article": "prod-ts008", "name": "Туя Смарагд 200-220см", "price": 1200, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 25},
    {"id": "prod-ts009", "article": "prod-ts009", "name": "Туя Смарагд 220-240см", "price": 1400, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 20},
    {"id": "prod-ts010", "article": "prod-ts010", "name": "Туя Смарагд 240-260см", "price": 1650, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 18},
    {"id": "prod-ts011", "article": "prod-ts011", "name": "Туя Смарагд 260-280см", "price": 1900, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 15},
    {"id": "prod-ts012", "article": "prod-ts012", "name": "Туя Смарагд 280-300см", "price": 2200, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 12},
    {"id": "prod-ts013", "article": "prod-ts013", "name": "Туя Смарагд 300-320см", "price": 2500, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 10},
    {"id": "prod-ts014", "article": "prod-ts014", "name": "Туя Смарагд 320-340см", "price": 2850, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["new"], "stock": 8},
    {"id": "prod-ts015", "article": "prod-ts015", "name": "Туя Смарагд 340-360см", "price": 3200, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 6},
    {"id": "prod-ts016", "article": "prod-ts016", "name": "Туя Смарагд 360-380см", "price": 3600, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 5},
    {"id": "prod-ts017", "article": "prod-ts017", "name": "Туя Смарагд 380-400см", "price": 4000, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 4},
    {"id": "prod-ts018", "article": "prod-ts018", "name": "Туя Смарагд 400-420см", "price": 4500, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 3},
    {"id": "prod-ts019", "article": "prod-ts019", "name": "Туя Смарагд формована 150см", "price": 900, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["new"], "stock": 20},
    {"id": "prod-ts020", "article": "prod-ts020", "name": "Туя Смарагд формована 200см", "price": 1300, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 15},
    {"id": "prod-ts021", "article": "prod-ts021", "name": "Туя Смарагд формована 250см", "price": 1800, "old_price": 2000, "discount": 10, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["sale"], "stock": 12},
    {"id": "prod-ts022", "article": "prod-ts022", "name": "Туя Смарагд спіраль 180см", "price": 1500, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["hit"], "stock": 8},
    {"id": "prod-ts023", "article": "prod-ts023", "name": "Туя Смарагд спіраль 220см", "price": 2000, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "stock": 6},
    {"id": "prod-ts024", "article": "prod-ts024", "name": "Туя Смарагд помпон 150см", "price": 1200, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["new"], "stock": 10},
    {"id": "prod-ts025", "article": "prod-ts025", "name": "Туя Смарагд помпон 200см", "price": 1700, "old_price": 1900, "discount": 11, "image": "https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg", "badges": ["sale"], "stock": 8},
]
for p in smaragd_products:
    p["category"] = "Туя Смарагд"
    p["description"] = f"{p['name']}. Вузькоконічна форма, насичений зелений колір цілий рік."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(smaragd_products)

# === САМШИТ (15 товарів) ===
samshit_products = [
    {"id": "prod-sam001", "article": "prod-sam001", "name": "Самшит вічнозелений 20-30см", "price": 180, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 100},
    {"id": "prod-sam002", "article": "prod-sam002", "name": "Самшит вічнозелений 30-40см", "price": 250, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 90},
    {"id": "prod-sam003", "article": "prod-sam003", "name": "Самшит вічнозелений 40-50см", "price": 350, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["new"], "stock": 80},
    {"id": "prod-sam004", "article": "prod-sam004", "name": "Самшит вічнозелений 50-60см", "price": 450, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 70},
    {"id": "prod-sam005", "article": "prod-sam005", "name": "Самшит вічнозелений 60-70см", "price": 600, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 60},
    {"id": "prod-sam006", "article": "prod-sam006", "name": "Самшит вічнозелений куля D30см", "price": 400, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 40},
    {"id": "prod-sam007", "article": "prod-sam007", "name": "Самшит вічнозелений куля D40см", "price": 600, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 35},
    {"id": "prod-sam008", "article": "prod-sam008", "name": "Самшит вічнозелений куля D50см", "price": 850, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 25},
    {"id": "prod-sam009", "article": "prod-sam009", "name": "Самшит вічнозелений спіраль 80см", "price": 1200, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["new"], "stock": 15},
    {"id": "prod-sam010", "article": "prod-sam010", "name": "Самшит вічнозелений спіраль 100см", "price": 1500, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 12},
    {"id": "prod-sam011", "article": "prod-sam011", "name": "Самшит вічнозелений конус 60см", "price": 700, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 30},
    {"id": "prod-sam012", "article": "prod-sam012", "name": "Самшит вічнозелений конус 80см", "price": 950, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "stock": 25},
    {"id": "prod-sam013", "article": "prod-sam013", "name": "Самшит вічнозелений помпон 70см", "price": 1000, "old_price": 1200, "discount": 17, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["sale"], "stock": 20},
    {"id": "prod-sam014", "article": "prod-sam014", "name": "Самшит вічнозелений куб 50х50см", "price": 1100, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["new"], "stock": 15},
    {"id": "prod-sam015", "article": "prod-sam015", "name": "Самшит вічнозелений штамб 120см", "price": 1800, "image": "https://images.prom.ua/5027226901_w640_h640_samshit-vichnozelenij-arborestsens.jpg", "badges": ["hit"], "stock": 10},
]
for p in samshit_products:
    p["category"] = "Самшит"
    p["description"] = f"{p['name']}. Вічнозелена рослина, відмінно формується, для живоплоту та топіарію."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(samshit_products)

print("Part 2 loaded: Tuya Smaragd (25) + Samshit (15)")

# === ХВОЙНІ РОСЛИНИ (30 товарів) ===
hvoyni_products = [
    {"id": "prod-hv001", "article": "prod-hv001", "name": "Ялина звичайна 80-100см", "price": 300, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 45},
    {"id": "prod-hv002", "article": "prod-hv002", "name": "Ялина колюча Глаука 60-80см", "price": 850, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 30},
    {"id": "prod-hv003", "article": "prod-hv003", "name": "Ялина сербська 100-120см", "price": 550, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["new"], "stock": 25},
    {"id": "prod-hv004", "article": "prod-hv004", "name": "Сосна звичайна 80-100см", "price": 280, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 50},
    {"id": "prod-hv005", "article": "prod-hv005", "name": "Сосна чорна 60-80см", "price": 650, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 20},
    {"id": "prod-hv006", "article": "prod-hv006", "name": "Сосна гірська Мугус 40-50см", "price": 450, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 40},
    {"id": "prod-hv007", "article": "prod-hv007", "name": "Можжевельник казацький 30-40см", "price": 320, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 60},
    {"id": "prod-hv008", "article": "prod-hv008", "name": "Можжевельник скельний Блю Арроу 80-100см", "price": 750, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 25},
    {"id": "prod-hv009", "article": "prod-hv009", "name": "Можжевельник горизонтальний 30-40см", "price": 350, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 35},
    {"id": "prod-hv010", "article": "prod-hv010", "name": "Ялиця корейська 60-80см", "price": 1200, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 15},
    {"id": "prod-hv011", "article": "prod-hv011", "name": "Ялиця одноколірна 80-100см", "price": 1500, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 12},
    {"id": "prod-hv012", "article": "prod-hv012", "name": "Ялиця Нордмана 60-80см", "price": 950, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 18},
    {"id": "prod-hv013", "article": "prod-hv013", "name": "Модрина європейська 100-120см", "price": 600, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 20},
    {"id": "prod-hv014", "article": "prod-hv014", "name": "Тис ягідний 40-50см", "price": 850, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 25},
    {"id": "prod-hv015", "article": "prod-hv015", "name": "Кипарисовик Лавсона 60-80см", "price": 550, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 30},
    {"id": "prod-hv016", "article": "prod-hv016", "name": "Псевдотсуга Мензіса 80-100см", "price": 900, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 15},
    {"id": "prod-hv017", "article": "prod-hv017", "name": "Сосна Веймутова 80-100см", "price": 700, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 22},
    {"id": "prod-hv018", "article": "prod-hv018", "name": "Сосна кедрова європейська 60-80см", "price": 1100, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 10},
    {"id": "prod-hv019", "article": "prod-hv019", "name": "Ялина Енгельмана 80-100см", "price": 850, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "stock": 12},
    {"id": "prod-hv020", "article": "prod-hv020", "name": "Можжевельник китайський Стрікта 60-80см", "price": 550, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 28},
    {"id": "prod-hv021", "article": "prod-hv021", "name": "Туя західна Брабант 80-100см", "price": 350, "old_price": 400, "discount": 13, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["sale"], "stock": 40},
    {"id": "prod-hv022", "article": "prod-hv022", "name": "Туя західна Голден Глоб 30-40см", "price": 400, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 35},
    {"id": "prod-hv023", "article": "prod-hv023", "name": "Ялиця благородна 60-80см", "price": 1800, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 8},
    {"id": "prod-hv024", "article": "prod-hv024", "name": "Кедр атласький 80-100см", "price": 2200, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 5},
    {"id": "prod-hv025", "article": "prod-hv025", "name": "Можжевельник звичайний Хіберніка 80-100см", "price": 600, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 20},
    {"id": "prod-hv026", "article": "prod-hv026", "name": "Ялина колюча Хопсі 60-80см", "price": 1200, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 15},
    {"id": "prod-hv027", "article": "prod-hv027", "name": "Туя західна Тедді 20-30см", "price": 280, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["new"], "stock": 50},
    {"id": "prod-hv028", "article": "prod-hv028", "name": "Сосна Банкса 60-80см", "price": 450, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "stock": 18},
    {"id": "prod-hv029", "article": "prod-hv029", "name": "Ялина канадська Коніка 40-50см", "price": 500, "old_price": 600, "discount": 17, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["sale"], "stock": 30},
    {"id": "prod-hv030", "article": "prod-hv030", "name": "Туя західна Даніка 20-25см", "price": 320, "image": "https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg", "badges": ["hit"], "stock": 45},
]
for p in hvoyni_products:
    p["category"] = "Хвойні рослини"
    p["description"] = f"{p['name']}. Декоративна хвойна рослина для саду. Морозостійка, невибаглива."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(hvoyni_products)

print("Part 3 loaded: Hvoyni (30)")

# === ЛИСТОПАДНІ ДЕРЕВА ТА КУЩІ (25 товарів) ===
listopadni_products = [
    {"id": "prod-ld001", "article": "prod-ld001", "name": "Верба Хакуро Нішікі 1.2-1.3м штамб", "price": 550, "image": "https://images.prom.ua/6929254264_w640_h640_verba-hakuro-nishiki12-13.jpg", "badges": ["hit"], "stock": 25},
    {"id": "prod-ld002", "article": "prod-ld002", "name": "Гортензія деревовидна Анабель 40-50см", "price": 350, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["new"], "stock": 40},
    {"id": "prod-ld003", "article": "prod-ld003", "name": "Гортензія метельчата Лаймлайт 50-60см", "price": 400, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 35},
    {"id": "prod-ld004", "article": "prod-ld004", "name": "Бузина чорна Блек Лейс 60-80см", "price": 450, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["hit"], "stock": 20},
    {"id": "prod-ld005", "article": "prod-ld005", "name": "Спірея японська Голдфлейм 30-40см", "price": 250, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 50},
    {"id": "prod-ld006", "article": "prod-ld006", "name": "Дерен білий Елегантіссіма 60-80см", "price": 300, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["new"], "stock": 30},
    {"id": "prod-ld007", "article": "prod-ld007", "name": "Пухироплідник калинолистий Діабло 60-80см", "price": 320, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 35},
    {"id": "prod-ld008", "article": "prod-ld008", "name": "Бересклет Форчуна Емеральд Гаєті 30-40см", "price": 280, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["hit"], "stock": 45},
    {"id": "prod-ld009", "article": "prod-ld009", "name": "Форзиція проміжна 60-80см", "price": 350, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 25},
    {"id": "prod-ld010", "article": "prod-ld010", "name": "Вейгела квітуча Ред Прінц 40-50см", "price": 300, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["new"], "stock": 30},
    {"id": "prod-ld011", "article": "prod-ld011", "name": "Барбарис Тунберга Атропурпуреа 40-50см", "price": 270, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 40},
    {"id": "prod-ld012", "article": "prod-ld012", "name": "Смородина альпійська Шмідт 60-80см", "price": 250, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["hit"], "stock": 35},
    {"id": "prod-ld013", "article": "prod-ld013", "name": "Чубушник вінцевий 60-80см", "price": 300, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 28},
    {"id": "prod-ld014", "article": "prod-ld014", "name": "Бузок звичайний фіолетовий 60-80см", "price": 400, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["new"], "stock": 22},
    {"id": "prod-ld015", "article": "prod-ld015", "name": "Калина бульденеж 60-80см", "price": 450, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["hit"], "stock": 18},
    {"id": "prod-ld016", "article": "prod-ld016", "name": "Айва японська 40-50см", "price": 280, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 25},
    {"id": "prod-ld017", "article": "prod-ld017", "name": "Кизильник блискучий 50-60см", "price": 220, "old_price": 270, "discount": 19, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["sale"], "stock": 40},
    {"id": "prod-ld018", "article": "prod-ld018", "name": "Глід одноматочковий 80-100см", "price": 350, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 15},
    {"id": "prod-ld019", "article": "prod-ld019", "name": "Шовковиця чорна 100-120см", "price": 550, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["hit"], "stock": 12},
    {"id": "prod-ld020", "article": "prod-ld020", "name": "Жасмин садовий 60-80см", "price": 320, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 30},
    {"id": "prod-ld021", "article": "prod-ld021", "name": "Айлант найвищий 80-100см", "price": 450, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["new"], "stock": 10},
    {"id": "prod-ld022", "article": "prod-ld022", "name": "Магонія падуболиста 30-40см", "price": 350, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 20},
    {"id": "prod-ld023", "article": "prod-ld023", "name": "Вишня декоративна Канзан 120-140см", "price": 850, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["hit"], "stock": 8},
    {"id": "prod-ld024", "article": "prod-ld024", "name": "Горобина звичайна 100-120см", "price": 400, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "stock": 15},
    {"id": "prod-ld025", "article": "prod-ld025", "name": "Бузина червона 60-80см", "price": 280, "old_price": 350, "discount": 20, "image": "https://images.prom.ua/701884790_w640_h640_listopadni-dereva-ta.jpg", "badges": ["sale"], "stock": 25},
]
for p in listopadni_products:
    p["category"] = "Листопадні дерева та кущі"
    p["description"] = f"{p['name']}. Декоративні листопадні рослини для ландшафтного дизайну."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(listopadni_products)

# === КУЛЯСТА ТУЯ ГЛОБОСА (10 товарів) ===
globosa_products = [
    {"id": "prod-glob001", "article": "prod-glob001", "name": "Туя Глобоса D20-25см", "price": 250, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "badges": ["hit"], "stock": 60},
    {"id": "prod-glob002", "article": "prod-glob002", "name": "Туя Глобоса D25-30см", "price": 320, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "stock": 50},
    {"id": "prod-glob003", "article": "prod-glob003", "name": "Туя Глобоса D30-35см", "price": 400, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "badges": ["new"], "stock": 45},
    {"id": "prod-glob004", "article": "prod-glob004", "name": "Туя Глобоса D35-40см", "price": 500, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "stock": 40},
    {"id": "prod-glob005", "article": "prod-glob005", "name": "Туя Глобоса D40-45см", "price": 650, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "badges": ["hit"], "stock": 35},
    {"id": "prod-glob006", "article": "prod-glob006", "name": "Туя Глобоса D45-50см", "price": 800, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "stock": 25},
    {"id": "prod-glob007", "article": "prod-glob007", "name": "Туя Глобоса D50-60см", "price": 1000, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "badges": ["new"], "stock": 20},
    {"id": "prod-glob008", "article": "prod-glob008", "name": "Туя Глобоса D60-70см", "price": 1300, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "stock": 15},
    {"id": "prod-glob009", "article": "prod-glob009", "name": "Туя Глобоса D70-80см", "price": 1600, "old_price": 1800, "discount": 11, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "badges": ["sale"], "stock": 10},
    {"id": "prod-glob010", "article": "prod-glob010", "name": "Туя Глобоса D80-90см", "price": 2000, "image": "https://images.prom.ua/4858672644_w640_h640_kulyasta-tuya-globosa.jpg", "badges": ["hit"], "stock": 8},
]
for p in globosa_products:
    p["category"] = "Куляста Туя Глобоса"
    p["description"] = f"{p['name']}. Компактна куляста форма, ідеально для альпінаріїв та контейнерів."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(globosa_products)

print("Part 4 loaded: Listopadni (25) + Globosa (10)")

# === КАТАЛЬПА (8 товарів) ===
katalpa_products = [
    {"id": "prod-kat001", "article": "prod-kat001", "name": "Катальпа бігнонієвидна 100-120см", "price": 600, "image": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg", "badges": ["hit"], "stock": 15},
    {"id": "prod-kat002", "article": "prod-kat002", "name": "Катальпа бігнонієвидна 120-140см", "price": 750, "image": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg", "stock": 12},
    {"id": "prod-kat003", "article": "prod-kat003", "name": "Катальпа бігнонієвидна 140-160см", "price": 900, "image": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg", "badges": ["new"], "stock": 10},
    {"id": "prod-kat004", "article": "prod-kat004", "name": "Катальпа бігнонієвидна Нана штамб 180см", "price": 1800, "image": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg", "badges": ["hit"], "stock": 8},
    {"id": "prod-kat005", "article": "prod-kat005", "name": "Катальпа бігнонієвидна Нана штамб 200см", "price": 2200, "image": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg", "stock": 6},
    {"id": "prod-kat006", "article": "prod-kat006", "name": "Катальпа гібридна 100-120см", "price": 650, "image": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg", "badges": ["new"], "stock": 10},
    {"id": "prod-kat007", "article": "prod-kat007", "name": "Катальпа великоквіткова 120-140см", "price": 850, "old_price": 950, "discount": 11, "image": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg", "badges": ["sale"], "stock": 8},
    {"id": "prod-kat008", "article": "prod-kat008", "name": "Катальпа бігнонієвидна Ауреа 100-120см", "price": 1200, "image": "https://images.prom.ua/4958829409_w640_h640_katalpa-catalpa.jpg", "badges": ["hit"], "stock": 5},
]
for p in katalpa_products:
    p["category"] = "Катальпа"
    p["description"] = f"{p['name']}. Декоративне дерево з великими листками та білими квітками."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(katalpa_products)

# === ЯЛИНА (12 товарів) ===
yalina_products = [
    {"id": "prod-yal001", "article": "prod-yal001", "name": "Ялина звичайна 60-80см", "price": 280, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["hit"], "stock": 50},
    {"id": "prod-yal002", "article": "prod-yal002", "name": "Ялина звичайна 80-100см", "price": 350, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "stock": 45},
    {"id": "prod-yal003", "article": "prod-yal003", "name": "Ялина колюча Глаука 60-80см", "price": 850, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["new"], "stock": 25},
    {"id": "prod-yal004", "article": "prod-yal004", "name": "Ялина колюча Хопсі 60-80см", "price": 1200, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["hit"], "stock": 15},
    {"id": "prod-yal005", "article": "prod-yal005", "name": "Ялина сербська 80-100см", "price": 500, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "stock": 30},
    {"id": "prod-yal006", "article": "prod-yal006", "name": "Ялина канадська Коніка 40-50см", "price": 500, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["hit"], "stock": 35},
    {"id": "prod-yal007", "article": "prod-yal007", "name": "Ялина Енгельмана 80-100см", "price": 850, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "stock": 12},
    {"id": "prod-yal008", "article": "prod-yal008", "name": "Ялина східна 60-80см", "price": 650, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["new"], "stock": 18},
    {"id": "prod-yal009", "article": "prod-yal009", "name": "Ялина колюча Глаука Глобоза 40-50см", "price": 900, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "stock": 20},
    {"id": "prod-yal010", "article": "prod-yal010", "name": "Ялина звичайна Інверса штамб 150см", "price": 1500, "old_price": 1700, "discount": 12, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["sale"], "stock": 8},
    {"id": "prod-yal011", "article": "prod-yal011", "name": "Ялина сербська Пендула 80-100см", "price": 1100, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "badges": ["hit"], "stock": 10},
    {"id": "prod-yal012", "article": "prod-yal012", "name": "Ялина чорна 80-100см", "price": 950, "image": "https://images.prom.ua/5027326802_w640_h640_yalina.jpg", "stock": 12},
]
for p in yalina_products:
    p["category"] = "Ялина"
    p["description"] = f"{p['name']}. Класична новорічна красуня, декоративна цілий рік."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(yalina_products)

# === КІМНАТНІ РОСЛИНИ (15 товарів) ===
kimnatni_products = [
    {"id": "prod-kim001", "article": "prod-kim001", "name": "Фікус Бенджаміна 80-100см", "price": 450, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 20},
    {"id": "prod-kim002", "article": "prod-kim002", "name": "Монстера Делі оса 60-80см", "price": 550, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 15},
    {"id": "prod-kim003", "article": "prod-kim003", "name": "Драцена Маргіната 80-100см", "price": 500, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["new"], "stock": 18},
    {"id": "prod-kim004", "article": "prod-kim004", "name": "Юка слонова 60-80см", "price": 600, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 12},
    {"id": "prod-kim005", "article": "prod-kim005", "name": "Спатифілум Світ Чіко 40-50см", "price": 320, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 25},
    {"id": "prod-kim006", "article": "prod-kim006", "name": "Антуріум Андре червоний 30-40см", "price": 400, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 20},
    {"id": "prod-kim007", "article": "prod-kim007", "name": "Замі окулькас 50-60см", "price": 450, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["new"], "stock": 15},
    {"id": "prod-kim008", "article": "prod-kim008", "name": "Сансевієрія трифасціата 40-50см", "price": 280, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 30},
    {"id": "prod-kim009", "article": "prod-kim009", "name": "Хлорофітум кучерявий 30-40см", "price": 200, "old_price": 250, "discount": 20, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["sale"], "stock": 35},
    {"id": "prod-kim010", "article": "prod-kim010", "name": "Алое Вера 30-40см", "price": 250, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 28},
    {"id": "prod-kim011", "article": "prod-kim011", "name": "Фікус каучуконосний 80-100см", "price": 500, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 15},
    {"id": "prod-kim012", "article": "prod-kim012", "name": "Кротон Пітра 40-50см", "price": 480, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["new"], "stock": 12},
    {"id": "prod-kim013", "article": "prod-kim013", "name": "Шефлера деревовидна 60-80см", "price": 420, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "stock": 18},
    {"id": "prod-kim014", "article": "prod-kim014", "name": "Дифенбахія 50-60см", "price": 380, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["hit"], "stock": 20},
    {"id": "prod-kim015", "article": "prod-kim015", "name": "Пальма Арека 100-120см", "price": 850, "old_price": 950, "discount": 11, "image": "https://images.prom.ua/6901216283_w640_h640_kimnatni-roslini.jpg", "badges": ["sale"], "stock": 8},
]
for p in kimnatni_products:
    p["category"] = "Кімнатні рослини"
    p["description"] = f"{p['name']}. Декоративна кімнатна рослина, очищає повітря."
    if "old_price" not in p: p["old_price"] = None
    if "discount" not in p: p["discount"] = 0
    if "badges" not in p: p["badges"] = []
PRODUCTS.extend(kimnatni_products)

print(f"Part 5 loaded: Katalpa (8) + Yalina (12) + Kimnatni (15)")
print(f"\n✅ TOTAL PRODUCTS: {len(PRODUCTS)}")

# === SEED FUNCTION ===
async def seed_database():
    """Seed database with categories and products"""
    print("🌱 Starting database seeding...")
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("📋 Tables created")
    
    async with AsyncSessionLocal() as session:
        print("Clearing existing data...")
        from sqlalchemy import delete
        await session.execute(delete(Product))
        await session.execute(delete(Category))
        await session.commit()
        
        print(f"Inserting {len(CATEGORIES)} categories...")
        for cat_data in CATEGORIES:
            category = Category(**cat_data)
            session.add(category)
        await session.commit()
        print(f"✅ Inserted {len(CATEGORIES)} categories")
        
        print(f"Inserting {len(PRODUCTS)} products...")
        for prod_data in PRODUCTS:
            product = Product(**prod_data)
            session.add(product)
        await session.commit()
        print(f"✅ Inserted {len(PRODUCTS)} products")
    
    print("✨ Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_database())

#!/usr/bin/env python3
"""
Скрипт імпорту даних у MySQL базу
Запуск: python import_data.py
"""
import asyncio
import json
import os
from datetime import datetime
from pathlib import Path

IMPORT_DIR = Path(__file__).parent / "export_data"

async def import_all_data():
    """Імпортує всі дані з JSON файлів у базу даних"""
    from database import AsyncSessionLocal, Base, engine
    from database import Product, Category, Order, QuickOrder, SiteSettings, PageContent, BlogPost, MenuItem, MediaFile
    
    # Створення таблиць
    print("Створення таблиць...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as db:
        # Імпорт категорій
        categories_file = IMPORT_DIR / "categories.json"
        if categories_file.exists():
            print("Імпорт категорій...")
            with open(categories_file, "r", encoding="utf-8") as f:
                categories_data = json.load(f)
            for c in categories_data:
                category = Category(id=c["id"], name=c["name"], icon=c["icon"], count=c["count"])
                db.add(category)
            await db.commit()
            print(f"  Імпортовано {len(categories_data)} категорій")

        # Імпорт продуктів
        products_file = IMPORT_DIR / "products.json"
        if products_file.exists():
            print("Імпорт продуктів...")
            with open(products_file, "r", encoding="utf-8") as f:
                products_data = json.load(f)
            for p in products_data:
                product = Product(
                    id=p["id"],
                    name=p["name"],
                    article=p["article"],
                    price=p["price"],
                    old_price=p.get("old_price"),
                    discount=p.get("discount", 0),
                    image=p["image"],
                    category=p["category"],
                    badges=p.get("badges", []),
                    description=p["description"],
                    stock=p.get("stock", 100),
                    created_at=datetime.fromisoformat(p["created_at"]) if p.get("created_at") else datetime.utcnow()
                )
                db.add(product)
            await db.commit()
            print(f"  Імпортовано {len(products_data)} продуктів")

        # Імпорт замовлень
        orders_file = IMPORT_DIR / "orders.json"
        if orders_file.exists():
            print("Імпорт замовлень...")
            with open(orders_file, "r", encoding="utf-8") as f:
                orders_data = json.load(f)
            for o in orders_data:
                order = Order(
                    id=o["id"],
                    user_id=o["user_id"],
                    items=o["items"],
                    total_amount=o["total_amount"],
                    customer_name=o["customer_name"],
                    customer_phone=o["customer_phone"],
                    customer_email=o.get("customer_email"),
                    delivery_address=o["delivery_address"],
                    delivery_method=o["delivery_method"],
                    payment_method=o["payment_method"],
                    status=o.get("status", "pending"),
                    notes=o.get("notes"),
                    created_at=datetime.fromisoformat(o["created_at"]) if o.get("created_at") else datetime.utcnow()
                )
                db.add(order)
            await db.commit()
            print(f"  Імпортовано {len(orders_data)} замовлень")

        # Імпорт налаштувань сайту
        settings_file = IMPORT_DIR / "site_settings.json"
        if settings_file.exists():
            print("Імпорт налаштувань...")
            with open(settings_file, "r", encoding="utf-8") as f:
                settings_data = json.load(f)
            for s in settings_data:
                settings = SiteSettings(id=s["id"], settings_data=s["settings_data"])
                db.add(settings)
            await db.commit()
            print(f"  Імпортовано {len(settings_data)} налаштувань")

        # Імпорт CMS сторінок
        pages_file = IMPORT_DIR / "page_contents.json"
        if pages_file.exists():
            print("Імпорт CMS сторінок...")
            with open(pages_file, "r", encoding="utf-8") as f:
                pages_data = json.load(f)
            for p in pages_data:
                page = PageContent(
                    id=p["id"],
                    page_key=p["page_key"],
                    title=p["title"],
                    content=p["content"],
                    meta_description=p.get("meta_description"),
                    meta_keywords=p.get("meta_keywords")
                )
                db.add(page)
            await db.commit()
            print(f"  Імпортовано {len(pages_data)} сторінок")

        # Імпорт блог-постів
        posts_file = IMPORT_DIR / "blog_posts.json"
        if posts_file.exists():
            print("Імпорт блог-постів...")
            with open(posts_file, "r", encoding="utf-8") as f:
                posts_data = json.load(f)
            for p in posts_data:
                post = BlogPost(
                    id=p["id"],
                    slug=p["slug"],
                    title=p["title"],
                    excerpt=p.get("excerpt"),
                    content=p["content"],
                    image_url=p.get("image_url"),
                    author=p.get("author", "PlatanSad"),
                    category=p.get("category"),
                    tags=p.get("tags", []),
                    is_published=p.get("is_published", True),
                    views=p.get("views", 0),
                    meta_description=p.get("meta_description"),
                    meta_keywords=p.get("meta_keywords"),
                    published_at=datetime.fromisoformat(p["published_at"]) if p.get("published_at") else datetime.utcnow(),
                    created_at=datetime.fromisoformat(p["created_at"]) if p.get("created_at") else datetime.utcnow()
                )
                db.add(post)
            await db.commit()
            print(f"  Імпортовано {len(posts_data)} блог-постів")

        # Імпорт меню
        menu_file = IMPORT_DIR / "menu_items.json"
        if menu_file.exists():
            print("Імпорт меню...")
            with open(menu_file, "r", encoding="utf-8") as f:
                menu_data = json.load(f)
            for m in menu_data:
                menu_item = MenuItem(
                    id=m["id"],
                    title=m["title"],
                    url=m["url"],
                    icon=m.get("icon"),
                    order=m.get("order", 0),
                    is_active=m.get("is_active", True),
                    parent_id=m.get("parent_id")
                )
                db.add(menu_item)
            await db.commit()
            print(f"  Імпортовано {len(menu_data)} пунктів меню")

        # Імпорт медіа-файлів
        media_file = IMPORT_DIR / "media_files.json"
        if media_file.exists():
            print("Імпорт медіа-файлів...")
            with open(media_file, "r", encoding="utf-8") as f:
                media_data = json.load(f)
            for m in media_data:
                media = MediaFile(
                    id=m["id"],
                    filename=m["filename"],
                    original_name=m["original_name"],
                    url=m["url"],
                    file_type=m["file_type"],
                    mime_type=m.get("mime_type"),
                    file_size=m.get("file_size"),
                    alt_text=m.get("alt_text"),
                    title=m.get("title"),
                    folder=m.get("folder", "general"),
                    uploaded_by=m.get("uploaded_by", "admin"),
                    created_at=datetime.fromisoformat(m["created_at"]) if m.get("created_at") else datetime.utcnow()
                )
                db.add(media)
            await db.commit()
            print(f"  Імпортовано {len(media_data)} медіа-файлів")

    print("\n✅ Імпорт завершено!")

if __name__ == "__main__":
    asyncio.run(import_all_data())

#!/usr/bin/env python3
"""
Скрипт експорту даних з PostgreSQL для міграції на MySQL
Запуск: python export_data.py
"""
import asyncio
import json
import os
from datetime import datetime
from pathlib import Path

# Налаштування
EXPORT_DIR = Path(__file__).parent / "export_data"
EXPORT_DIR.mkdir(exist_ok=True)

async def export_all_data():
    """Експортує всі дані з бази даних у JSON файли"""
    from database import AsyncSessionLocal, Product, Category, Order, QuickOrder, SiteSettings, PageContent, BlogPost, MenuItem, MediaFile
    from sqlalchemy import select
    
    async with AsyncSessionLocal() as db:
        # Експорт продуктів
        print("Експорт продуктів...")
        result = await db.execute(select(Product))
        products = result.scalars().all()
        products_data = []
        for p in products:
            products_data.append({
                "id": p.id,
                "name": p.name,
                "article": p.article,
                "price": p.price,
                "old_price": p.old_price,
                "discount": p.discount,
                "image": p.image,
                "category": p.category,
                "badges": p.badges if isinstance(p.badges, list) else json.loads(p.badges) if p.badges else [],
                "description": p.description,
                "stock": p.stock,
                "created_at": p.created_at.isoformat() if p.created_at else None
            })
        with open(EXPORT_DIR / "products.json", "w", encoding="utf-8") as f:
            json.dump(products_data, f, ensure_ascii=False, indent=2)
        print(f"  Експортовано {len(products_data)} продуктів")

        # Експорт категорій
        print("Експорт категорій...")
        result = await db.execute(select(Category))
        categories = result.scalars().all()
        categories_data = [{"id": c.id, "name": c.name, "icon": c.icon, "count": c.count} for c in categories]
        with open(EXPORT_DIR / "categories.json", "w", encoding="utf-8") as f:
            json.dump(categories_data, f, ensure_ascii=False, indent=2)
        print(f"  Експортовано {len(categories_data)} категорій")

        # Експорт замовлень
        print("Експорт замовлень...")
        result = await db.execute(select(Order))
        orders = result.scalars().all()
        orders_data = []
        for o in orders:
            orders_data.append({
                "id": o.id,
                "user_id": o.user_id,
                "items": o.items,
                "total_amount": o.total_amount,
                "customer_name": o.customer_name,
                "customer_phone": o.customer_phone,
                "customer_email": o.customer_email,
                "delivery_address": o.delivery_address,
                "delivery_method": o.delivery_method,
                "payment_method": o.payment_method,
                "status": o.status,
                "notes": o.notes,
                "created_at": o.created_at.isoformat() if o.created_at else None
            })
        with open(EXPORT_DIR / "orders.json", "w", encoding="utf-8") as f:
            json.dump(orders_data, f, ensure_ascii=False, indent=2)
        print(f"  Експортовано {len(orders_data)} замовлень")

        # Експорт налаштувань сайту
        print("Експорт налаштувань...")
        result = await db.execute(select(SiteSettings))
        settings = result.scalars().all()
        settings_data = [{"id": s.id, "settings_data": s.settings_data} for s in settings]
        with open(EXPORT_DIR / "site_settings.json", "w", encoding="utf-8") as f:
            json.dump(settings_data, f, ensure_ascii=False, indent=2)
        print(f"  Експортовано {len(settings_data)} налаштувань")

        # Експорт CMS сторінок
        print("Експорт CMS сторінок...")
        result = await db.execute(select(PageContent))
        pages = result.scalars().all()
        pages_data = []
        for p in pages:
            pages_data.append({
                "id": p.id,
                "page_key": p.page_key,
                "title": p.title,
                "content": p.content,
                "meta_description": p.meta_description,
                "meta_keywords": p.meta_keywords
            })
        with open(EXPORT_DIR / "page_contents.json", "w", encoding="utf-8") as f:
            json.dump(pages_data, f, ensure_ascii=False, indent=2)
        print(f"  Експортовано {len(pages_data)} сторінок")

        # Експорт блог-постів
        print("Експорт блог-постів...")
        result = await db.execute(select(BlogPost))
        posts = result.scalars().all()
        posts_data = []
        for p in posts:
            posts_data.append({
                "id": p.id,
                "slug": p.slug,
                "title": p.title,
                "excerpt": p.excerpt,
                "content": p.content,
                "image_url": p.image_url,
                "author": p.author,
                "category": p.category,
                "tags": p.tags,
                "is_published": p.is_published,
                "views": p.views,
                "meta_description": p.meta_description,
                "meta_keywords": p.meta_keywords,
                "published_at": p.published_at.isoformat() if p.published_at else None,
                "created_at": p.created_at.isoformat() if p.created_at else None
            })
        with open(EXPORT_DIR / "blog_posts.json", "w", encoding="utf-8") as f:
            json.dump(posts_data, f, ensure_ascii=False, indent=2)
        print(f"  Експортовано {len(posts_data)} блог-постів")

        # Експорт меню
        print("Експорт меню...")
        result = await db.execute(select(MenuItem))
        menu_items = result.scalars().all()
        menu_data = []
        for m in menu_items:
            menu_data.append({
                "id": m.id,
                "title": m.title,
                "url": m.url,
                "icon": m.icon,
                "order": m.order,
                "is_active": m.is_active,
                "parent_id": m.parent_id
            })
        with open(EXPORT_DIR / "menu_items.json", "w", encoding="utf-8") as f:
            json.dump(menu_data, f, ensure_ascii=False, indent=2)
        print(f"  Експортовано {len(menu_data)} пунктів меню")

        # Експорт медіа-файлів
        print("Експорт медіа-файлів...")
        result = await db.execute(select(MediaFile))
        media = result.scalars().all()
        media_data = []
        for m in media:
            media_data.append({
                "id": m.id,
                "filename": m.filename,
                "original_name": m.original_name,
                "url": m.url,
                "file_type": m.file_type,
                "mime_type": m.mime_type,
                "file_size": m.file_size,
                "alt_text": m.alt_text,
                "title": m.title,
                "folder": m.folder,
                "uploaded_by": m.uploaded_by,
                "created_at": m.created_at.isoformat() if m.created_at else None
            })
        with open(EXPORT_DIR / "media_files.json", "w", encoding="utf-8") as f:
            json.dump(media_data, f, ensure_ascii=False, indent=2)
        print(f"  Експортовано {len(media_data)} медіа-файлів")

    print(f"\n✅ Експорт завершено! Файли збережено в: {EXPORT_DIR}")

if __name__ == "__main__":
    asyncio.run(export_all_data())

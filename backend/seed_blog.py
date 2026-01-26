"""
Seed blog and menu data
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from database import Base, BlogPost, MenuItem
import os

DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite+aiosqlite:///./platansad.db')
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def seed_blog_data():
    """Seed blog posts"""
    print("="*70)
    print("📝 ЗАПОВНЕННЯ БЛОГУ")
    print("="*70)
    
    async with AsyncSessionLocal() as session:
        try:
            # Sample blog posts
            posts = [
                {
                    "slug": "yak-dohlyadaty-tuyu-vzymku",
                    "title": "Як доглядати туї взимку",
                    "excerpt": "Практичні поради по догляду за туями в зимовий період",
                    "content": """
<h2>Зимовий догляд за туями</h2>
<p>Туї - це вічнозелені рослини, які потребують особливого догляду взимку. Ось основні рекомендації:</p>

<h3>1. Полив перед зимою</h3>
<p>Восени, до настання морозів, обов'язково добре полийте туї. Це допоможе їм пережити зиму.</p>

<h3>2. Захист від снігу</h3>
<p>Зв'яжіть гілки туї мотузкою, щоб запобігти їх поломці під вагою снігу.</p>

<h3>3. Захист від сонця</h3>
<p>У лютому-березні захистіть туї від яскравого сонця за допомогою укривного матеріалу.</p>
                    """,
                    "category": "Догляд",
                    "tags": ["туя", "зима", "догляд"],
                    "author": "PlatanSad",
                    "is_published": True
                },
                {
                    "slug": "top-5-roslyn-dlya-zhyvoploту",
                    "title": "ТОП-5 рослин для живоплоту",
                    "excerpt": "Найкращі декоративні рослини для створення живоплоту в Україні",
                    "content": """
<h2>Найкращі рослини для живоплоту</h2>
<p>Живопліт - це не тільки красиво, а й функціонально. Ось наш топ-5:</p>

<h3>1. Туя Смарагд</h3>
<p>Найпопулярніший вибір. Швидко росте, не потребує частої стрижки.</p>

<h3>2. Туя Колумна</h3>
<p>Ідеальна для високих живоплотів. Може досягати 10 метрів.</p>

<h3>3. Самшит</h3>
<p>Класика для низьких бордюрів. Легко піддається формуванню.</p>

<h3>4. Ялина</h3>
<p>Традиційний вибір для густого живоплоту.</p>

<h3>5. Бонсай Нівакі</h3>
<p>Для любителів японського стилю.</p>
                    """,
                    "category": "Ландшафтний дизайн",
                    "tags": ["живопліт", "туя", "самшит"],
                    "author": "PlatanSad",
                    "is_published": True
                },
                {
                    "slug": "koly-sadzhat y-roslyn y",
                    "title": "Коли садити хвойні рослини",
                    "excerpt": "Оптимальні терміни посадки туй, ялин та інших хвойних",
                    "content": """
<h2>Найкращий час для посадки хвойних</h2>
<p>Хвойні рослини можна садити майже цілий рік, але є оптимальні періоди:</p>

<h3>Весна (березень-квітень)</h3>
<p>Ідеальний час для посадки. Рослина встигне прижитися до літньої спеки.</p>

<h3>Осінь (вересень-жовтень)</h3>
<p>Другий найкращий період. Корінь встигає розвинутися до зими.</p>

<h3>Літо</h3>
<p>Можна садити рослини з закритою кореневою системою, але потрібен частий полив.</p>

<h3>Зима</h3>
<p>Посадка можлива, але тільки у відлигу та досвідченими садівниками.</p>
                    """,
                    "category": "Посадка",
                    "tags": ["посадка", "хвойні", "туя"],
                    "author": "PlatanSad",
                    "is_published": True
                }
            ]
            
            for post_data in posts:
                result = await session.execute(
                    select(BlogPost).where(BlogPost.slug == post_data['slug'])
                )
                existing = result.scalar_one_or_none()
                
                if not existing:
                    post = BlogPost(**post_data)
                    session.add(post)
                    print(f"✅ Додано статтю: {post_data['title']}")
                else:
                    print(f"⚠️  Стаття '{post_data['slug']}' вже існує")
            
            await session.commit()
            print("="*70)
            
        except Exception as e:
            print(f"❌ Помилка: {e}")
            await session.rollback()


async def seed_menu_data():
    """Seed menu items"""
    print("\n" + "="*70)
    print("📋 ЗАПОВНЕННЯ МЕНЮ")
    print("="*70)
    
    async with AsyncSessionLocal() as session:
        try:
            menu_items = [
                {"title": "Головна", "url": "/", "order": 1},
                {"title": "Каталог", "url": "/catalog", "order": 2},
                {"title": "Про нас", "url": "/about", "order": 3},
                {"title": "Блог", "url": "/blog", "order": 4},
                {"title": "Доставка", "url": "/delivery", "order": 5},
                {"title": "Контакти", "url": "/contacts", "order": 6},
            ]
            
            for item_data in menu_items:
                result = await session.execute(
                    select(MenuItem).where(MenuItem.title == item_data['title'])
                )
                existing = result.scalar_one_or_none()
                
                if not existing:
                    item = MenuItem(**item_data)
                    session.add(item)
                    print(f"✅ Додано пункт меню: {item_data['title']}")
                else:
                    print(f"⚠️  Пункт '{item_data['title']}' вже існує")
            
            await session.commit()
            print("="*70)
            
        except Exception as e:
            print(f"❌ Помилка: {e}")
            await session.rollback()


async def main():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed data
    await seed_blog_data()
    await seed_menu_data()
    
    # Close
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())

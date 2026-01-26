"""
Seed CMS data with initial content
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from database import Base, PageContent, HeroSection, FooterLink
import os

# Database setup
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite+aiosqlite:///./platansad.db')
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def seed_cms_data():
    """Seed initial CMS data"""
    print("="*70)
    print("🌱 ЗАПОВНЕННЯ CMS ДАНИМИ")
    print("="*70)
    
    async with AsyncSessionLocal() as session:
        try:
            # 1. Page Contents
            pages = [
                {
                    "page_key": "about",
                    "title": "Про нас",
                    "content": """
<h2>Розсадник PlatanSad</h2>
<p>Ми - професійний розсадник рослин з багаторічним досвідом вирощування декоративних рослин для ландшафтного дизайну.</p>

<h3>Наша місія</h3>
<p>Забезпечити кожного якісним садивним матеріалом для створення красивого та здорового саду.</p>

<h3>Наші переваги</h3>
<ul>
<li>✅ Власне вирощування рослин</li>
<li>✅ Контроль якості на всіх етапах</li>
<li>✅ Консультації експертів</li>
<li>✅ Доставка по всій Україні</li>
</ul>
                    """,
                    "meta_description": "Розсадник PlatanSad - якісні декоративні рослини для вашого саду",
                    "meta_keywords": "розсадник, рослини, туї, бонсай, ялини"
                },
                {
                    "page_key": "delivery",
                    "title": "Доставка та оплата",
                    "content": """
<h2>Доставка</h2>
<p>Ми доставляємо рослини по всій Україні через Нову Пошту та забезпечуємо можливість самовивозу.</p>

<h3>Нова Пошта</h3>
<p>Доставка у відділення або поштомат у вашому місті. Термін доставки: 1-3 дні.</p>

<h3>Самовивіз</h3>
<p>Можливість забрати замовлення безпосередньо з нашого розсадника у смт. Смига.</p>
<p><strong>Графік роботи:</strong> Пн-Сб: 9:00-18:00, Нд: вихідний</p>

<h3>Оплата</h3>
<p>Накладений платіж при отриманні товару у відділенні Нової Пошти.</p>
                    """,
                    "meta_description": "Доставка рослин по Україні - Нова Пошта та самовивіз",
                    "meta_keywords": "доставка рослин, нова пошта, самовивіз"
                },
                {
                    "page_key": "contacts",
                    "title": "Контакти",
                    "content": """
<h2>Зв'яжіться з нами</h2>
<p>Ми завжди раді відповісти на ваші запитання та допомогти з вибором рослин.</p>

<h3>Контактна інформація</h3>
<p><strong>Телефони:</strong><br>
+380 (63) 650-74-49<br>
+380 (95) 251-03-47</p>

<p><strong>Email:</strong> info@platansad.ua</p>

<p><strong>Адреса:</strong> Рівненська обл., Дубенський р-н, смт. Смига</p>

<h3>Графік роботи</h3>
<p>Понеділок - Субота: 9:00 - 18:00<br>
Неділя: вихідний</p>
                    """,
                    "meta_description": "Контакти розсадника PlatanSad - телефони, адреса, графік роботи",
                    "meta_keywords": "контакти, телефон, адреса розсадника"
                },
                {
                    "page_key": "return",
                    "title": "Обмін та повернення",
                    "content": """
<h2>Умови обміну та повернення</h2>
<p>Ви маєте право повернути або обміняти товар протягом 14 днів з моменту отримання.</p>

<h3>Що можна повернути</h3>
<ul>
<li>✓ Товар належної якості</li>
<li>✓ Збережена оригінальна упаковка</li>
<li>✓ Рослина не має слідів висадки</li>
<li>✓ Протягом 14 днів з моменту отримання</li>
</ul>

<h3>Процес повернення</h3>
<ol>
<li>Зв'яжіться з нами по телефону</li>
<li>Надішліть товар за нашою адресою</li>
<li>Ми перевіримо стан товару</li>
<li>Повернемо кошти протягом 3-5 робочих днів</li>
</ol>

<h3>Потрібна консультація?</h3>
<p>Телефонуйте: +380 (63) 650-74-49 або +380 (95) 251-03-47</p>
                    """,
                    "meta_description": "Умови обміну та повернення рослин - 14 днів гарантії",
                    "meta_keywords": "обмін, повернення, гарантія"
                }
            ]
            
            for page_data in pages:
                # Check if exists
                result = await session.execute(
                    select(PageContent).where(PageContent.page_key == page_data['page_key'])
                )
                existing = result.scalar_one_or_none()
                
                if existing:
                    print(f"⚠️  Сторінка '{page_data['page_key']}' вже існує, пропускаємо")
                else:
                    page = PageContent(**page_data)
                    session.add(page)
                    print(f"✅ Додано сторінку: {page_data['title']}")
            
            # 2. Hero Section
            result = await session.execute(select(HeroSection))
            hero = result.scalar_one_or_none()
            
            if not hero:
                hero = HeroSection(
                    id="main",
                    title="🌿 Розсадник PlatanSad",
                    subtitle="Декоративні рослини для вашого саду",
                    button_text="Переглянути каталог",
                    button_link="/catalog"
                )
                session.add(hero)
                print("✅ Додано Hero секцію")
            else:
                print("⚠️  Hero секція вже існує")
            
            # 3. Footer Links
            footer_links = [
                # Company
                {"section": "company", "title": "Про нас", "url": "/about", "order": 1},
                {"section": "company", "title": "Блог", "url": "/blog", "order": 2},
                {"section": "company", "title": "Контакти", "url": "/contacts", "order": 3},
                
                # Help
                {"section": "help", "title": "Доставка та оплата", "url": "/delivery", "order": 1},
                {"section": "help", "title": "Обмін та повернення", "url": "/return", "order": 2},
                {"section": "help", "title": "Каталог", "url": "/catalog", "order": 3},
                
                # Social
                {"section": "social", "title": "Instagram", "url": "https://www.instagram.com/platansad.uaa", "order": 1},
                {"section": "social", "title": "TikTok", "url": "https://www.tiktok.com/@platansad.ua", "order": 2},
            ]
            
            for link_data in footer_links:
                result = await session.execute(
                    select(FooterLink).where(
                        FooterLink.section == link_data['section'],
                        FooterLink.title == link_data['title']
                    )
                )
                existing = result.scalar_one_or_none()
                
                if not existing:
                    link = FooterLink(**link_data)
                    session.add(link)
                    print(f"✅ Додано footer посилання: {link_data['title']}")
            
            await session.commit()
            
            print("\n" + "="*70)
            print("✅ CMS дані успішно додано!")
            print("="*70)
            
        except Exception as e:
            print(f"❌ Помилка: {e}")
            await session.rollback()
            raise


async def main():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed data
    await seed_cms_data()
    
    # Close
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())

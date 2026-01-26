from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Float, Integer, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')
import os
from datetime import datetime
import uuid

# Database URL
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql+asyncpg://postgres:postgres@localhost:5432/platansad')

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Base class for models
Base = declarative_base()


# Product Model
class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, index=True)
    article = Column(String, nullable=False, unique=True)
    price = Column(Float, nullable=False)
    old_price = Column(Float, nullable=True)
    discount = Column(Integer, default=0)
    image = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    badges = Column(JSON, default=list)
    description = Column(Text, nullable=False)
    stock = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)


# Category Model
class Category(Base):
    __tablename__ = "categories"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True, index=True)
    icon = Column(String, nullable=False)
    count = Column(Integer, default=0)


# Cart Model
class CartItem(Base):
    __tablename__ = "cart"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, nullable=False, index=True)
    product_name = Column(String, nullable=False)
    product_image = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    user_id = Column(String, default="guest", index=True)


# Wishlist Model
class WishlistItem(Base):
    __tablename__ = "wishlist"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, nullable=False, index=True)
    user_id = Column(String, default="guest", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# Order Model
class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, default="guest", index=True)
    items = Column(JSON, nullable=False)  # Store as JSON array
    total_amount = Column(Float, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_email = Column(String, nullable=True)
    delivery_address = Column(Text, nullable=False)
    delivery_method = Column(String, nullable=False)
    payment_method = Column(String, nullable=False)
    status = Column(String, default="pending")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


# Quick Order Model
class QuickOrder(Base):
    __tablename__ = "quick_orders"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, nullable=False, index=True)
    product_name = Column(String, nullable=False)
    product_image = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    status = Column(String, default="pending")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


# Site Settings Model
class SiteSettings(Base):
    __tablename__ = "site_settings"
    
    id = Column(String, primary_key=True, default="main")
    settings_data = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# CMS Page Content Model
class PageContent(Base):
    __tablename__ = "page_contents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    page_key = Column(String, unique=True, nullable=False, index=True)  # about, delivery, contacts, return
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    meta_description = Column(String, nullable=True)
    meta_keywords = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# CMS Hero Section Model
class HeroSection(Base):
    __tablename__ = "hero_sections"
    
    id = Column(String, primary_key=True, default="main")
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    button_text = Column(String, nullable=True)
    button_link = Column(String, nullable=True)
    background_image = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# CMS Footer Links Model  
class FooterLink(Base):
    __tablename__ = "footer_links"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    section = Column(String, nullable=False, index=True)  # company, help, social
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# CMS Blog Model
class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    excerpt = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    author = Column(String, default="PlatanSad")
    category = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    is_published = Column(Boolean, default=True)
    views = Column(Integer, default=0)
    meta_description = Column(String, nullable=True)
    meta_keywords = Column(String, nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# CMS Menu Items Model
class MenuItem(Base):
    __tablename__ = "menu_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    parent_id = Column(String, nullable=True)  # For submenu
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Database helper functions
async def get_db():
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Initialize database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Close database connection"""
    await engine.dispose()

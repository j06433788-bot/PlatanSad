from sqlalchemy import (
    create_engine,
    Column,
    String,
    Float,
    Integer,
    DateTime,
    Text,
    Boolean,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime
import uuid
import os

# =========================
# ENV
# =========================

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# =========================
# DATABASE URL
# =========================
# За замовчуванням SQLite (STABLE)
# Якщо захочеш PostgreSQL — просто задай DATABASE_URL у .env

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    f"sqlite:///{ROOT_DIR / 'platansad.db'}"
)

# =========================
# ENGINE (SYNC)
# =========================

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()

# =========================
# MODELS
# =========================

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


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True, index=True)
    icon = Column(String, nullable=False)
    count = Column(Integer, default=0)


class CartItem(Base):
    __tablename__ = "cart"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, nullable=False, index=True)
    product_name = Column(String, nullable=False)
    product_image = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    user_id = Column(String, default="guest", index=True)


class WishlistItem(Base):
    __tablename__ = "wishlist"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, nullable=False, index=True)
    user_id = Column(String, default="guest", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, default="guest", index=True)
    items = Column(JSON, nullable=False)
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


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(String, primary_key=True, default="main")
    settings_data = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PageContent(Base):
    __tablename__ = "page_contents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    page_key = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    meta_description = Column(String, nullable=True)
    meta_keywords = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class HeroSection(Base):
    __tablename__ = "hero_sections"

    id = Column(String, primary_key=True, default="main")
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    button_text = Column(String, nullable=True)
    button_link = Column(String, nullable=True)
    background_image = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FooterLink(Base):
    __tablename__ = "footer_links"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    section = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


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


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    url = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    parent_id = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class MediaFile(Base):
    __tablename__ = "media_files"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    original_name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    mime_type = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    alt_text = Column(String, nullable=True)
    title = Column(String, nullable=True)
    folder = Column(String, default="general")
    uploaded_by = Column(String, default="admin")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

# =========================
# DB HELPERS
# =========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def close_db():
    engine.dispose()

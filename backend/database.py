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
    customer_email = Column(String, nullable=False)
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

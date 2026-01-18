from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid


# Product Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    article: str
    price: float
    oldPrice: Optional[float] = None
    discount: int = 0
    image: str
    category: str
    badges: List[str] = []
    description: str
    stock: int = 100
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class ProductCreate(BaseModel):
    name: str
    article: str
    price: float
    oldPrice: Optional[float] = None
    discount: int = 0
    image: str
    category: str
    badges: List[str] = []
    description: str
    stock: int = 100


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    oldPrice: Optional[float] = None
    discount: Optional[int] = None
    stock: Optional[int] = None
    description: Optional[str] = None


# Category Models
class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    icon: str
    count: int = 0


class CategoryCreate(BaseModel):
    name: str
    icon: str
    count: int = 0


# Cart Models
class CartItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    productId: str
    productName: str
    productImage: str
    price: float
    quantity: int = 1
    userId: Optional[str] = "guest"  # For now, we use guest user


class CartItemCreate(BaseModel):
    productId: str
    quantity: int = 1
    userId: Optional[str] = "guest"


class CartItemUpdate(BaseModel):
    quantity: int


# Wishlist Models
class WishlistItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    productId: str
    userId: Optional[str] = "guest"
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class WishlistItemCreate(BaseModel):
    productId: str
    userId: Optional[str] = "guest"


# Order Models
class OrderItem(BaseModel):
    productId: str
    productName: str
    productImage: str
    price: float
    quantity: int


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: Optional[str] = "guest"
    items: List[OrderItem]
    totalAmount: float
    customerName: str
    customerPhone: str
    customerEmail: str
    deliveryAddress: str
    deliveryMethod: str  # "nova_poshta" or "self_pickup"
    paymentMethod: str  # "cash_on_delivery" or "card"
    status: str = "pending"  # pending, confirmed, delivered, cancelled
    notes: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class OrderCreate(BaseModel):
    items: List[OrderItem]
    totalAmount: float
    customerName: str
    customerPhone: str
    customerEmail: str
    deliveryAddress: str
    deliveryMethod: str
    paymentMethod: str
    notes: Optional[str] = None
    userId: Optional[str] = "guest"


# Quick Order Models (One-click purchase)
class QuickOrder(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    productId: str
    productName: str
    productImage: str
    price: float
    quantity: int = 1
    customerName: str
    customerPhone: str
    status: str = "pending"  # pending, confirmed, cancelled
    notes: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class QuickOrderCreate(BaseModel):
    productId: str
    quantity: int = 1
    customerName: str
    customerPhone: str
    notes: Optional[str] = None



# Site Settings Models
class SiteSettings(BaseModel):
    id: str = "main"
    settings_data: dict
    updated_at: Optional[datetime] = None


class SiteSettingsUpdate(BaseModel):
    settings_data: dict


from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str
    username: Optional[str] = None


class DashboardStats(BaseModel):
    totalProducts: int
    totalOrders: int
    totalRevenue: float
    pendingOrders: int
    lowStockProducts: int = 0
    totalCategories: int = 0
    recentOrders: List[dict] = []


class RevenueData(BaseModel):
    date: str
    revenue: float


class TopProduct(BaseModel):
    id: str
    name: str
    sales: int
    revenue: float


class OrderStatusUpdate(BaseModel):
    status: str  # pending, confirmed, processing, shipped, delivered, cancelled


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    count: Optional[int] = None


class ImageUploadResponse(BaseModel):
    url: str
    filename: str


class OrderStats(BaseModel):
    pending: int = 0
    processing: int = 0
    shipped: int = 0
    delivered: int = 0
    cancelled: int = 0


class OrdersChartData(BaseModel):
    date: str
    orders: int
    revenue: float


class OrdersByStatus(BaseModel):
    status: str
    count: int
    percentage: float


class TopCustomer(BaseModel):
    name: str
    phone: str
    totalOrders: int
    totalSpent: float

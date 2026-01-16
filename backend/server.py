from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
from models import (
    Product, ProductCreate, ProductUpdate,
    Category, CategoryCreate,
    CartItem, CartItemCreate, CartItemUpdate,
    WishlistItem, WishlistItemCreate,
    Order, OrderCreate,
    QuickOrder, QuickOrderCreate
)
from admin_models import (
    AdminLogin, AdminToken, DashboardStats, 
    OrderStatusUpdate, CategoryUpdate, OrderStats
)
from admin_auth import (
    authenticate_admin, create_access_token, 
    get_current_admin, ACCESS_TOKEN_EXPIRE_MINUTES
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== PRODUCTS ENDPOINTS ====================

@api_router.get("/products", response_model=List[Product])
async def get_products(
    search: Optional[str] = Query(None, description="Search by product name or description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    badge: Optional[str] = Query(None, description="Filter by badge (hit, sale, new)"),
    minPrice: Optional[float] = Query(None, description="Minimum price"),
    maxPrice: Optional[float] = Query(None, description="Maximum price"),
    sortBy: Optional[str] = Query("name", description="Sort by: name, price, -price (desc)"),
    limit: Optional[int] = Query(100, description="Limit results"),
    skip: Optional[int] = Query(0, description="Skip results for pagination")
):
    """Get all products with optional filtering, searching, and sorting"""
    query = {}
    
    # Search filter
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"article": {"$regex": search, "$options": "i"}}
        ]
    
    # Category filter
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    
    # Badge filter
    if badge:
        query["badges"] = badge
    
    # Price filter
    if minPrice is not None or maxPrice is not None:
        query["price"] = {}
        if minPrice is not None:
            query["price"]["$gte"] = minPrice
        if maxPrice is not None:
            query["price"]["$lte"] = maxPrice
    
    # Sort configuration
    sort_config = []
    if sortBy == "price":
        sort_config = [("price", 1)]
    elif sortBy == "-price":
        sort_config = [("price", -1)]
    elif sortBy == "name":
        sort_config = [("name", 1)]
    else:
        sort_config = [("name", 1)]
    
    # Execute query
    products = await db.products.find(query, {"_id": 0}).sort(sort_config).skip(skip).limit(limit).to_list(limit)
    
    return products


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product


@api_router.post("/products", response_model=Product)
async def create_product(product_input: ProductCreate):
    """Create a new product (Admin only - future auth)"""
    product = Product(**product_input.model_dump())
    doc = product.model_dump()
    
    await db.products.insert_one(doc)
    return product


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, update_data: ProductUpdate):
    """Update a product (Admin only - future auth)"""
    # Get existing product
    existing = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update only provided fields
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if update_dict:
        await db.products.update_one({"id": product_id}, {"$set": update_dict})
    
    # Return updated product
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Delete a product (Admin only - future auth)"""
    result = await db.products.delete_one({"id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}


# ==================== CATEGORIES ENDPOINTS ====================

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    return categories


@api_router.get("/categories/{category_id}", response_model=Category)
async def get_category(category_id: str):
    """Get a single category by ID"""
    category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return category


# ==================== CART ENDPOINTS ====================

@api_router.post("/cart/add", response_model=CartItem)
async def add_to_cart(cart_item_input: CartItemCreate):
    """Add item to cart"""
    # Get product details
    product = await db.products.find_one({"id": cart_item_input.productId}, {"_id": 0})
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already exists in cart
    existing_item = await db.cart.find_one({
        "productId": cart_item_input.productId,
        "userId": cart_item_input.userId
    }, {"_id": 0})
    
    if existing_item:
        # Update quantity
        new_quantity = existing_item["quantity"] + cart_item_input.quantity
        await db.cart.update_one(
            {"id": existing_item["id"]},
            {"$set": {"quantity": new_quantity}}
        )
        updated = await db.cart.find_one({"id": existing_item["id"]}, {"_id": 0})
        return updated
    else:
        # Create new cart item
        cart_item = CartItem(
            productId=cart_item_input.productId,
            productName=product["name"],
            productImage=product["image"],
            price=product["price"],
            quantity=cart_item_input.quantity,
            userId=cart_item_input.userId
        )
        
        doc = cart_item.model_dump()
        await db.cart.insert_one(doc)
        return cart_item


@api_router.get("/cart", response_model=List[CartItem])
async def get_cart(userId: str = Query("guest")):
    """Get cart items for a user"""
    cart_items = await db.cart.find({"userId": userId}, {"_id": 0}).to_list(100)
    return cart_items


@api_router.put("/cart/{item_id}", response_model=CartItem)
async def update_cart_item(item_id: str, update_data: CartItemUpdate):
    """Update cart item quantity"""
    result = await db.cart.update_one(
        {"id": item_id},
        {"$set": {"quantity": update_data.quantity}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    updated = await db.cart.find_one({"id": item_id}, {"_id": 0})
    return updated


@api_router.delete("/cart/{item_id}")
async def delete_cart_item(item_id: str):
    """Remove item from cart"""
    result = await db.cart.delete_one({"id": item_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    return {"message": "Item removed from cart"}


@api_router.delete("/cart/clear/{userId}")
async def clear_cart(userId: str = "guest"):
    """Clear all items from cart for a user"""
    await db.cart.delete_many({"userId": userId})
    return {"message": "Cart cleared successfully"}


# ==================== WISHLIST ENDPOINTS ====================

@api_router.post("/wishlist/add", response_model=WishlistItem)
async def add_to_wishlist(wishlist_input: WishlistItemCreate):
    """Add item to wishlist"""
    # Check if product exists
    product = await db.products.find_one({"id": wishlist_input.productId}, {"_id": 0})
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if already in wishlist
    existing = await db.wishlist.find_one({
        "productId": wishlist_input.productId,
        "userId": wishlist_input.userId
    }, {"_id": 0})
    
    if existing:
        return existing
    
    # Add to wishlist
    wishlist_item = WishlistItem(**wishlist_input.model_dump())
    doc = wishlist_item.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.wishlist.insert_one(doc)
    return wishlist_item


@api_router.get("/wishlist", response_model=List[WishlistItem])
async def get_wishlist(userId: str = Query("guest")):
    """Get wishlist items for a user"""
    wishlist_items = await db.wishlist.find({"userId": userId}, {"_id": 0}).to_list(100)
    return wishlist_items


@api_router.delete("/wishlist/{item_id}")
async def remove_from_wishlist(item_id: str):
    """Remove item from wishlist"""
    result = await db.wishlist.delete_one({"id": item_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    
    return {"message": "Item removed from wishlist"}


# ==================== ORDERS ENDPOINTS ====================

@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate):
    """Create a new order"""
    order = Order(**order_input.model_dump())
    doc = order.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.orders.insert_one(doc)
    
    # Clear cart after order
    await db.cart.delete_many({"userId": order_input.userId})
    
    return order


@api_router.get("/orders", response_model=List[Order])
async def get_orders(userId: str = Query("guest")):
    """Get orders for a user"""
    orders = await db.orders.find({"userId": userId}, {"_id": 0}).sort([("createdAt", -1)]).to_list(100)
    return orders


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get a specific order by ID"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order


# ==================== QUICK ORDER ENDPOINTS ====================

@api_router.post("/quick-order", response_model=QuickOrder)
async def create_quick_order(order_input: QuickOrderCreate):
    """Create a quick order (one-click purchase)"""
    # Get product details
    product = await db.products.find_one({"id": order_input.productId}, {"_id": 0})
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check stock
    if product["stock"] < order_input.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    # Create quick order
    quick_order = QuickOrder(
        productId=order_input.productId,
        productName=product["name"],
        productImage=product["image"],
        price=product["price"],
        quantity=order_input.quantity,
        customerName=order_input.customerName,
        customerPhone=order_input.customerPhone,
        notes=order_input.notes
    )
    
    doc = quick_order.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.quick_orders.insert_one(doc)
    
    return quick_order


@api_router.get("/quick-orders", response_model=List[QuickOrder])
async def get_quick_orders(phone: Optional[str] = Query(None)):
    """Get quick orders, optionally filtered by phone"""
    query = {}
    if phone:
        query["customerPhone"] = phone
    
    quick_orders = await db.quick_orders.find(query, {"_id": 0}).sort([("createdAt", -1)]).to_list(100)
    return quick_orders


@api_router.get("/quick-orders/{order_id}", response_model=QuickOrder)
async def get_quick_order(order_id: str):
    """Get a specific quick order by ID"""
    quick_order = await db.quick_orders.find_one({"id": order_id}, {"_id": 0})
    
    if not quick_order:
        raise HTTPException(status_code=404, detail="Quick order not found")
    
    return quick_order


# ==================== LIQPAY PAYMENT ENDPOINTS ====================

from liqpay_service import liqpay_service

@api_router.post("/liqpay/create-checkout")
async def create_liqpay_checkout(
    order_id: str,
    amount: float,
    description: str = "Оплата замовлення PlatanSad",
    result_url: str = None,
    server_url: str = None
):
    """Create LiqPay checkout session"""
    try:
        checkout_data = liqpay_service.create_checkout_data(
            amount=amount,
            order_id=order_id,
            description=description,
            result_url=result_url,
            server_url=server_url
        )
        return checkout_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/liqpay/callback")
async def liqpay_callback(request: dict):
    """Handle LiqPay payment callback"""
    try:
        data = request.get("data", "")
        signature = request.get("signature", "")
        
        # Verify signature
        if not liqpay_service.verify_callback(data, signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Decode callback data
        callback_data = liqpay_service.decode_callback_data(data)
        
        order_id = callback_data.get("order_id")
        status = callback_data.get("status")
        
        # Update order payment status in database
        if order_id and status in ["success", "sandbox"]:
            await db.orders.update_one(
                {"id": order_id},
                {"$set": {
                    "paymentStatus": "paid",
                    "liqpayStatus": status,
                    "paidAt": datetime.utcnow().isoformat()
                }}
            )
        
        return {"status": "ok", "order_id": order_id, "payment_status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/liqpay/status/{order_id}")
async def get_payment_status(order_id: str):
    """Get payment status for an order"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "order_id": order_id,
        "payment_status": order.get("paymentStatus", "pending"),
        "liqpay_status": order.get("liqpayStatus"),
        "paid_at": order.get("paidAt")
    }


# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "PlatanSad API is running", "version": "1.0.0"}


@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check database connection
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

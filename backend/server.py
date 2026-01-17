from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends, UploadFile, File
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import select, update, delete, or_, and_, func
from sqlalchemy.ext.asyncio import AsyncSession
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
import shutil
import uuid
from models import (
    Product as ProductSchema, ProductCreate, ProductUpdate,
    Category as CategorySchema, CategoryCreate,
    CartItem as CartItemSchema, CartItemCreate, CartItemUpdate,
    WishlistItem as WishlistItemSchema, WishlistItemCreate,
    Order as OrderSchema, OrderCreate,
    QuickOrder as QuickOrderSchema, QuickOrderCreate
)
from database import (
    Product, Category, CartItem, WishlistItem, Order, QuickOrder,
    get_db, init_db, close_db
)
from admin_auth import authenticate_admin, create_access_token, get_current_admin
from admin_models import (
    AdminLogin, AdminToken, DashboardStats, RevenueData, TopProduct,
    OrderStatusUpdate, CategoryUpdate, ImageUploadResponse,
    OrderStats, OrdersChartData, OrdersByStatus, TopCustomer
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI()

# Mount uploads directory for serving images
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== PRODUCTS ENDPOINTS ====================

@api_router.get("/products", response_model=List[ProductSchema])
async def get_products(
    search: Optional[str] = Query(None, description="Search by product name or description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    badge: Optional[str] = Query(None, description="Filter by badge (hit, sale, new)"),
    minPrice: Optional[float] = Query(None, description="Minimum price"),
    maxPrice: Optional[float] = Query(None, description="Maximum price"),
    sortBy: Optional[str] = Query("name", description="Sort by: name, price, -price (desc)"),
    limit: Optional[int] = Query(100, description="Limit results"),
    skip: Optional[int] = Query(0, description="Skip results for pagination"),
    db: AsyncSession = Depends(get_db)
):
    """Get all products with optional filtering, searching, and sorting"""
    query = select(Product)
    
    # Search filter
    if search:
        query = query.where(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
                Product.article.ilike(f"%{search}%")
            )
        )
    
    # Category filter
    if category:
        query = query.where(Product.category.ilike(f"%{category}%"))
    
    # Badge filter
    if badge:
        query = query.where(Product.badges.contains([badge]))
    
    # Price filter
    if minPrice is not None:
        query = query.where(Product.price >= minPrice)
    if maxPrice is not None:
        query = query.where(Product.price <= maxPrice)
    
    # Sort configuration
    if sortBy == "price":
        query = query.order_by(Product.price.asc())
    elif sortBy == "-price":
        query = query.order_by(Product.price.desc())
    elif sortBy == "name":
        query = query.order_by(Product.name.asc())
    else:
        query = query.order_by(Product.name.asc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    products = result.scalars().all()
    
    # Convert to response model
    return [
        ProductSchema(
            id=p.id,
            name=p.name,
            article=p.article,
            price=p.price,
            oldPrice=p.old_price,
            discount=p.discount,
            image=p.image,
            category=p.category,
            badges=p.badges,
            description=p.description,
            stock=p.stock,
            createdAt=p.created_at
        )
        for p in products
    ]


@api_router.get("/products/{product_id}", response_model=ProductSchema)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single product by ID"""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return ProductSchema(
        id=product.id,
        name=product.name,
        article=product.article,
        price=product.price,
        oldPrice=product.old_price,
        discount=product.discount,
        image=product.image,
        category=product.category,
        badges=product.badges,
        description=product.description,
        stock=product.stock,
        createdAt=product.created_at
    )


@api_router.post("/products", response_model=ProductSchema)
async def create_product(
    product_input: ProductCreate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Create a new product (Admin only - future auth)"""
    product = Product(
        name=product_input.name,
        article=product_input.article,
        price=product_input.price,
        old_price=product_input.oldPrice,
        discount=product_input.discount,
        image=product_input.image,
        category=product_input.category,
        badges=product_input.badges,
        description=product_input.description,
        stock=product_input.stock
    )
    
    db.add(product)
    await db.commit()
    await db.refresh(product)
    
    return ProductSchema(
        id=product.id,
        name=product.name,
        article=product.article,
        price=product.price,
        oldPrice=product.old_price,
        discount=product.discount,
        image=product.image,
        category=product.category,
        badges=product.badges,
        description=product.description,
        stock=product.stock,
        createdAt=product.created_at
    )


@api_router.put("/products/{product_id}", response_model=ProductSchema)
async def update_product(
    product_id: str,
    update_data: ProductUpdate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update a product (Admin only - future auth)"""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update fields
    if update_data.name is not None:
        product.name = update_data.name
    if update_data.price is not None:
        product.price = update_data.price
    if update_data.oldPrice is not None:
        product.old_price = update_data.oldPrice
    if update_data.discount is not None:
        product.discount = update_data.discount
    if update_data.stock is not None:
        product.stock = update_data.stock
    if update_data.description is not None:
        product.description = update_data.description
    
    await db.commit()
    await db.refresh(product)
    
    return ProductSchema(
        id=product.id,
        name=product.name,
        article=product.article,
        price=product.price,
        oldPrice=product.old_price,
        discount=product.discount,
        image=product.image,
        category=product.category,
        badges=product.badges,
        description=product.description,
        stock=product.stock,
        createdAt=product.created_at
    )


@api_router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Delete a product (Admin only - future auth)"""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db.delete(product)
    await db.commit()
    
    return {"message": "Product deleted successfully"}


# ==================== CATEGORIES ENDPOINTS ====================

@api_router.get("/categories", response_model=List[CategorySchema])
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Get all categories"""
    result = await db.execute(select(Category))
    categories = result.scalars().all()
    
    return [
        CategorySchema(id=c.id, name=c.name, icon=c.icon, count=c.count)
        for c in categories
    ]


@api_router.get("/categories/{category_id}", response_model=CategorySchema)
async def get_category(category_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single category by ID"""
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return CategorySchema(id=category.id, name=category.name, icon=category.icon, count=category.count)


# ==================== CART ENDPOINTS ====================

@api_router.post("/cart/add", response_model=CartItemSchema)
async def add_to_cart(cart_item_input: CartItemCreate, db: AsyncSession = Depends(get_db)):
    """Add item to cart"""
    # Get product details
    result = await db.execute(select(Product).where(Product.id == cart_item_input.productId))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already exists in cart
    result = await db.execute(
        select(CartItem).where(
            and_(
                CartItem.product_id == cart_item_input.productId,
                CartItem.user_id == cart_item_input.userId
            )
        )
    )
    existing_item = result.scalar_one_or_none()
    
    if existing_item:
        # Update quantity
        existing_item.quantity += cart_item_input.quantity
        await db.commit()
        await db.refresh(existing_item)
        
        return CartItemSchema(
            id=existing_item.id,
            productId=existing_item.product_id,
            productName=existing_item.product_name,
            productImage=existing_item.product_image,
            price=existing_item.price,
            quantity=existing_item.quantity,
            userId=existing_item.user_id
        )
    else:
        # Create new cart item
        cart_item = CartItem(
            product_id=cart_item_input.productId,
            product_name=product.name,
            product_image=product.image,
            price=product.price,
            quantity=cart_item_input.quantity,
            user_id=cart_item_input.userId
        )
        
        db.add(cart_item)
        await db.commit()
        await db.refresh(cart_item)
        
        return CartItemSchema(
            id=cart_item.id,
            productId=cart_item.product_id,
            productName=cart_item.product_name,
            productImage=cart_item.product_image,
            price=cart_item.price,
            quantity=cart_item.quantity,
            userId=cart_item.user_id
        )


@api_router.get("/cart", response_model=List[CartItemSchema])
async def get_cart(userId: str = Query("guest"), db: AsyncSession = Depends(get_db)):
    """Get cart items for a user"""
    result = await db.execute(select(CartItem).where(CartItem.user_id == userId))
    cart_items = result.scalars().all()
    
    return [
        CartItemSchema(
            id=item.id,
            productId=item.product_id,
            productName=item.product_name,
            productImage=item.product_image,
            price=item.price,
            quantity=item.quantity,
            userId=item.user_id
        )
        for item in cart_items
    ]


@api_router.put("/cart/{item_id}", response_model=CartItemSchema)
async def update_cart_item(item_id: str, update_data: CartItemUpdate, db: AsyncSession = Depends(get_db)):
    """Update cart item quantity"""
    result = await db.execute(select(CartItem).where(CartItem.id == item_id))
    cart_item = result.scalar_one_or_none()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    cart_item.quantity = update_data.quantity
    await db.commit()
    await db.refresh(cart_item)
    
    return CartItemSchema(
        id=cart_item.id,
        productId=cart_item.product_id,
        productName=cart_item.product_name,
        productImage=cart_item.product_image,
        price=cart_item.price,
        quantity=cart_item.quantity,
        userId=cart_item.user_id
    )


@api_router.delete("/cart/{item_id}")
async def delete_cart_item(item_id: str, db: AsyncSession = Depends(get_db)):
    """Remove item from cart"""
    result = await db.execute(select(CartItem).where(CartItem.id == item_id))
    cart_item = result.scalar_one_or_none()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    await db.delete(cart_item)
    await db.commit()
    
    return {"message": "Item removed from cart"}


@api_router.delete("/cart/clear/{userId}")
async def clear_cart(userId: str = "guest", db: AsyncSession = Depends(get_db)):
    """Clear all items from cart for a user"""
    await db.execute(delete(CartItem).where(CartItem.user_id == userId))
    await db.commit()
    
    return {"message": "Cart cleared successfully"}


# ==================== WISHLIST ENDPOINTS ====================

@api_router.post("/wishlist/add", response_model=WishlistItemSchema)
async def add_to_wishlist(wishlist_input: WishlistItemCreate, db: AsyncSession = Depends(get_db)):
    """Add item to wishlist"""
    # Check if product exists
    result = await db.execute(select(Product).where(Product.id == wishlist_input.productId))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if already in wishlist
    result = await db.execute(
        select(WishlistItem).where(
            and_(
                WishlistItem.product_id == wishlist_input.productId,
                WishlistItem.user_id == wishlist_input.userId
            )
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        return WishlistItemSchema(
            id=existing.id,
            productId=existing.product_id,
            userId=existing.user_id,
            createdAt=existing.created_at
        )
    
    # Add to wishlist
    wishlist_item = WishlistItem(
        product_id=wishlist_input.productId,
        user_id=wishlist_input.userId
    )
    
    db.add(wishlist_item)
    await db.commit()
    await db.refresh(wishlist_item)
    
    return WishlistItemSchema(
        id=wishlist_item.id,
        productId=wishlist_item.product_id,
        userId=wishlist_item.user_id,
        createdAt=wishlist_item.created_at
    )


@api_router.get("/wishlist", response_model=List[WishlistItemSchema])
async def get_wishlist(userId: str = Query("guest"), db: AsyncSession = Depends(get_db)):
    """Get wishlist items for a user"""
    result = await db.execute(select(WishlistItem).where(WishlistItem.user_id == userId))
    wishlist_items = result.scalars().all()
    
    return [
        WishlistItemSchema(
            id=item.id,
            productId=item.product_id,
            userId=item.user_id,
            createdAt=item.created_at
        )
        for item in wishlist_items
    ]


@api_router.delete("/wishlist/{item_id}")
async def remove_from_wishlist(item_id: str, db: AsyncSession = Depends(get_db)):
    """Remove item from wishlist"""
    result = await db.execute(select(WishlistItem).where(WishlistItem.id == item_id))
    wishlist_item = result.scalar_one_or_none()
    
    if not wishlist_item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    
    await db.delete(wishlist_item)
    await db.commit()
    
    return {"message": "Item removed from wishlist"}


# ==================== ORDERS ENDPOINTS ====================

@api_router.post("/orders", response_model=OrderSchema)
async def create_order(order_input: OrderCreate, db: AsyncSession = Depends(get_db)):
    """Create a new order"""
    order = Order(
        user_id=order_input.userId,
        items=[item.model_dump() for item in order_input.items],
        total_amount=order_input.totalAmount,
        customer_name=order_input.customerName,
        customer_phone=order_input.customerPhone,
        customer_email=order_input.customerEmail,
        delivery_address=order_input.deliveryAddress,
        delivery_method=order_input.deliveryMethod,
        payment_method=order_input.paymentMethod,
        notes=order_input.notes
    )
    
    db.add(order)
    await db.commit()
    await db.refresh(order)
    
    # Clear cart after order
    await db.execute(delete(CartItem).where(CartItem.user_id == order_input.userId))
    await db.commit()
    
    return OrderSchema(
        id=order.id,
        userId=order.user_id,
        items=order.items,
        totalAmount=order.total_amount,
        customerName=order.customer_name,
        customerPhone=order.customer_phone,
        customerEmail=order.customer_email,
        deliveryAddress=order.delivery_address,
        deliveryMethod=order.delivery_method,
        paymentMethod=order.payment_method,
        status=order.status,
        notes=order.notes,
        createdAt=order.created_at
    )


@api_router.get("/orders", response_model=List[OrderSchema])
async def get_orders(userId: str = Query("guest"), db: AsyncSession = Depends(get_db)):
    """Get orders for a user"""
    result = await db.execute(
        select(Order).where(Order.user_id == userId).order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    
    return [
        OrderSchema(
            id=order.id,
            userId=order.user_id,
            items=order.items,
            totalAmount=order.total_amount,
            customerName=order.customer_name,
            customerPhone=order.customer_phone,
            customerEmail=order.customer_email,
            deliveryAddress=order.delivery_address,
            deliveryMethod=order.delivery_method,
            paymentMethod=order.payment_method,
            status=order.status,
            notes=order.notes,
            createdAt=order.created_at
        )
        for order in orders
    ]


@api_router.get("/orders/{order_id}", response_model=OrderSchema)
async def get_order(order_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific order by ID"""
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return OrderSchema(
        id=order.id,
        userId=order.user_id,
        items=order.items,
        totalAmount=order.total_amount,
        customerName=order.customer_name,
        customerPhone=order.customer_phone,
        customerEmail=order.customer_email,
        deliveryAddress=order.delivery_address,
        deliveryMethod=order.delivery_method,
        paymentMethod=order.payment_method,
        status=order.status,
        notes=order.notes,
        createdAt=order.created_at
    )


# ==================== QUICK ORDER ENDPOINTS ====================

@api_router.post("/quick-order", response_model=QuickOrderSchema)
async def create_quick_order(order_input: QuickOrderCreate, db: AsyncSession = Depends(get_db)):
    """Create a quick order (one-click purchase)"""
    # Get product details
    result = await db.execute(select(Product).where(Product.id == order_input.productId))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check stock
    if product.stock < order_input.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    # Create quick order
    quick_order = QuickOrder(
        product_id=order_input.productId,
        product_name=product.name,
        product_image=product.image,
        price=product.price,
        quantity=order_input.quantity,
        customer_name=order_input.customerName,
        customer_phone=order_input.customerPhone,
        notes=order_input.notes
    )
    
    db.add(quick_order)
    await db.commit()
    await db.refresh(quick_order)
    
    return QuickOrderSchema(
        id=quick_order.id,
        productId=quick_order.product_id,
        productName=quick_order.product_name,
        productImage=quick_order.product_image,
        price=quick_order.price,
        quantity=quick_order.quantity,
        customerName=quick_order.customer_name,
        customerPhone=quick_order.customer_phone,
        status=quick_order.status,
        notes=quick_order.notes,
        createdAt=quick_order.created_at
    )


@api_router.get("/quick-orders", response_model=List[QuickOrderSchema])
async def get_quick_orders(phone: Optional[str] = Query(None), db: AsyncSession = Depends(get_db)):
    """Get quick orders, optionally filtered by phone"""
    query = select(QuickOrder).order_by(QuickOrder.created_at.desc())
    
    if phone:
        query = query.where(QuickOrder.customer_phone == phone)
    
    result = await db.execute(query)
    quick_orders = result.scalars().all()
    
    return [
        QuickOrderSchema(
            id=qo.id,
            productId=qo.product_id,
            productName=qo.product_name,
            productImage=qo.product_image,
            price=qo.price,
            quantity=qo.quantity,
            customerName=qo.customer_name,
            customerPhone=qo.customer_phone,
            status=qo.status,
            notes=qo.notes,
            createdAt=qo.created_at
        )
        for qo in quick_orders
    ]


@api_router.get("/quick-orders/{order_id}", response_model=QuickOrderSchema)
async def get_quick_order(order_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific quick order by ID"""
    result = await db.execute(select(QuickOrder).where(QuickOrder.id == order_id))
    quick_order = result.scalar_one_or_none()
    
    if not quick_order:
        raise HTTPException(status_code=404, detail="Quick order not found")
    
    return QuickOrderSchema(
        id=quick_order.id,
        productId=quick_order.product_id,
        productName=quick_order.product_name,
        productImage=quick_order.product_image,
        price=quick_order.price,
        quantity=quick_order.quantity,
        customerName=quick_order.customer_name,
        customerPhone=quick_order.customer_phone,
        status=quick_order.status,
        notes=quick_order.notes,
        createdAt=quick_order.created_at
    )


# ==================== ADMIN AUTHENTICATION ====================

@api_router.post("/admin/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin):
    """Admin login endpoint"""
    if not authenticate_admin(credentials.username, credentials.password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token(data={"sub": credentials.username})
    
    return AdminToken(
        access_token=access_token,
        token_type="bearer",
        username=credentials.username
    )


@api_router.get("/admin/verify")
async def verify_admin(current_admin: dict = Depends(get_current_admin)):
    """Verify admin token"""
    return {"valid": True, "username": current_admin["username"]}


# ==================== ADMIN DASHBOARD STATS ====================

@api_router.get("/admin/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get dashboard statistics"""
    # Total products
    total_products_result = await db.execute(select(func.count(Product.id)))
    total_products = total_products_result.scalar()
    
    # Total orders
    total_orders_result = await db.execute(select(func.count(Order.id)))
    total_orders = total_orders_result.scalar()
    
    # Total revenue
    revenue_result = await db.execute(select(func.sum(Order.total_amount)))
    total_revenue = revenue_result.scalar() or 0.0
    
    # Pending orders
    pending_orders_result = await db.execute(
        select(func.count(Order.id)).where(Order.status == "pending")
    )
    pending_orders = pending_orders_result.scalar()
    
    # Low stock products (less than 10)
    low_stock_result = await db.execute(
        select(func.count(Product.id)).where(Product.stock < 10)
    )
    low_stock_products = low_stock_result.scalar()
    
    # Total categories
    total_categories_result = await db.execute(select(func.count(Category.id)))
    total_categories = total_categories_result.scalar()
    
    return DashboardStats(
        totalProducts=total_products,
        totalOrders=total_orders,
        totalRevenue=total_revenue,
        pendingOrders=pending_orders,
        lowStockProducts=low_stock_products,
        totalCategories=total_categories
    )


@api_router.get("/admin/revenue-chart", response_model=List[RevenueData])
async def get_revenue_chart(
    days: int = Query(7, ge=1, le=30),
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get revenue data for chart (last N days)"""
    revenue_data = []
    
    for i in range(days):
        date = datetime.utcnow().date() - timedelta(days=days - i - 1)
        
        # Get orders for this date
        result = await db.execute(
            select(func.sum(Order.total_amount)).where(
                func.date(Order.created_at) == date
            )
        )
        revenue = result.scalar() or 0.0
        
        revenue_data.append(RevenueData(
            date=date.isoformat(),
            revenue=revenue
        ))
    
    return revenue_data


@api_router.get("/admin/top-products", response_model=List[TopProduct])
async def get_top_products(
    limit: int = Query(5, ge=1, le=20),
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get top selling products"""
    # This is a simplified version - in production you'd track actual sales
    result = await db.execute(
        select(Product).order_by(Product.stock.asc()).limit(limit)
    )
    products = result.scalars().all()
    
    top_products = []
    for product in products:
        # Simulate sales data (100 - stock = sold)
        sales = max(0, 100 - product.stock)
        revenue = sales * product.price
        
        top_products.append(TopProduct(
            id=product.id,
            name=product.name,
            sales=sales,
            revenue=revenue
        ))
    
    return top_products


# ==================== ADMIN ORDERS MANAGEMENT ====================

@api_router.get("/admin/orders", response_model=List[OrderSchema])
async def get_all_orders(
    status: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get all orders (admin only)"""
    query = select(Order).order_by(Order.created_at.desc())
    
    if status:
        query = query.where(Order.status == status)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    orders = result.scalars().all()
    
    return [
        OrderSchema(
            id=order.id,
            userId=order.user_id,
            items=order.items,
            totalAmount=order.total_amount,
            customerName=order.customer_name,
            customerPhone=order.customer_phone,
            customerEmail=order.customer_email,
            deliveryAddress=order.delivery_address,
            deliveryMethod=order.delivery_method,
            paymentMethod=order.payment_method,
            status=order.status,
            notes=order.notes,
            createdAt=order.created_at
        )
        for order in orders
    ]


@api_router.put("/admin/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update order status (admin only)"""
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status_update.status
    await db.commit()
    await db.refresh(order)
    
    return OrderSchema(
        id=order.id,
        userId=order.user_id,
        items=order.items,
        totalAmount=order.total_amount,
        customerName=order.customer_name,
        customerPhone=order.customer_phone,
        customerEmail=order.customer_email,
        deliveryAddress=order.delivery_address,
        deliveryMethod=order.delivery_method,
        paymentMethod=order.payment_method,
        status=order.status,
        notes=order.notes,
        createdAt=order.created_at
    )


# ==================== ADMIN ORDERS STATISTICS ====================

@api_router.get("/admin/orders/stats", response_model=OrderStats)
async def get_orders_stats(
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get orders statistics (admin only)"""
    # Total orders
    total_orders_result = await db.execute(select(func.count(Order.id)))
    total_orders = total_orders_result.scalar()
    
    # Completed orders
    completed_orders_result = await db.execute(
        select(func.count(Order.id)).where(Order.status == "delivered")
    )
    completed_orders = completed_orders_result.scalar()
    
    # Cancelled orders
    cancelled_orders_result = await db.execute(
        select(func.count(Order.id)).where(Order.status == "cancelled")
    )
    cancelled_orders = cancelled_orders_result.scalar()
    
    # Pending orders
    pending_orders_result = await db.execute(
        select(func.count(Order.id)).where(Order.status.in_(["pending", "confirmed", "processing"]))
    )
    pending_orders = pending_orders_result.scalar()
    
    # Total revenue (only delivered orders)
    revenue_result = await db.execute(
        select(func.sum(Order.total_amount)).where(Order.status == "delivered")
    )
    total_revenue = revenue_result.scalar() or 0.0
    
    # Average order value
    average_order_value = total_revenue / completed_orders if completed_orders > 0 else 0.0
    
    # Today's orders
    today = datetime.utcnow().date()
    today_orders_result = await db.execute(
        select(func.count(Order.id)).where(func.date(Order.created_at) == today)
    )
    today_orders = today_orders_result.scalar()
    
    # Today's revenue
    today_revenue_result = await db.execute(
        select(func.sum(Order.total_amount)).where(
            and_(
                func.date(Order.created_at) == today,
                Order.status == "delivered"
            )
        )
    )
    today_revenue = today_revenue_result.scalar() or 0.0
    
    return OrderStats(
        totalOrders=total_orders,
        completedOrders=completed_orders,
        cancelledOrders=cancelled_orders,
        pendingOrders=pending_orders,
        totalRevenue=total_revenue,
        averageOrderValue=average_order_value,
        todayOrders=today_orders,
        todayRevenue=today_revenue
    )


@api_router.get("/admin/orders/chart", response_model=List[OrdersChartData])
async def get_orders_chart(
    days: int = Query(7, ge=1, le=30),
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get orders chart data (last N days)"""
    chart_data = []
    
    for i in range(days):
        date = datetime.utcnow().date() - timedelta(days=days - i - 1)
        
        # Get orders count for this date
        orders_result = await db.execute(
            select(func.count(Order.id)).where(func.date(Order.created_at) == date)
        )
        orders_count = orders_result.scalar()
        
        # Get revenue for this date (delivered orders)
        revenue_result = await db.execute(
            select(func.sum(Order.total_amount)).where(
                and_(
                    func.date(Order.created_at) == date,
                    Order.status == "delivered"
                )
            )
        )
        revenue = revenue_result.scalar() or 0.0
        
        chart_data.append(OrdersChartData(
            date=date.isoformat(),
            orders=orders_count,
            revenue=revenue
        ))
    
    return chart_data


@api_router.get("/admin/orders/by-status", response_model=List[OrdersByStatus])
async def get_orders_by_status(
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get orders distribution by status"""
    # Get total orders
    total_orders_result = await db.execute(select(func.count(Order.id)))
    total_orders = total_orders_result.scalar() or 1  # Avoid division by zero
    
    # Get count for each status
    statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    status_data = []
    
    for status in statuses:
        count_result = await db.execute(
            select(func.count(Order.id)).where(Order.status == status)
        )
        count = count_result.scalar()
        percentage = (count / total_orders) * 100 if total_orders > 0 else 0
        
        status_data.append(OrdersByStatus(
            status=status,
            count=count,
            percentage=percentage
        ))
    
    return status_data


@api_router.get("/admin/orders/top-customers", response_model=List[TopCustomer])
async def get_top_customers(
    limit: int = Query(10, ge=1, le=50),
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get top customers by order count and spending"""
    # Group by customer and get stats
    result = await db.execute(
        select(
            Order.customer_name,
            Order.customer_phone,
            func.count(Order.id).label('order_count'),
            func.sum(Order.total_amount).label('total_spent')
        )
        .group_by(Order.customer_name, Order.customer_phone)
        .order_by(func.count(Order.id).desc())
        .limit(limit)
    )
    
    customers = result.all()
    
    return [
        TopCustomer(
            name=customer.customer_name,
            phone=customer.customer_phone,
            totalOrders=customer.order_count,
            totalSpent=customer.total_spent or 0.0
        )
        for customer in customers
    ]


# ==================== ADMIN CATEGORIES MANAGEMENT ====================

@api_router.post("/admin/categories", response_model=CategorySchema)
async def create_category(
    category_input: CategoryCreate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Create a new category (admin only)"""
    category = Category(
        name=category_input.name,
        icon=category_input.icon,
        count=category_input.count
    )
    
    db.add(category)
    await db.commit()
    await db.refresh(category)
    
    return CategorySchema(
        id=category.id,
        name=category.name,
        icon=category.icon,
        count=category.count
    )


@api_router.put("/admin/categories/{category_id}", response_model=CategorySchema)
async def update_category(
    category_id: str,
    update_data: CategoryUpdate,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Update a category (admin only)"""
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if update_data.name is not None:
        category.name = update_data.name
    if update_data.icon is not None:
        category.icon = update_data.icon
    if update_data.count is not None:
        category.count = update_data.count
    
    await db.commit()
    await db.refresh(category)
    
    return CategorySchema(
        id=category.id,
        name=category.name,
        icon=category.icon,
        count=category.count
    )


@api_router.delete("/admin/categories/{category_id}")
async def delete_category(
    category_id: str,
    current_admin: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Delete a category (admin only)"""
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    await db.delete(category)
    await db.commit()
    
    return {"message": "Category deleted successfully"}


# ==================== ADMIN IMAGE UPLOAD ====================

@api_router.post("/admin/upload-image", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    current_admin: dict = Depends(get_current_admin)
):
    """Upload an image file (admin only)"""
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")
    
    # Return URL (relative path that will be served by the app)
    image_url = f"/uploads/{unique_filename}"
    
    return ImageUploadResponse(
        url=image_url,
        filename=unique_filename
    )


# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "PlatanSad API is running", "version": "2.0.0 (PostgreSQL)"}


@api_router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint"""
    try:
        # Check database connection
        await db.execute(select(1))
        return {"status": "healthy", "database": "connected", "db_type": "PostgreSQL"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}


# ==================== LIQPAY ENDPOINTS ====================

from liqpay_service import liqpay_service

@api_router.post("/liqpay/create-checkout")
async def create_liqpay_checkout(
    order_id: str = Query(..., description="Order ID"),
    amount: float = Query(..., description="Payment amount"),
    description: str = Query(..., description="Payment description"),
    result_url: Optional[str] = Query(None, description="Result URL after payment"),
    server_url: Optional[str] = Query(None, description="Server callback URL"),
):
    """
    Create LiqPay checkout session
    Returns data and signature for payment form
    """
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
        logger.error(f"LiqPay checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create checkout: {str(e)}")


@api_router.get("/liqpay/status/{order_id}")
async def get_liqpay_status(order_id: str):
    """
    Get payment status for an order
    Note: In real implementation, this would check actual payment status
    """
    # This is a mock endpoint - in production you would query LiqPay API or your database
    return {
        "order_id": order_id,
        "status": "pending",
        "message": "Payment status check not implemented in sandbox mode"
    }


@api_router.post("/liqpay/callback")
async def liqpay_callback(
    data: str = Query(...),
    signature: str = Query(...)
):
    """
    LiqPay callback endpoint
    Receives payment status updates from LiqPay
    """
    try:
        # Verify signature
        if not liqpay_service.verify_callback(data, signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Decode callback data
        callback_data = liqpay_service.decode_callback_data(data)
        
        # Log the payment status
        logger.info(f"LiqPay callback: {callback_data}")
        
        # Here you would update order status in database
        # For now, just return success
        return {"status": "ok", "message": "Callback received"}
        
    except Exception as e:
        logger.error(f"LiqPay callback error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["https://archive-unpacker-4.preview.emergentagent.com", "http://localhost:3000", "http://localhost:8001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    """Initialize database on startup"""
    await init_db()
    logger.info("Database initialized")


@app.on_event("shutdown")
async def shutdown():
    """Close database connection on shutdown"""
    await close_db()
    logger.info("Database connection closed")

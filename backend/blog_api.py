"""
Blog API endpoints for CMS
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from database import get_db, BlogPost, MenuItem
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import re

blog_router = APIRouter(prefix="/api/blog", tags=["Blog"])
menu_router = APIRouter(prefix="/api/menu", tags=["Menu"])


# ============ PYDANTIC MODELS ============

class BlogPostCreate(BaseModel):
    title: str
    excerpt: Optional[str] = None
    content: str
    image_url: Optional[str] = None
    author: str = "PlatanSad"
    category: Optional[str] = None
    tags: List[str] = []
    is_published: bool = True
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None

class MenuItemCreate(BaseModel):
    title: str
    url: str
    icon: Optional[str] = None
    order: int = 0
    is_active: bool = True
    parent_id: Optional[str] = None

class MenuItemUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# ============ HELPER FUNCTIONS ============

def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


# ============ BLOG ENDPOINTS ============

@blog_router.get("/posts", response_model=List[dict])
async def get_blog_posts(
    published_only: bool = True,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Get all blog posts"""
    query = select(BlogPost)
    
    if published_only:
        query = query.where(BlogPost.is_published == True)
    
    query = query.order_by(BlogPost.published_at.desc())
    query = query.limit(limit).offset(offset)
    
    result = await db.execute(query)
    posts = result.scalars().all()
    
    return [
        {
            "id": post.id,
            "slug": post.slug,
            "title": post.title,
            "excerpt": post.excerpt,
            "content": post.content,
            "image_url": post.image_url,
            "author": post.author,
            "category": post.category,
            "tags": post.tags,
            "is_published": post.is_published,
            "views": post.views,
            "published_at": post.published_at,
            "created_at": post.created_at,
            "updated_at": post.updated_at
        }
        for post in posts
    ]

@blog_router.get("/posts/{slug}")
async def get_blog_post(slug: str, db: AsyncSession = Depends(get_db)):
    """Get blog post by slug"""
    result = await db.execute(
        select(BlogPost).where(BlogPost.slug == slug)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Increment views
    await db.execute(
        update(BlogPost)
        .where(BlogPost.slug == slug)
        .values(views=post.views + 1)
    )
    await db.commit()
    
    return {
        "id": post.id,
        "slug": post.slug,
        "title": post.title,
        "excerpt": post.excerpt,
        "content": post.content,
        "image_url": post.image_url,
        "author": post.author,
        "category": post.category,
        "tags": post.tags,
        "is_published": post.is_published,
        "views": post.views + 1,
        "published_at": post.published_at,
        "meta_description": post.meta_description,
        "meta_keywords": post.meta_keywords
    }

@blog_router.post("/posts")
async def create_blog_post(
    post_data: BlogPostCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create new blog post"""
    # Generate slug
    slug = generate_slug(post_data.title)
    
    # Check if slug exists
    result = await db.execute(
        select(BlogPost).where(BlogPost.slug == slug)
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        # Add timestamp to make unique
        slug = f"{slug}-{int(datetime.utcnow().timestamp())}"
    
    post = BlogPost(
        slug=slug,
        **post_data.dict()
    )
    
    db.add(post)
    await db.commit()
    
    return {
        "message": "Blog post created successfully",
        "id": post.id,
        "slug": post.slug
    }

@blog_router.put("/posts/{post_id}")
async def update_blog_post(
    post_id: str,
    post_data: BlogPostUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update blog post"""
    update_data = post_data.dict(exclude_unset=True)
    
    # If title changed, regenerate slug
    if 'title' in update_data:
        update_data['slug'] = generate_slug(update_data['title'])
    
    await db.execute(
        update(BlogPost)
        .where(BlogPost.id == post_id)
        .values(**update_data)
    )
    await db.commit()
    
    return {"message": "Blog post updated successfully"}

@blog_router.delete("/posts/{post_id}")
async def delete_blog_post(
    post_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete blog post"""
    await db.execute(
        delete(BlogPost).where(BlogPost.id == post_id)
    )
    await db.commit()
    
    return {"message": "Blog post deleted successfully"}


# ============ MENU ENDPOINTS ============

@menu_router.get("/items", response_model=List[dict])
async def get_menu_items(db: AsyncSession = Depends(get_db)):
    """Get all menu items"""
    result = await db.execute(
        select(MenuItem)
        .where(MenuItem.is_active == True)
        .order_by(MenuItem.order)
    )
    items = result.scalars().all()
    
    return [
        {
            "id": item.id,
            "title": item.title,
            "url": item.url,
            "icon": item.icon,
            "order": item.order,
            "is_active": item.is_active,
            "parent_id": item.parent_id
        }
        for item in items
    ]

@menu_router.post("/items")
async def create_menu_item(
    item_data: MenuItemCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create menu item"""
    item = MenuItem(**item_data.dict())
    db.add(item)
    await db.commit()
    
    return {"message": "Menu item created successfully", "id": item.id}

@menu_router.put("/items/{item_id}")
async def update_menu_item(
    item_id: str,
    item_data: MenuItemUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update menu item"""
    update_data = item_data.dict(exclude_unset=True)
    
    await db.execute(
        update(MenuItem)
        .where(MenuItem.id == item_id)
        .values(**update_data)
    )
    await db.commit()
    
    return {"message": "Menu item updated successfully"}

@menu_router.delete("/items/{item_id}")
async def delete_menu_item(
    item_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete menu item"""
    await db.execute(
        delete(MenuItem).where(MenuItem.id == item_id)
    )
    await db.commit()
    
    return {"message": "Menu item deleted successfully"}

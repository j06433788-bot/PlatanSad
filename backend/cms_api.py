"""
CMS API endpoints for admin panel
"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from database import get_db, PageContent, HeroSection, FooterLink
from pydantic import BaseModel
from typing import List, Optional
from admin_auth import get_current_admin

cms_router = APIRouter(prefix="/api/cms", tags=["CMS"])


# Pydantic models
class PageContentSchema(BaseModel):
    page_key: str
    title: str
    content: str
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None

class PageContentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None

class HeroSectionSchema(BaseModel):
    title: str
    subtitle: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None
    background_image: Optional[str] = None

class FooterLinkSchema(BaseModel):
    section: str
    title: str
    url: str
    order: int = 0
    is_active: bool = True

class FooterLinkUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


# ============ PAGE CONTENT ENDPOINTS ============

@cms_router.get("/pages", response_model=List[dict])
async def get_all_pages(db: AsyncSession = Depends(get_db)):
    """Get all pages"""
    result = await db.execute(select(PageContent))
    pages = result.scalars().all()
    return [
        {
            "id": p.id,
            "page_key": p.page_key,
            "title": p.title,
            "content": p.content,
            "meta_description": p.meta_description,
            "meta_keywords": p.meta_keywords,
            "updated_at": p.updated_at
        }
        for p in pages
    ]

@cms_router.get("/pages/{page_key}")
async def get_page_by_key(page_key: str, db: AsyncSession = Depends(get_db)):
    """Get page by key"""
    result = await db.execute(
        select(PageContent).where(PageContent.page_key == page_key)
    )
    page = result.scalar_one_or_none()
    
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    return {
        "id": page.id,
        "page_key": page.page_key,
        "title": page.title,
        "content": page.content,
        "meta_description": page.meta_description,
        "meta_keywords": page.meta_keywords,
        "updated_at": page.updated_at
    }

@cms_router.post("/pages")
async def create_page(
    page_data: PageContentSchema,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    """Create a new page"""
    result = await db.execute(
        select(PageContent).where(PageContent.page_key == page_data.page_key)
    )
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Page key already exists"
        )

    page = PageContent(**page_data.dict())
    db.add(page)
    await db.commit()

    return {"message": "Page created successfully", "id": page.id}

@cms_router.put("/pages/{page_key}")
async def update_page(
    page_key: str, 
    page_data: PageContentUpdate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    """Update page content"""
    result = await db.execute(
        select(PageContent).where(PageContent.page_key == page_key)
    )
    page = result.scalar_one_or_none()
    
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    update_data = page_data.dict(exclude_unset=True)
    
    await db.execute(
        update(PageContent)
        .where(PageContent.page_key == page_key)
        .values(**update_data)
    )
    await db.commit()
    
    return {"message": "Page updated successfully"}

@cms_router.delete("/pages/{page_key}")
async def delete_page(
    page_key: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    """Delete a page"""
    result = await db.execute(
        select(PageContent).where(PageContent.page_key == page_key)
    )
    page = result.scalar_one_or_none()

    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    await db.execute(
        delete(PageContent).where(PageContent.page_key == page_key)
    )
    await db.commit()

    return {"message": "Page deleted successfully"}


# ============ HERO SECTION ENDPOINTS ============

@cms_router.get("/hero")
async def get_hero_section(db: AsyncSession = Depends(get_db)):
    """Get hero section"""
    result = await db.execute(select(HeroSection))
    hero = result.scalar_one_or_none()
    
    if not hero:
        raise HTTPException(status_code=404, detail="Hero section not found")
    
    return {
        "id": hero.id,
        "title": hero.title,
        "subtitle": hero.subtitle,
        "button_text": hero.button_text,
        "button_link": hero.button_link,
        "background_image": hero.background_image,
        "updated_at": hero.updated_at
    }

@cms_router.put("/hero")
async def update_hero_section(
    hero_data: HeroSectionSchema,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    """Update hero section"""
    result = await db.execute(select(HeroSection))
    hero = result.scalar_one_or_none()
    
    if not hero:
        # Create if doesn't exist
        hero = HeroSection(id="main", **hero_data.dict())
        db.add(hero)
    else:
        await db.execute(
            update(HeroSection)
            .where(HeroSection.id == "main")
            .values(**hero_data.dict())
        )
    
    await db.commit()
    return {"message": "Hero section updated successfully"}


# ============ FOOTER LINKS ENDPOINTS ============

@cms_router.get("/footer-links", response_model=List[dict])
async def get_footer_links(db: AsyncSession = Depends(get_db)):
    """Get all footer links"""
    result = await db.execute(
        select(FooterLink).order_by(FooterLink.section, FooterLink.order)
    )
    links = result.scalars().all()
    return [
        {
            "id": link.id,
            "section": link.section,
            "title": link.title,
            "url": link.url,
            "order": link.order,
            "is_active": link.is_active
        }
        for link in links
    ]

@cms_router.post("/footer-links")
async def create_footer_link(
    link_data: FooterLinkSchema,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    """Create new footer link"""
    link = FooterLink(**link_data.dict())
    db.add(link)
    await db.commit()
    return {"message": "Footer link created successfully", "id": link.id}

@cms_router.put("/footer-links/{link_id}")
async def update_footer_link(
    link_id: str,
    link_data: FooterLinkUpdate,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    """Update footer link"""
    update_data = link_data.dict(exclude_unset=True)
    
    await db.execute(
        update(FooterLink)
        .where(FooterLink.id == link_id)
        .values(**update_data)
    )
    await db.commit()
    
    return {"message": "Footer link updated successfully"}

@cms_router.delete("/footer-links/{link_id}")
async def delete_footer_link(
    link_id: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_admin)
):
    """Delete footer link"""
    await db.execute(
        delete(FooterLink).where(FooterLink.id == link_id)
    )
    await db.commit()
    
    return {"message": "Footer link deleted successfully"}

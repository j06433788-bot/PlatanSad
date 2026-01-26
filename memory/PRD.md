# PlatanSad - E-commerce Plant Nursery

## Original Problem Statement
Створення повнофункціонального e-commerce сайту для розсадника рослин "PlatanSad" з CMS системою для адміністратора.

## User Personas
- **Покупці:** Садівники, власники ділянок, ландшафтні дизайнери
- **Адміністратор:** Власник розсадника, який керує товарами, замовленнями та контентом

## Core Requirements
1. ✅ Каталог рослин з категоріями та фільтрацією
2. ✅ Корзина та оформлення замовлень
3. ✅ Інтеграція з Новою Поштою для доставки
4. ✅ Адмін-панель для управління товарами та замовленнями
5. ✅ CMS для редагування статичних сторінок
6. ✅ Блог з можливістю створення статей
7. ✅ Медіа-бібліотека для зображень

## Tech Stack
- **Frontend:** React, TailwindCSS, Shadcn/UI
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL (prod: MySQL)
- **Hosting:** VPS.ua з Webuzo

## What's Been Implemented

### Phase 1: Core E-commerce (DONE)
- [x] Product catalog with categories
- [x] Shopping cart functionality
- [x] Checkout with Nova Poshta integration
- [x] Order management
- [x] Admin authentication

### Phase 2: CMS Basic (DONE)
- [x] Static pages management (About, Delivery, Contacts, Return)
- [x] Hero section editor
- [x] Site settings management

### Phase 3: CMS Extended (DONE)
- [x] Blog system with CRUD operations
- [x] Menu management
- [x] Media library with file upload

### Deployment Preparation (DONE - Jan 26, 2026)
- [x] Export data scripts created
- [x] Import data scripts for MySQL
- [x] Deployment guide for VPS.ua with Webuzo
- [x] MySQL compatibility added

## Prioritized Backlog

### P0 (High Priority)
- [ ] Deploy to production (platansad.com.ua)
- [ ] Test all functionality on production

### P1 (Medium Priority)
- [ ] SEO meta tags management for products
- [ ] Header/Footer CMS editing
- [ ] Image optimization for production

### P2 (Low Priority)
- [ ] Email notifications for orders
- [ ] Customer reviews system
- [ ] Analytics integration

## Files Structure
```
/app/
├── backend/
│   ├── server.py         # Main FastAPI app
│   ├── database.py       # SQLAlchemy models
│   ├── media_api.py      # Media library API
│   ├── blog_api.py       # Blog API
│   ├── cms_api.py        # CMS pages API
│   ├── export_data.py    # Data export script
│   ├── import_data.py    # Data import script
│   └── export_data/      # Exported JSON files
├── frontend/
│   ├── src/
│   │   ├── admin/        # Admin panel
│   │   ├── pages/        # Public pages
│   │   └── components/   # UI components
├── DEPLOY_GUIDE.md       # Deployment instructions
└── platansad_deploy.tar.gz  # Ready for deployment
```

## Key Endpoints
- `/api/products` - Products CRUD
- `/api/categories` - Categories
- `/api/orders` - Orders management
- `/api/media/files` - Media library
- `/api/blog/posts` - Blog articles
- `/api/cms/pages` - Static pages

## Admin Access
- URL: `/admin/login`
- Default: admin / admin123

## Domain
- Production: https://platansad.com.ua

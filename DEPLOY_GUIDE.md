# 🚀 Інструкція з деплою PlatanSad на VPS.ua (Webuzo + Ubuntu)

## Передумови
- VPS: 2GB RAM, 40GB диску
- ОС: Ubuntu 20.04/22.04
- Домен: platansad.com.ua
- Root доступ через SSH

---

## 📦 КРОК 1: Підготовка файлів для деплою

### 1.1 Завантажте проект з Emergent
На платформі Emergent натисніть **"Download Code"** або **"Save to GitHub"**

### 1.2 Структура проекту
```
platansad/
├── backend/           # FastAPI backend
│   ├── server.py
│   ├── database.py
│   ├── requirements.txt
│   ├── uploads/       # Завантажені файли
│   └── export_data/   # Експортовані дані
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── DEPLOY_GUIDE.md    # Ця інструкція
```

---

## 🖥️ КРОК 2: Підключення до VPS

```bash
ssh root@YOUR_VPS_IP
# або через Webuzo панель -> SSH Terminal
```

---

## 🔧 КРОК 3: Встановлення необхідного ПЗ

### 3.1 Оновлення системи
```bash
apt update && apt upgrade -y
```

### 3.2 Встановлення Python 3.11
```bash
apt install -y software-properties-common
add-apt-repository -y ppa:deadsnakes/ppa
apt update
apt install -y python3.11 python3.11-venv python3.11-dev python3-pip
```

### 3.3 Встановлення Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g yarn
```

### 3.4 Встановлення MySQL (через Webuzo)
В панелі Webuzo:
1. Перейдіть в **Databases** → **MySQL**
2. Створіть базу даних: `platansad_db`
3. Створіть користувача: `platansad_user`
4. Пароль: `ВАШІ_НАДІЙНИЙ_ПАРОЛЬ`
5. Надайте всі права користувачу на базу

**Або через командний рядок:**
```bash
mysql -u root -p
```
```sql
CREATE DATABASE platansad_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'platansad_user'@'localhost' IDENTIFIED BY 'ВАШІ_НАДІЙНИЙ_ПАРОЛЬ';
GRANT ALL PRIVILEGES ON platansad_db.* TO 'platansad_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3.5 Встановлення Nginx
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

---

## 📂 КРОК 4: Завантаження проекту

### 4.1 Створення директорії
```bash
mkdir -p /var/www/platansad
cd /var/www/platansad
```

### 4.2 Завантаження файлів
**Варіант A: Через SFTP (FileZilla, WinSCP)**
- Host: YOUR_VPS_IP
- Username: root
- Password: ваш пароль
- Завантажте папки `backend` та `frontend` в `/var/www/platansad/`

**Варіант B: Через Git**
```bash
git clone YOUR_GITHUB_REPO /var/www/platansad
```

---

## ⚙️ КРОК 5: Налаштування Backend

### 5.1 Створення віртуального середовища
```bash
cd /var/www/platansad/backend
python3.11 -m venv venv
source venv/bin/activate
```

### 5.2 Встановлення залежностей
```bash
pip install --upgrade pip
pip install -r requirements.txt
pip install aiomysql pymysql
```

### 5.3 Створення файлу .env
```bash
nano /var/www/platansad/backend/.env
```

Вміст файлу:
```env
# MySQL Database (замініть на ваші дані)
DATABASE_URL=mysql+aiomysql://platansad_user:ВАШІ_НАДІЙНИЙ_ПАРОЛЬ@localhost:3306/platansad_db

# JWT Secret (згенеруйте новий)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ваш_надійний_пароль_адміна
```

### 5.4 Оновлення database.py для MySQL
Відредагуйте `/var/www/platansad/backend/database.py`:

Замініть рядок:
```python
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql+asyncpg://...')
```

На:
```python
DATABASE_URL = os.environ.get('DATABASE_URL', 'mysql+aiomysql://platansad_user:password@localhost:3306/platansad_db')
```

### 5.5 Імпорт даних
```bash
cd /var/www/platansad/backend
source venv/bin/activate

# Спочатку створіть таблиці
python -c "import asyncio; from database import init_db; asyncio.run(init_db())"

# Імпортуйте дані (якщо є export_data/)
python import_data.py
```

### 5.6 Перевірка запуску
```bash
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001
# Ctrl+C для зупинки
```

---

## 🎨 КРОК 6: Збірка Frontend

### 6.1 Встановлення залежностей
```bash
cd /var/www/platansad/frontend
yarn install
```

### 6.2 Створення файлу .env
```bash
nano /var/www/platansad/frontend/.env
```

Вміст:
```env
REACT_APP_BACKEND_URL=https://platansad.com.ua
```

### 6.3 Збірка production версії
```bash
yarn build
```

Готовий сайт буде в папці `build/`

---

## 🔄 КРОК 7: Налаштування Systemd (автозапуск Backend)

### 7.1 Створення сервісу
```bash
nano /etc/systemd/system/platansad.service
```

Вміст:
```ini
[Unit]
Description=PlatanSad Backend API
After=network.target mysql.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/platansad/backend
Environment="PATH=/var/www/platansad/backend/venv/bin"
ExecStart=/var/www/platansad/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

### 7.2 Встановлення прав
```bash
chown -R www-data:www-data /var/www/platansad
chmod -R 755 /var/www/platansad
```

### 7.3 Запуск сервісу
```bash
systemctl daemon-reload
systemctl enable platansad
systemctl start platansad
systemctl status platansad
```

---

## 🌐 КРОК 8: Налаштування Nginx

### 8.1 Створення конфігурації
```bash
nano /etc/nginx/sites-available/platansad
```

Вміст:
```nginx
server {
    listen 80;
    server_name platansad.com.ua www.platansad.com.ua;

    # Frontend (React)
    root /var/www/platansad/frontend/build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }

    # Uploaded files
    location /uploads/ {
        alias /var/www/platansad/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # React Router - SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 8.2 Активація конфігурації
```bash
ln -s /etc/nginx/sites-available/platansad /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Видалити default
nginx -t  # Перевірка конфігурації
systemctl reload nginx
```

---

## 🔒 КРОК 9: SSL Сертифікат (Let's Encrypt)

### 9.1 Встановлення Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### 9.2 Отримання сертифіката
```bash
certbot --nginx -d platansad.com.ua -d www.platansad.com.ua
```

Дотримуйтесь інструкцій:
- Введіть email
- Погодьтесь з умовами
- Виберіть редірект HTTP → HTTPS

### 9.3 Автоматичне оновлення
```bash
certbot renew --dry-run  # Тест
```

Certbot автоматично додасть cron-завдання для оновлення.

---

## ✅ КРОК 10: Перевірка

### 10.1 Перевірка сервісів
```bash
systemctl status platansad  # Backend
systemctl status nginx      # Nginx
systemctl status mysql      # MySQL
```

### 10.2 Перевірка API
```bash
curl https://platansad.com.ua/api/health
# Очікувана відповідь: {"status":"healthy","database":"connected","db_type":"MySQL"}
```

### 10.3 Перевірка сайту
Відкрийте в браузері: https://platansad.com.ua

---

## 🔧 Корисні команди

### Перегляд логів
```bash
# Backend логи
journalctl -u platansad -f

# Nginx логи
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Перезапуск сервісів
```bash
systemctl restart platansad
systemctl restart nginx
```

### Оновлення коду
```bash
cd /var/www/platansad

# Backend
cd backend
source venv/bin/activate
git pull  # або завантажте нові файли
pip install -r requirements.txt
systemctl restart platansad

# Frontend
cd ../frontend
git pull
yarn install
yarn build
```

---

## ⚠️ Можливі проблеми

### Помилка підключення до MySQL
```bash
# Перевірте права користувача
mysql -u platansad_user -p -e "SHOW DATABASES;"
```

### Backend не запускається
```bash
# Перевірте логи
journalctl -u platansad -n 50

# Запустіть вручну для діагностики
cd /var/www/platansad/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001
```

### 502 Bad Gateway
```bash
# Перевірте чи запущений backend
systemctl status platansad

# Перевірте порт
netstat -tlnp | grep 8001
```

---

## 📞 Підтримка

Якщо виникли питання:
1. Перегляньте логи (команди вище)
2. Перевірте статус сервісів
3. Зверніться до підтримки VPS.ua

---

**Готово! 🎉 Ваш сайт має працювати на https://platansad.com.ua**

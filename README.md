# SamvelSite — Сайт-визитка для компании натяжных потолков

Полноценный одностраничный сайт-визитка на React + FastAPI + SQLite с админ-панелью и динамической галереей.  
Дизайн — строгий чёрно-белый минимализм с анимациями, адаптивный под мобильные устройства.

## Стек технологий

| Компонент | Технология |
|-----------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS 4 |
| **Backend** | FastAPI, SQLAlchemy, SQLite |
| **Админ-панель** | HTML + JS |
| **Контейнеризация** | Docker, Docker Compose |
| **Прокси** | Nginx |
| **Сеть** | Bridge (внутренняя Docker-сеть) |

## Быстрый старт

### 1. Запуск через Docker (рекомендуется)

```bash
# Сборка и запуск
docker compose up --build

# Остановка
docker compose down

# Остановка с удалением томов (БД + фото)
docker compose down -v

# Пересборка после изменений кода
docker compose up --build
```

| Сервис | Адрес |
|--------|-------|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:8080/api/ |
| Админ-панель (заявки) | http://localhost:8080/admin |
| Админ-панель (галерея) | http://localhost:8080/admin/works |

**Как работает связка в Docker:**

```
Браузер → http://localhost:8080 → Nginx (frontend)
  ├── /api/*     → proxy_pass → http://samvel-backend:8000
  ├── /uploads/* → proxy_pass → http://samvel-backend:8000
  ├── /admin*    → proxy_pass → http://samvel-backend:8000
  └── /*         → раздача статики (index.html)
```

Nginx проксирует все запросы к API и админке на backend по имени контейнера `samvel-backend:8000` через внутреннюю Docker-сеть. Фронтенд при этом отправляет запросы на **относительные пути** (`/api/...`, `/uploads/...`), так как `VITE_API_URL` внутри Docker пустой.

### 2. Локальная разработка (без Docker)

#### Backend

```bash
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация (Windows)
venv\Scripts\activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Backend будет доступен на `http://localhost:8000`.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:5173`.

При локальной разработке фронтенд обращается к бэкенду напрямую по `VITE_API_URL`, указанному в `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

Если ваш backend запущен на другом порту (например 8002), измените это значение.

## Конфигурация

### backend/.env

```env
# Сервер
HOST=0.0.0.0
PORT=8000

# База данных
DATABASE_URL=sqlite:///./samvel.db

# CORS — разрешённые источники (через запятую)
CORS_ORIGINS=http://localhost:5173,http://localhost:8080
```

### frontend/.env

```env
# URL backend API (для локальной разработки)
VITE_API_URL=http://localhost:8000
```

**Важно:** В продакшене (через Docker) `VITE_API_URL` пустой. Фронтенд использует относительные пути, а Nginx сам проксирует их на backend. В локальной разработке `VITE_API_URL` указывает напрямую на backend.

## Админ-панель

### Заявки
`/admin` — просмотр списка заявок с формы обратной связи.

### Галерея
`/admin/works` — управление коллажами в галерее:
- Создание/редактирование работ (название, подзаголовок, описание, тип макета)
- Загрузка фотографий для каждой работы
- Удаление работ и фотографий

## Структура проекта

```
SamvelSite/
├── backend/
│   ├── app/
│   │   ├── main.py          # Точка входа FastAPI (загружает .env)
│   │   ├── database.py      # Настройка SQLite
│   │   ├── models.py        # SQLAlchemy модели
│   │   ├── schemas.py       # Pydantic схемы
│   │   ├── crud.py          # CRUD операции
│   │   └── routers/
│   │       ├── contacts.py  # API заявок
│   │       ├── works.py     # API работ/галереи
│   │       └── admin.py     # Админ-панель (HTML)
│   ├── uploads/             # Загруженные фото (volume в Docker)
│   ├── .env                 # Конфигурация backend
│   ├── .gitignore
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── api/client.js    # Axios клиент (API_BASE = VITE_API_URL || '')
│   │   └── hooks/           # Кастомные хуки
│   ├── .env                 # VITE_API_URL для локальной разработки
│   ├── .gitignore
│   ├── Dockerfile           # Мультистейдж (node build → nginx)
│   ├── nginx.conf           # Прокси на backend через Docker-сеть
│   └── package.json
│
├── docker-compose.yml       # Backend + frontend в одной сети
└── README.md
```

## API Endpoints

### Заявки
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/contacts/` | Создать заявку |
| GET | `/api/contacts/` | Список заявок |
| GET | `/api/contacts/{id}` | Детали заявки |

### Работы (галерея)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/works/` | Список всех работ с фото |
| GET | `/api/works/{id}` | Детали работы |
| POST | `/api/works/` | Создать работу |
| PUT | `/api/works/{id}` | Обновить работу |
| DELETE | `/api/works/{id}` | Удалить работу |
| POST | `/api/works/{id}/images` | Загрузить фото |
| DELETE | `/api/works/images/{id}` | Удалить фото |

## Дизайн

- Чёрно-белая цветовая гамма
- Строгий минимализм без скруглений
- Анимации появления при скролле (IntersectionObserver)
- Световая сетка на фоне секций
- Адаптивная вёрстка (mobile-first)
- Бургер-меню для мобильных
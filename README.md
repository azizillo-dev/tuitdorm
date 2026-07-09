# TATU Dormitory Attendance Management System — Backend Skeleton + Auth

Muhammad al-Xorazmiy nomidagi Toshkent axborot texnologiyalari universiteti (TATU) yotoqxonasi uchun davomat va boshqaruv tizimining backend qismi (`dormitory_backend`). Ushbu loyiha **Django 5.x**, **Django REST Framework**, **PostgreSQL** va **djangorestframework-simplejwt** texnologiyalari asosida **HackSoft Django Styleguide** arxitektura qoidalariga to'liq rioya qilgan holda ishlab chiqildi.

---

## 🏛 Texnologik stek va arxitektura qoidalari

- **Django**: `>=5.0`
- **Django REST Framework (DRF)**: API endpointlar uchun thin view/serializer arxitekturasi
- **Database**: Real **PostgreSQL** (barcha testlar ham real PostgreSQL test bazasida ishlaydi)
- **Authentication**: JWT tokenlar (`djangorestframework-simplejwt` + `token_blacklist`)
- **Styleguide (HackSoft Django Styleguide)**:
  - **Fat models forbidden**: Modellarda faqat maydonlar (fields) va oddiy metodlar mavjud.
  - **Services (`services.py`)**: Barcha yozish va ma'lumotlarni o'zgartirish bilan bog'liq biznes logikalar faqat servislar ichida joylashgan (`create_block_head`, `create_floor_head`, `create_observer`, `create_assistant`, `update_user_profile`, `change_user_password`).
  - **Selectors (`selectors.py`)**: Barcha o'qish va filtrlash logikalari `selectors.py` ichida joylashgan (`get_user_scope_dict`, `list_users_for_scope`).
  - **Thin views & serializers**: Viewlar va serializerlar faqat ma'lumot qabul qilish, validatsiya qilish va servislarni chaqirish vazifasini bajaradi.

---

## 📂 Loyiha tuzilishi

```
tuitdorm.uz/
├── manage.py
├── requirements.txt
├── pytest.ini
├── .env
├── .env.example
├── README.md
├── dormitory_backend/
│   ├── __init__.py
│   ├── settings.py           # PostgreSQL, CORS, JWT va ilova sozlamalari
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── structure/                # Forward-referenced placeholder modellar
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py             # Building, Block, Floor
│   └── migrations/
└── accounts/                 # Asosiy foydalanuvchilar va avtorizatsiya appi
    ├── __init__.py
    ├── apps.py
    ├── models.py             # Custom User modeli va UserManager
    ├── services.py           # Biznes logikalar (yaratish, limitlar, huquqlarni tekshirish)
    ├── selectors.py          # O'qish (Read-only) logikalari
    ├── permissions.py        # Reusable DRF permission klasslar
    ├── serializers.py        # Thin serializerlar
    ├── views.py              # Auth endpointlari (/api/auth/*)
    ├── apiviews/             # Foydalanuvchilarni boshqarish endpointlari (/api/accounts/*)
    │   ├── __init__.py
    │   ├── views.py
    │   └── urls.py
    ├── urls.py
    ├── migrations/
    └── tests/                # 43 ta real PostgreSQL asosidagi testlar
        ├── __init__.py
        ├── conftest.py
        ├── test_models.py
        ├── test_services.py
        ├── test_permissions.py
        ├── test_auth_endpoints.py
        └── test_scope_isolation.py
```

---

## 🚀 O'rnatish va ishga tushirish (Setup Instructions)

### 1. Repositoryni yuklab olish va virtual muhit yaratish
```powershell
# Loyiha papkasiga o'ting
cd c:\Users\user\Desktop\tuitdorm.uz

# Virtual muhit (venv) yaratish
python -m venv venv

# Virtual muhitni aktivlashtirish (Windows PowerShell)
.\venv\Scripts\Activate.ps1
```

### 2. Kutubxonalarni o'rnatish
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. PostgreSQL va `.env` sozlamalarini kiritish
Loyiha ildizidagi `.env.example` faylidan nusxa olib, `.env` faylini yarating va PostgreSQL ma'lumotlaringizni kiriting:

```env
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# PostgreSQL configuration
DB_NAME=dormitory_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# CORS configuration for Next.js frontend
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

PostgreSQL'da `dormitory_db` bazasini yarating:
```sql
CREATE DATABASE dormitory_db;
```

### 4. Migratsiyalarni amalga oshirish
```powershell
python manage.py migrate
```

### 5. Superadmin yaratish
```powershell
python manage.py createsuperuser --username admin
```

### 6. Serverni ishga tushirish
```powershell
python manage.py runserver
```

---

## 🧪 Testlarni ishga tushirish (`pytest` + Real PostgreSQL)

Loyiha to'liq **real PostgreSQL test bazasida** sinovdan o'tkazilgan (hech qanday mock ishlatilmagan). Testlar doirasi va izolyatsiyasi to'liq qamrab olingan (`43 ta test`).

Testlarni ishga tushirish uchun:
```powershell
.\venv\Scripts\pytest.exe -v
```

Natija:
```
============================= 43 passed in 38.86s =============================
```

---

## 🔑 API Endpointlar ro'yxati

### 1. Avtorizatsiya va profil (`/api/auth/`)
| Metod | Endpoint | Tavsif |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login/` | Tizimga kirish. `access`, `refresh` tokenlar hamda foydalanuvchi `role` va `scope` (`building_id`, `block_id`, `floor_id`) qaytaradi. |
| `POST` | `/api/auth/refresh/` | Refresh token orqali yangi Access token olish. |
| `POST` | `/api/auth/logout/` | Refresh tokenni qora ro'yxatga kiritish (blacklist). |
| `GET` | `/api/auth/me/` | Joriy foydalanuvchining to'liq profili, rolining va scope ma'lumotlarini olish. |
| `PATCH` | `/api/auth/me/` | Profil rasmi (`profile_photo`), `full_name`, `phone_number` yoki parolni o'zgartirish (`old_password` talab qilinadi). |

---

### 2. Foydalanuvchilarni boshqarish (`/api/accounts/`)
| Metod | Endpoint | Huquq va izolyatsiya |
| :--- | :--- | :--- |
| `GET` | `/api/accounts/users/` | Scope bo'yicha foydalanuvchilarni ko'rish (`SUPER_ADMIN` barchani, `BUILDING_HEAD` bino ichidagilarni, `BLOCK_HEAD` blok ichidagilarni ko'radi). |
| `POST` | `/api/accounts/block-heads/` | Faqat **SUPER_ADMIN** tomonidan Block Head yaratiladi. |
| `POST` | `/api/accounts/floor-heads/` | Faqat **BLOCK_HEAD** (yoki Superadmin) o'ziga tegishli blok uchun Floor Head yaratishi mumkin. |
| `POST` | `/api/accounts/observers/` | Faqat **BLOCK_HEAD** (yoki Superadmin) o'ziga tegishli blok uchun Kuzatuvchi (Observer) yaratadi. |
| `POST` | `/api/accounts/assistants/` | Faqat **FLOOR_HEAD** (yoki Block Head/Superadmin) o'z qavati uchun Yordamchi (Assistant) yaratadi. **Har bir qavatga faqat 1 ta yordamchi ruxsat etiladi.** |

---

## 🛡 Roles & Permission Classes (`accounts/permissions.py`)

- `IsSuperAdmin`: Faqat `SUPER_ADMIN` roliga ega foydalanuvchilar.
- `IsBuildingHead`: Bino sardorlari, scope (building) bo'yicha tekshiriladi.
- `IsBlockHead`: Blok sardorlari, faqat o'ziga tegishli `block.id` ichidagi obyektlar uchun ruxsat beradi.
- `IsFloorHeadOrAssistant`: Qavat sardorlari va yordamchilari, faqat o'ziga tegishli `floor.id` ichida ruxsat beradi.
- `IsOwnerOrSuperAdmin`: Profil o'zgarishlari yoki o'z shaxsiy ma'lumotlarini tahrirlash uchun ruxsat.

Barcha xatoliklar (ruxsatsiz urinishlar, limitdan oshishlar) **o'zbek tilida** tushunarli xabar shaklida qaytariladi.

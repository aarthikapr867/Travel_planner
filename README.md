# Backend (Django REST) for React Travel App

Django REST API backend for the React travel planning frontend (`myapp`).

## Setup

```bash
cd .vscode/backend/myproject
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api/`

## Authentication

All authenticated requests use header: `Authorization: Token <your-token>`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register/` | POST | No | Register user |
| `/api/auth/login/` | POST | No | Login and get token |
| `/api/auth/logout/` | POST | Yes | Logout (delete token) |
| `/api/profile/` | GET | Yes | User profile |

### Register body
```json
{
  "username": "aarthika",
  "email": "user@gmail.com",
  "password": "secret123",
  "dob": "2000-01-15",
  "mobile": "9876543210"
}
```

### Login body
```json
{
  "username": "aarthika",
  "password": "secret123"
}
```

## Destinations & Discovery

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/destinations/` | GET | No | List all destinations |
| `/api/destinations/?search=koda` | GET | No | Search destinations |
| `/api/destinations/?category=beach` | GET | No | Filter by category |
| `/api/destinations/featured/` | GET | No | Featured trips (Home page) |
| `/api/destinations/categories/` | GET | No | Discover page categories |
| `/api/destinations/{id}/` | GET | No | Destination detail |

## AI Planner & Trips

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/planner/generate/` | POST | Optional | Generate AI trip plan |
| `/api/trips/` | GET/POST | Yes | List/create trips |
| `/api/trips/recommendations/` | GET | No | Recommended trips |
| `/api/trips/{id}/summary/` | GET | Yes | Trip summary |
| `/api/trips/{id}/confirm/` | POST | Yes | Confirm trip |

### Planner body
```json
{
  "destination": "Kodaikanal",
  "days": 3,
  "budget": 12000,
  "travel_type": "family"
}
```

## Hotels

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/hotels/` | GET | No | List hotels |
| `/api/hotels/?destination_name=Kodaikanal` | GET | No | Filter by destination |
| `/api/hotels/{id}/book/` | POST | Yes | Book hotel |

## Budget

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/budget/calculate/` | POST | Yes | Calculate total budget |

### Budget body
```json
{
  "travel_cost": 3000,
  "hotel_cost": 5000,
  "food_cost": 2000,
  "activity_cost": 2000,
  "trip_id": 1
}
```

## Checklist

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/checklist/` | GET/POST | Yes | List/create checklist items |
| `/api/checklist/?trip=1` | GET | Yes | Items for a trip |
| `/api/checklist/{id}/` | PATCH | Yes | Toggle item checked |

## Weather

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/weather/Kodaikanal/` | GET | No | Weather for destination |

## Travel Journal

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/journals/` | GET/POST | Yes | List/create journal entries |
| `/api/journals/{id}/` | GET/PATCH/DELETE | Yes | Journal CRUD |

## Frontend Integration

Set your React API base URL to `http://127.0.0.1:8000/api` and use the endpoints above.
CORS is enabled for `http://localhost:5173` (Vite default).

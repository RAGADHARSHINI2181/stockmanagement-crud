# Stock Management System

A complete CRUD-based full-stack web application following the SOP.

## Technology
- React + Axios frontend
- Django + Django REST Framework backend
- SQLite database
- REST API
- Client-side and server-side validation
- Search/filter
- Git/GitHub ready

## API
- GET `/api/items/`
- POST `/api/items/`
- GET `/api/items/<id>/`
- PUT `/api/items/<id>/`
- PATCH `/api/items/<id>/`
- DELETE `/api/items/<id>/`

## Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend: http://127.0.0.1:8000/

## Frontend setup
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173/

Keep the Django backend running while using the React frontend.

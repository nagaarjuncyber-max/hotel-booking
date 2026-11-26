<<<<<<< HEAD
# Hotel Booking (Hotel List Page)

CRUD app: React + Redux frontend, Node.js + Express + PostgreSQL backend.

## Features
- Add / Edit hotel (single reusable form, validation, image upload with preview)
- Card list with search by title, price range filter, pagination
- Delete with success popup
- Detail page with map (Leaflet + Geolocation API)
- SEO: React Helmet dynamic meta tags, alt text on all images

## Tech
React (Vite), Redux Toolkit, React Router, Axios, React Helmet Async, Leaflet, SweetAlert2, Node.js, Express, Multer, express-validator, PostgreSQL (native SQL via `pg`)

## Setup

### 1. Database
```bash
createdb hotel_db
psql hotel_db -f server/schema.sql
```

### 2. Backend
```bash
cd server
npm install
```
Create `server/.env`:
```
PORT=5001
DATABASE_URL=postgresql://localhost:5432/hotel_db
```
```bash
npm run dev
```
Runs on http://localhost:5001

### 3. Frontend
```bash
npm install
npm run dev
```
Runs on http://localhost:5173

## API
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/hotels?search=&minPrice=&maxPrice=&limit=&offset= | List with filters and pagination |
| GET | /api/hotels/:id | Single hotel |
| POST | /api/hotels | Create (multipart/form-data) |
| PUT | /api/hotels/:id | Update (image optional) |
| DELETE | /api/hotels/:id | Delete record and image file |

Uploaded images are stored in `server/uploads`.
=======
# hotel-booking
>>>>>>> 7b4efdce51f9c28a65ac1e8494b0e86ec5b9b174

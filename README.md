# Numo App - Modern Full-Stack Numerology Platform

A premium full-stack numerology web app built for real client delivery and portfolio showcase.

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express (MVC architecture)
- **Database:** MongoDB with Mongoose (history persistence)

## Project Structure

```text
numo-app/
  client/   # React frontend
  server/   # Express API + numerology engine + Mongo integration
```

## Features

- Numerology input form: full name, date of birth, optional gender
- Calculates:
  - Life Path Number
  - Expression / Destiny Number
  - Soul Urge Number
  - Personality Number
- Master number handling (11, 22, 33)
- Card-based result UI with predefined interpretations
- Glassmorphism + gradient aesthetic
- Framer Motion animations and loading indicator
- Dark/light mode toggle with local persistence
- Share result via Web Share API or clipboard fallback
- Recent history endpoint and history panel
- Frontend + backend validation and error handling

## Numerology Logic

### Letter-to-number mapping

Alphabet mapping repeats 1-9:

- A=1, B=2, ..., I=9
- J=1, K=2, ..., R=9
- S=1, T=2, ..., Z=8

### Rules

1. Sum values based on source data:
   - **Life Path:** digits from date of birth (`YYYY-MM-DD`)
   - **Expression:** all letters of full name
   - **Soul Urge:** vowels only (`A,E,I,O,U`)
   - **Personality:** consonants only
2. Reduce to a single digit (1-9), **except** preserve master numbers `11`, `22`, `33`.

## API Documentation

Base URL:

`http://localhost:5000/api/v1`

### Health Check

- `GET /health`
- Response:

```json
{ "status": "ok" }
```

### Calculate Numerology

- `POST /numerology/calculate`
- Request body:

```json
{
  "fullName": "John Doe",
  "dateOfBirth": "1995-06-17",
  "gender": "male",
  "saveHistory": true
}
```

- Response includes numbers and interpretations.

### Get History

- `GET /numerology/history`
- Returns latest 10 saved results (empty array if DB unavailable).

## Setup Instructions

## 1) Clone and install dependencies

```bash
# Root folder
cd numo-app

# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

## 2) Environment variables

Create env files from templates:

- `client/.env` from `client/.env.example`
- `server/.env` from `server/.env.example`

Server env:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/numo
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Client env:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 3) Run development servers

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## 4) Production build

Frontend:

```bash
cd client
npm run build
```

Backend:

```bash
cd server
npm start
```

## Screenshots (Placeholders)

- `docs/screenshot-home.png`
- `docs/screenshot-results.png`
- `docs/screenshot-mobile.png`

## Notes

- If MongoDB is unavailable, the API still calculates numerology; history will gracefully degrade.
- The UI is fully responsive and optimized for modern mobile and desktop layouts.

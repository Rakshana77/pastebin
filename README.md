# Pastebin Lite

A simple Pastebin-like application built with **Node.js, Express, and MongoDB**.  
Users can create text pastes, get a shareable link, and view them later with optional expiry rules.

---

## Features
- Create and share text pastes
- Optional TTL (time-based expiry)
- Optional maximum view limit
- API and browser-based paste viewing
- Persistent storage using MongoDB

---

## Tech Stack
- Node.js, Express
- MongoDB (MongoDB Atlas)
- Mongoose
- HTML, CSS

---

## Run Locally

1. Install dependencies:
```bash
npm install


2.Create .env file:

MONGO_URL=mongodb://127.0.0.1:27017/pastebin
BASE_URL=http://localhost:3000
TEST_MODE=0

3.Start server:

npm start


Open: http://localhost:3000
##API Endpoints

-GET /api/healthz

-POST /api/pastes

-GET /api/pastes/:id

-GET /p/:id

## Persistence

MongoDB is used to persist pastes across requests and restarts.

## Notes

API fetches count as views

Browser views do not count as views

Expired or exceeded pastes return 404






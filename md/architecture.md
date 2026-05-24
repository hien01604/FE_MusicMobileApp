# architecture.md – Music Streaming App

---

## 1. Overview

Lightweight microservices architecture

Goals:
- Clear service boundaries
- Easy to implement (MVP)
- Scalable to production

---

## 2. High-Level Architecture

Client (Web/Mobile)  
→ API Gateway  
→ Services  

Services:
- User Service
- Content Service
- Library Service
- Player Service
- Recommendation Service
- Search Service (optional)

---

## 3. Services

---

### 3.1 User Service

Responsibility:
- Authentication (email + Google OAuth)
- JWT + refresh token lifecycle
- Password reset
- User profile
- Preferences (artist, genre, mood)

APIs:
- POST /auth/register
- POST /auth/login
- POST /auth/google
- POST /auth/refresh
- POST /auth/logout
- POST /auth/forgot-password
- POST /auth/reset-password

- GET /users/me
- PUT /users/me
- POST /users/preferences

DB:
- users
- refresh_tokens
- password_resets
- user_favorite_*

---

### 3.2 Content Service

Responsibility:
- Songs
- Artists
- New songs
- Artist follow

APIs:
- GET /songs
- GET /songs/:id
- GET /songs/new

- GET /artists
- GET /artists/:id

- POST /artists/:id/follow
- DELETE /artists/:id/follow

DB:
- songs
- artists
- genres
- user_follow_artists

---

### 3.3 Library Service

Responsibility:
- Liked songs
- Playlists

APIs:
- GET /users/liked
- POST /users/liked
- DELETE /users/liked/:song_id

- POST /playlists
- GET /playlists
- GET /playlists/:id
- POST /playlists/:id/songs
- DELETE /playlists/:id/songs/:song_id

DB:
- liked_songs
- playlists
- playlist_songs

---

### 3.4 Player Service

Responsibility:
- Track listening behavior
- Listening history

APIs:
- POST /player/play
- GET /users/history

DB:
- listening_history

---

### 3.5 Recommendation Service

Responsibility:
- Generate recommendations
- Serve recommendations

APIs:
- GET /recommendations

Input:
- Fetch preferences from User Service
- Fetch history from Player Service

DB:
- recommendations (cache)

---

### 3.6 Search Service (Optional)

Responsibility:
- Search songs and artists

APIs:
- GET /search?q=

Data:
- MVP: query main database (full-text search)
- Scale: use search engine (ElasticSearch)

---

## 4. API Gateway

Responsibility:
- Single entry point
- Route requests to services
- Validate JWT

---

## 5. Data Ownership

Rules:
- Each service owns its data
- No direct cross-service DB access
- Communication via API only

Mapping:
- User Service → users, tokens, preferences
- Content Service → songs, artists, follow
- Library Service → liked, playlists
- Player Service → history
- Recommendation Service → recommendations
- Search Service → search index

---

## 6. Communication

### Sync (MVP)
Client → API Gateway → Service

### Async (Scale)

Player Service → emit play_event  
Recommendation Service → consume event  
Search Service → sync content data  

---

## 7. Event Model

play_event:
{
  "user_id": "uuid",
  "song_id": "uuid",
  "listen_duration": 120,
  "timestamp": "ISO"
}

---

## 8. Deployment

- Each service = 1 container
- API Gateway in front

Database:
- MVP: shared database allowed
- Production: each service has its own database

---

## 9. Evolution Plan

Phase 1:
- User Service
- Content Service
- Library Service
- Player Service

Phase 2:
- Add Recommendation Service

Phase 3:
- Add Search Service (ElasticSearch)

---

## 10. Design Decisions

- Auth is part of User Service (no separate Auth Service)
- Song + Artist combined (Content Service)
- Recommendation uses cache (not real-time)
- Player Service is separated (critical data source)
- Search Service optional (added when scaling)

---

## 11. Final Services

- User Service
- Content Service
- Library Service
- Player Service
- Recommendation Service
- Search Service
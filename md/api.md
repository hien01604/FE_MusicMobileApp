# api.md – Music Streaming App

---

## 1. Base

Base URL:
- /api/v1

Auth:
- Bearer JWT

Header:
Authorization: Bearer <access_token>

---

## 2. Auth

### Register
POST /auth/register

### Login
POST /auth/login

### Google Login
POST /auth/google

### Refresh Token
POST /auth/refresh

### Logout
POST /auth/logout

### Forgot Password (request reset)
POST /auth/forgot-password

### Reset Password
POST /auth/reset-password

---

## 3. User

GET /users/me  
PUT /users/me  

### Preferences (Onboarding)
POST /users/preferences  

---

## 4. Songs

GET /songs  
GET /songs/:id  
GET /songs/new  

---

## 5. Artists

GET /artists  
GET /artists/:id  

POST /artists/:id/follow  
DELETE /artists/:id/follow  

---

## 6. Search

GET /search?q=

Response:
- songs[]
- artists[]

---

## 7. Player / History

POST /player/play  
GET /users/history  

---

## 8. Library – Liked Songs

GET /users/liked  
POST /users/liked  
DELETE /users/liked/:song_id  

---

## 9. Playlist

POST /playlists  
GET /playlists  
GET /playlists/:id  

POST /playlists/:id/songs  
DELETE /playlists/:id/songs/:song_id  

---

## 10. Recommendation

GET /recommendations  

---

## 11. Auth Flow (IMPORTANT)

### Login Flow
- POST /auth/login → return access_token + refresh_token

### Refresh Flow
- POST /auth/refresh → new access_token

### Logout Flow
- POST /auth/logout  
→ revoke refresh_token  

### Forgot Password Flow
1. POST /auth/forgot-password  
   → send reset token (email)

2. POST /auth/reset-password  
   → update password  

---

## 12. Notes

- All endpoints (except auth) require JWT  
- All list endpoints support:
  - page
  - limit  

- IDs: UUID  
- Timestamp: ISO 8601  

---

## 13. Naming Rules

- plural resources: /songs, /artists  
- user scope: /users/*  
- nested resources:
  - /playlists/:id/songs  

---

## 14. Consistency Mapping

Feature → API

- Like song → /users/liked  
- Playlist → /playlists  
- History → /player/play  
- Recommendation → /recommendations  
- Follow artist → /artists/:id/follow  
- Auth → /auth/*  

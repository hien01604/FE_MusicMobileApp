# mapping.md – Music Streaming App

---

## 1. Authentication

### Register / Login / Google

Product:
- User can signup/login (email or Google)

API:
- POST /auth/register
- POST /auth/login
- POST /auth/google

DB:
- users

---

### Refresh Token

Product:
- Maintain session when access_token expires

API:
- POST /auth/refresh

DB:
- refresh_tokens

---

### Logout

Product:
- User logs out → session invalidated

API:
- POST /auth/logout

DB:
- refresh_tokens (revoked = true)

---

### Forgot / Reset Password

Product:
- User resets password via email

API:
- POST /auth/forgot-password
- POST /auth/reset-password

DB:
- password_resets

---

## 2. User Profile

### Get / Update Profile

Product:
- View and edit profile

API:
- GET /users/me
- PUT /users/me

DB:
- users

---

### Update Preferences

Product:
- Update favorite artists, genres, moods

API:
- POST /users/preferences

DB:
- user_favorite_artists
- user_favorite_genres
- user_favorite_moods

---

## 3. Songs

### List Songs

Product:
- Browse songs

API:
- GET /songs

DB:
- songs

---

### Song Detail

Product:
- View song details

API:
- GET /songs/:id

DB:
- songs
- artists
- genres

---

### New Songs

Product:
- Discover new songs

API:
- GET /songs/new

DB:
- songs

---

## 4. Artists

### Artist Detail

Product:
- View artist info and songs

API:
- GET /artists/:id

DB:
- artists
- songs

---

### Follow / Unfollow Artist

Product:
- Follow or unfollow artist

API:
- POST /artists/:id/follow
- DELETE /artists/:id/follow

DB:
- user_follow_artists

---

## 5. Search

### Search Songs & Artists

Product:
- Search by keyword

API:
- GET /search?q=

DB:
- songs
- artists
(or Search index)

---

## 6. Player / History

### Play Song (Tracking)

Product:
- Track listening behavior

API:
- POST /player/play

DB:
- listening_history

---

### Recently Played

Product:
- Show recently played songs

API:
- GET /users/history

DB:
- listening_history

---

## 7. Library

### Liked Songs

Product:
- Save favorite songs

API:
- GET /users/liked
- POST /users/liked
- DELETE /users/liked/:song_id

DB:
- liked_songs

---

### Playlists

Product:
- Create and manage playlists

API:
- POST /playlists
- GET /playlists
- GET /playlists/:id

DB:
- playlists

---

### Playlist Songs

Product:
- Add/remove songs in playlist

API:
- POST /playlists/:id/songs
- DELETE /playlists/:id/songs/:song_id

DB:
- playlist_songs

---

## 8. Recommendation

### Get Recommendations

Product:
- Show personalized songs

API:
- GET /recommendations

DB:
- recommendations
- (input from listening_history + preferences)

---

## 9. Cross Mapping Summary

Feature → API → DB

- Auth → /auth/* → users, refresh_tokens, password_resets  
- Profile → /users/me → users  
- Preferences → /users/preferences → user_favorite_*  
- Songs → /songs → songs  
- Artists → /artists → artists  
- Follow → /artists/:id/follow → user_follow_artists  
- Search → /search → songs, artists  
- Player → /player/play → listening_history  
- History → /users/history → listening_history  
- Liked → /users/liked → liked_songs  
- Playlist → /playlists → playlists, playlist_songs  
- Recommendation → /recommendations → recommendations  

---

## 10. Guarantees

- Every feature has API + DB mapping
- No orphan feature
- Naming is consistent across layers
- Easy debugging and extension
- AI can generate correct logic without guessing
# business-logic.md – Music Streaming App

---

## 1. Authentication Logic

### Register / Login
- Email must be unique
- Password stored as bcrypt hash
- On success:
  - generate access_token (short-lived)
  - generate refresh_token (long-lived)

---

### Google Login
- Verify id_token with Google
- Extract:
  - email
  - provider_id
- If user exists:
  - login
- Else:
  - create new user
- Set:
  - provider = "google"
  - password_hash = NULL

---

### Refresh Token
- Validate refresh_token:
  - not expired
  - not revoked
- Issue new access_token

---

### Logout
- Mark refresh_token as revoked

---

### Forgot Password
- Generate reset token
- Set expired_at (e.g. +15 minutes)
- Send via email

---

### Reset Password
- Validate token:
  - not expired
  - not used
- Update password_hash
- Mark token as used

---

## 2. User Preferences Logic

### Onboarding
- Require:
  - ≥3 artists
  - ≥1 genre
  - ≥1 mood
- Save into:
  - user_favorite_*

---

### Update Preferences
- Replace existing preferences
- No duplicates allowed

---

## 3. Player Logic

### Play Event
On play:
- create listening_history record

---

### Listen Tracking
Track:
- play_start
- pause
- skip
- listen_duration

---

### Valid Listen Rule

valid_listen = true if:

- listen_duration ≥ 70% of song duration

Else:
- mark as skip

---

### Resume Logic
- If user reopens app:
  - resume last song at last position

---

### Auto Play
- When song ends:
  - fetch next recommended song

---

## 4. Library Logic

### Liked Songs
- One user can like a song only once
- Toggle behavior:
  - if exists → unlike
  - else → like

---

### Playlist

#### Create
- Name required

#### Add Song
- No duplicate song in same playlist
- Assign position (append to end)

#### Remove Song
- Delete record
- Reorder positions (optional)

---

## 5. Artist Logic

### Follow Artist
- One user can follow artist once
- Toggle:
  - follow → insert
  - unfollow → delete

---

## 6. Search Logic

### Input
- keyword (string)

### Behavior
- Case-insensitive
- Partial match

### Priority
1. Exact match
2. Prefix match
3. Fuzzy match

---

## 7. Recommendation Logic

### Inputs
- user preferences
- listening history

---

### Scoring Formula

score =
  0.4 * genre_match +
  0.3 * artist_match +
  0.3 * recency_score

---

### Definitions

genre_match:
- 1 if song genre in user_favorite_genres
- else 0

artist_match:
- 1 if artist followed or liked
- else 0

recency_score:
- based on recent listens (decay over time)

---

### Ranking
- Sort by score DESC
- Return top N (e.g. 20 songs)

---

### Fallback
If not enough data:
- return popular songs

---

## 8. History Logic

### Save History
- Save every play event

---

### Valid History
- Only count if:
  - listen_duration ≥ 30%

---

### Recently Played
- Order by played_at DESC
- Limit (e.g. 20 items)

---

## 9. Security Rules

- Password must be hashed (bcrypt)
- Tokens must expire
- Refresh token must be revocable
- Reset token must be single-use

---

## 10. Performance Rules

- Cache recommendations
- Limit history queries
- Use indexes for:
  - search
  - history
  - recommendation

---

## 11. Consistency Rules

- No duplicate relationships:
  - liked_songs
  - playlist_songs
  - follow_artists

- All IDs are UUID
- All timestamps are ISO format

---

## 12. Guarantees

- Deterministic recommendation output
- No duplicate data
- Predictable user behavior
- Scalable logic for future ML upgrade
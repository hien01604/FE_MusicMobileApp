# response-schema.md – Music Streaming App

---

## 1. Base Response

### Success
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "ISO"
  }
}

---

### Error
{
  "success": false,
  "message": "string",
  "error_code": "STRING_CODE"
}

---

## 2. Common Rules

- All responses must include:
  - success
  - data (null if empty)
- Lists always wrapped:
  - songs[]
  - artists[]
  - playlists[]
- No raw array at root
- IDs are UUID (string)
- Timestamp format: ISO 8601

---

## 3. Entities

---

### 3.1 User

{
  "id": "uuid",
  "email": "string",
  "username": "string",
  "avatar_url": "string"
}

---

### 3.2 Artist

{
  "id": "uuid",
  "name": "string",
  "avatar_url": "string"
}

---

### 3.3 Genre

{
  "id": "uuid",
  "name": "string"
}

---

### 3.4 Song

{
  "id": "uuid",
  "title": "string",
  "artist": {
    "id": "uuid",
    "name": "string"
  },
  "genre": {
    "id": "uuid",
    "name": "string"
  },
  "duration": 180,
  "thumbnail_url": "string",
  "audio_url": "string"
}

---

### 3.5 Playlist

{
  "id": "uuid",
  "name": "string",
  "songs_count": 10,
  "created_at": "ISO"
}

---

### 3.6 History Item

{
  "song": {},
  "played_at": "ISO",
  "listen_duration": 120
}

---

## 4. Auth

---

### Login / Register / Google

{
  "success": true,
  "data": {
    "access_token": "string",
    "refresh_token": "string",
    "user": {}
  }
}

---

### Refresh Token

{
  "success": true,
  "data": {
    "access_token": "string"
  }
}

---

### Logout

{
  "success": true,
  "data": null
}

---

### Forgot Password

{
  "success": true,
  "data": null
}

---

### Reset Password

{
  "success": true,
  "data": null
}

---

## 5. User

---

### Get Profile

{
  "success": true,
  "data": {
    "user": {}
  }
}

---

### Update Profile

{
  "success": true,
  "data": {
    "user": {}
  }
}

---

## 6. Songs

---

### Get Songs

{
  "success": true,
  "data": {
    "songs": [{}]
  },
  "meta": {
    "page": 1,
    "limit": 10
  }
}

---

### Song Detail

{
  "success": true,
  "data": {
    "song": {}
  }
}

---

### New Songs

{
  "success": true,
  "data": {
    "songs": [{}]
  }
}

---

## 7. Artists

---

### Artist Detail

{
  "success": true,
  "data": {
    "artist": {
      "id": "uuid",
      "name": "string",
      "avatar_url": "string",
      "top_songs": [{}]
    }
  }
}

---

### Follow / Unfollow

{
  "success": true,
  "data": null
}

---

## 8. Search

{
  "success": true,
  "data": {
    "songs": [{}],
    "artists": [{}]
  }
}

---

## 9. Player / History

---

### Track Play

{
  "success": true,
  "data": null
}

---

### Get History

{
  "success": true,
  "data": {
    "history": [{}]
  }
}

---

## 10. Library

---

### Liked Songs

{
  "success": true,
  "data": {
    "songs": [{}]
  }
}

---

### Playlist List

{
  "success": true,
  "data": {
    "playlists": [{}]
  }
}

---

### Playlist Detail

{
  "success": true,
  "data": {
    "playlist": {
      "id": "uuid",
      "name": "string",
      "songs": [{}]
    }
  }
}

---

## 11. Recommendation

{
  "success": true,
  "data": {
    "songs": [{}]
  }
}

---

## 12. Error Codes (Standard)

- UNAUTHORIZED
- INVALID_TOKEN
- TOKEN_EXPIRED
- NOT_FOUND
- VALIDATION_ERROR
- INTERNAL_ERROR

---

## 13. Guarantees

- Consistent response shape across all APIs
- No missing fields
- No ambiguous nesting
- Frontend predictable 100%
- AI can generate code without guessing
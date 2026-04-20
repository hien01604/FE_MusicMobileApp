# database_v4.md – Music Streaming App

---

## 1. Overview

Supports:
- Auth (JWT + Refresh Token + Google OAuth)
- Onboarding (preferences)
- Player + History
- Library (liked, playlists)
- Recommendation

Design:
- Strong constraints
- Consistent indexing
- Production-ready

---

## 2. Enums (PostgreSQL)

CREATE TYPE user_status AS ENUM ('active', 'blocked', 'deleted');

---

## 3. Core Tables

### 3.1 Users

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,

  password_hash VARCHAR(255),
  username VARCHAR(100),
  avatar_url TEXT,

  provider VARCHAR(50) DEFAULT 'local',   -- local | google
  provider_id VARCHAR(255),

  status user_status DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(provider, provider_id),

  CHECK (
    (provider = 'local' AND password_hash IS NOT NULL)
    OR
    (provider != 'local')
  )
);

---

### 3.2 Artists

CREATE TABLE artists (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

### 3.3 Genres

CREATE TABLE genres (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

---

### 3.4 Moods

CREATE TABLE moods (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

---

### 3.5 Songs

CREATE TABLE songs (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id),
  genre_id UUID REFERENCES genres(id),

  duration INT NOT NULL,
  audio_url TEXT NOT NULL,
  thumbnail_url TEXT,
  release_date DATE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

## 4. Auth & Security

### 4.1 Refresh Tokens

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  token TEXT UNIQUE NOT NULL,
  expired_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

### 4.2 Password Resets

CREATE TABLE password_resets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  token TEXT UNIQUE NOT NULL,
  expired_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

## 5. User Preferences

CREATE TABLE user_favorite_artists (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, artist_id)
);

CREATE TABLE user_favorite_genres (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, genre_id)
);

CREATE TABLE user_favorite_moods (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood_id UUID REFERENCES moods(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, mood_id)
);

---

## 6. Library

### 6.1 Liked Songs

CREATE TABLE liked_songs (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, song_id)
);

---

### 6.2 Playlists

CREATE TABLE playlists (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---

### 6.3 Playlist Songs

CREATE TABLE playlist_songs (
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,

  position INT,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (playlist_id, song_id),
  UNIQUE (playlist_id, position)
);

---

### 6.4 Listening History

CREATE TABLE listening_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id),

  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  listen_duration INT
);

---

## 7. Artist Interaction

CREATE TABLE user_follow_artists (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, artist_id)
);

---

## 8. Recommendation

CREATE TABLE recommendations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id),

  score FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (user_id, song_id)
);

---

## 9. Indexes

-- Search
CREATE INDEX idx_song_title ON songs(title);
CREATE INDEX idx_artist_name ON artists(name);

-- History
CREATE INDEX idx_history_user_time 
ON listening_history(user_id, played_at DESC);

CREATE INDEX idx_history_song 
ON listening_history(song_id);

-- Playlist
CREATE INDEX idx_playlist_user ON playlists(user_id);

-- Recommendation
CREATE INDEX idx_reco_user ON recommendations(user_id);

-- Tokens
CREATE INDEX idx_refresh_user ON refresh_tokens(user_id);

-- OAuth
CREATE INDEX idx_user_provider 
ON users(provider, provider_id);

---

## 10. Notes

- All IDs are UUID
- Timestamps use ISO 8601
- Foreign keys use ON DELETE CASCADE where needed
- Unique constraints prevent duplicate relationships
- Indexes optimize search, history, and recommendation

---

## 11. Guarantees

- No duplicate liked songs
- No duplicate playlist order
- No duplicate recommendations per user
- Secure token handling
- Consistent auth logic (local vs OAuth)

# product.md – Music Streaming App

---

## 1. Overview

### Vision
Personalized music app:
- Fast search
- Smart discovery
- Smooth listening

### Target Users
- Frequent listeners
- Users who explore new music

### Core Value
- Fast discovery
- Smart recommendation
- Smooth playback

---

## 2. Goals

### Primary
Personalize based on:
- Artist
- Genre
- Mood
- Listening behavior

### User Goals
- Find songs quickly
- Listen by mood
- Discover new music

---

## 3. User Flows

---

### 3.1 Authentication

Flow:
Open App  
→ Login / Signup (email or Google)  
→ Receive access_token + refresh_token  
→ Access app  

#### Logout Flow
User → Logout  
→ revoke refresh_token  

#### Forgot Password Flow
User → Forgot Password  
→ Receive reset token (email)  
→ Reset Password  

---

### 3.2 Onboarding

Flow:
Open App  
→ Welcome  
→ Select Artists (≥3)  
→ Select Genres (≥1)  
→ Select Mood (≥1)  
→ Signup (local/google)  
→ Home  

---

### 3.3 Home

Sections:
- Recommended
- New Songs
- Popular Artists
- Recently Played

Actions:
- Play song
- View artist
- See all

---

### 3.4 Search

Input:
- keyword

Output:
- songs[]
- artists[]

Actions:
- Play song
- View artist

---

### 3.5 Player

Flow:
Select Song  
→ Load  
→ Now Playing  
→ Auto play  

Controls:
- Play / Pause
- Next / Previous
- Seek bar

More Options:
- Add to Playlist
- Add to Liked Songs
- View Artist

Mini Player:
- Always visible
- Tap → open full player

Tracking:
- play_start
- pause
- skip
- listen_duration

Rule:
- ≥70% = valid listen

Behavior:
- End → next (recommendation)
- Reopen → resume playback

---

### 3.6 Library

Purpose:
- User personal content

Sections:
- Liked Songs
- My Playlists
- Recently Played

Structure:
Library
- Liked Songs
- My Playlists
- Recently Played

Rules:
- Each section has "See all"
- Support quick play
- Recently Played = horizontal

---

### 3.7 Profile

Purpose:
- Account management

Data:
- Avatar
- Username
- Email

Actions:
- Edit profile
- Change password
- Update preferences (artist, genre, mood)
- Logout

---

### 3.8 Artist

Entry:
- Home
- Search
- Player

Detail:
- Artist info
- Top Songs (default)
- All Songs

Actions:
- Follow / Unfollow
- Play song

Flow:
Select Artist  
→ Open Detail  
→ Play song  

---

### 3.9 New Songs

Entry:
- Home → See all

List item:
- title
- artist
- thumbnail

Actions:
- Play
- More:
  - Play Next
  - Add to Playlist
  - Add to Liked Songs

---

## 4. Functional Requirements

Auth:
- Register / Login (email, Google)
- JWT authentication
- Refresh token
- Logout
- Forgot / Reset password

Search:
- Full-text search
- Response < 300ms

Recommendation:
- Content-based
- Prioritize recent behavior
- Fallback: popular songs

History:
- Track listen_duration
- ≥30% = valid listen

Player:
- Start < 1s
- Resume playback

---

## 5. Non-Functional Requirements

- API response < 300ms
- App load < 2s
- Scale: 10k → 1M users
- Security: bcrypt, JWT, HTTPS

---

## 6. Constraints

Technical:
- Cold start problem
- Recommendation not fully real-time

UX:
- Onboarding < 1 minute
- Simple UI

Business:
- No music license (use mock/public API)
- No social features
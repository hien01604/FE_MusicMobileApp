# Profile Screen - Component Architecture & Visual Guide

## 🏗️ Component Hierarchy

```
ProfileScreen (Main Screen)
│
├── SafeAreaView
│   └── ScrollView
│       ├── ProfileHeader
│       │   ├── Avatar (Circular Image)
│       │   ├── Username (Text)
│       │   ├── Email (Text)
│       │   └── EditButton (TouchableOpacity)
│       │
│       ├── Section: My Playlists
│       │   ├── SectionHeader
│       │   │   ├── Title (Text)
│       │   │   └── SeeAll (TouchableOpacity)
│       │   └── FlatList / View
│       │       └── PlaylistCard[] (Multiple)
│       │           ├── Thumbnail (Image)
│       │           ├── Info Container
│       │           │   ├── Name (Text)
│       │           │   └── SongCount (Text)
│       │           └── Arrow Icon (Ionicons)
│       │
│       ├── Section: Liked Songs
│       │   ├── SectionHeader
│       │   └── SongCard[] (Multiple)
│       │       ├── AlbumImage (Image)
│       │       ├── Info Container
│       │       │   ├── Title (Text)
│       │       │   └── Artist (Text)
│       │       └── MenuIcon (Ionicons)
│       │
│       ├── Section: Recently Played
│       │   ├── SectionHeader
│       │   └── SongCard[] (Multiple)
│       │
│       ├── Section: Followed Artists
│       │   ├── SectionHeader
│       │   └── HorizontalScrollView
│       │       └── ArtistCircleItem[] (Multiple)
│       │           ├── Avatar (Circular Image)
│       │           └── Name (Text)
│       │
│       ├── Section: Preferences
│       │   ├── SectionHeader
│       │   └── PreferencesListItem[] (3x)
│       │       ├── Title (Text)
│       │       └── ChevronIcon (Ionicons)
│       │
│       └── LogoutSection
│           └── LogoutButton
│               ├── Text / ActivityIndicator
```

---

## 📊 Component Dependency Graph

```
                         ProfileScreen
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ProfileHeader      SectionHeader          PlaylistCard
   • useAuth()          (reusable)           • Dimensions
   • useState                                • ImageSize
   • onEdit()                                • Spacing

        │                                        │
        │                                        │
   ┌────┴────────────────────────────────────────┴────┐
   │                                                   │
   ▼                          ▼                        ▼
SongCard            ArtistCircleItem         PreferencesListItem
• useState          • borderColor            • ChevronIcon
• onMenuPress()     • circularLayout         • navigation


        │                     │                     │
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                        LogoutButton
                        • loading
                        • onPress()
                        • ActivityIndicator
```

---

## 🎨 Component Data Flow

### Props Flow Diagram

```
ProfileScreen (State)
│
├─ user, playlists, likedSongs, ...
│
├──→ ProfileHeader
│    ├─ username
│    ├─ email
│    ├─ avatar
│    └─ onEditPress
│
├──→ SectionHeader
│    ├─ title: "My Playlists"
│    └─ onSeeAllPress
│
├──→ PlaylistCard (Array)
│    ├─ name
│    ├─ songCount
│    ├─ thumbnail
│    └─ onPress
│
├──→ SongCard (Array)
│    ├─ title
│    ├─ artist
│    ├─ albumImage
│    ├─ onPress
│    └─ onMenuPress
│
├──→ ArtistCircleItem (Array)
│    ├─ name
│    ├─ avatar
│    └─ onPress
│
├──→ PreferencesListItem (Array)
│    ├─ title
│    └─ onPress
│
└──→ LogoutButton
     ├─ onPress
     └─ loading
```

---

## 🎯 State Management Flow

```
┌─────────────────────────────────────────────────────┐
│          ProfileScreen Component State              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  const [user, setUser] ────────┐                   │
│  const [playlists, setPlaylists] │                 │
│  const [likedSongs, setLikedSongs] │               │
│  const [recentlyPlayed, ...] ──┼──→ API Calls     │
│  const [followedArtists, ...] ─┘                   │
│  const [loading, setLoading]                       │
│                                                     │
└─────────────────────────────────────────────────────┘
         │           │           │           │
         ▼           ▼           ▼           ▼
    Children Render   Handlers   Effects   Callbacks
    Components       Functions  Execute   Execute
```

---

## 🔄 User Interaction Flow

```
USER INTERACTIONS:

1. TAP AVATAR / EDIT PROFILE
   └─→ onEditPress() → Navigate to EditProfileScreen

2. TAP PLAYLIST CARD
   └─→ onPress() → Navigate to PlaylistDetailScreen

3. TAP "SEE ALL" PLAYLISTS
   └─→ onSeeAllPress() → Navigate to AllPlaylistsScreen

4. TAP SONG
   └─→ onPress() → Play Song / Navigate to NowPlaying

5. TAP 3-DOT MENU (on Song)
   └─→ onMenuPress() → Show ActionSheet with options:
       • Add to Queue
       • Add to Playlist
       • Unlike
       • Share
       • Go to Artist

6. TAP ARTIST CIRCLE
   └─→ onPress() → Navigate to ArtistProfileScreen

7. TAP PREFERENCE ITEM
   └─→ onPress() → Navigate to Setting Screen:
       • Favorite Artists Screen
       • Favorite Genres Screen
       • Favorite Moods Screen

8. TAP LOGOUT
   └─→ onPress() → Show Confirmation → logout() → Navigate to LoginScreen
```

---

## 💾 Data Fetching Strategy

### Initial Load (useEffect)
```typescript
useEffect(() => {
  const loadProfileData = async () => {
    setLoading(true);
    try {
      // Parallel fetch for better performance
      const [userRes, playlistsRes, songsRes, artistsRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/playlists?limit=3'),
        api.get('/user/liked-songs?limit=3'),
        api.get('/user/followed-artists'),
      ]);
      
      setUser(userRes.data);
      setPlaylists(playlistsRes.data);
      setLikedSongs(songsRes.data);
      setFollowedArtists(artistsRes.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  loadProfileData();
}, []);
```

### Pull-to-Refresh (Optional)
```typescript
const onRefresh = async () => {
  setRefreshing(true);
  try {
    // Reload all data
    await loadProfileData();
  } finally {
    setRefreshing(false);
  }
};
```

---

## 🎭 Component Size Reference

### ProfileHeader
```
┌──────────────────────┐
│   [Avatar Circle]    │  Height: ~200px
│   Username (24px)    │  Width: 100% (16px padding)
│   email@... (14px)   │
│  [Edit Profile Btn]  │
└──────────────────────┘
```

### PlaylistCard
```
┌─────────────────────────────┐
│ [64x64]  Name          [→]  │  Height: ~88px
│ Thumb    12 songs           │  Width: 100%
└─────────────────────────────┘
```

### SongCard
```
┌──────────────────────────────┐
│ [56x56]  Title         [⋮]   │  Height: ~80px
│ Album    Artist              │  Width: 100%
└──────────────────────────────┘
```

### ArtistCircleItem
```
   [80x80 Circle Avatar]
        Artist Name          Width: 100px (Horizontal Scroll)
        (12px font)          Padding: 16px between items
```

### PreferencesListItem
```
┌──────────────────────────────┐
│ Title Text             [→]   │  Height: ~56px
└──────────────────────────────┘
```

### LogoutButton
```
┌──────────────────────────────┐
│        LOGOUT BUTTON         │  Height: 48px
│      (Full Width)            │  Width: 100%
└──────────────────────────────┘
```

---

## 📐 Spacing Grid (4px based)

```
Baseline Unit: 4px

Margins:
- 4px   = 1 unit
- 8px   = 2 units
- 12px  = 3 units  ← Component internal padding
- 16px  = 4 units  ← Screen padding
- 20px  = 5 units
- 24px  = 6 units  ← Section top margin
- 28px  = 7 units  ← Large section gap
- 32px  = 8 units
- 40px  = 10 units ← Bottom spacing

Corners:
- 8px   ← Image thumbnails
- 12px  ← Cards
- 20px  ← Buttons
- 40px  ← Circular items (80÷2)
- 60px  ← Avatar header (120÷2)
```

---

## 🌈 Color Application

### Primary Colors Used
```
Background:     #0a0e27 (Deep Navy - Safe Area)
Card BG:        #1a1f3a (Lighter Navy)
Accent:         #FF006B (Pink/Red)
Secondary:      #FF4081 (Light Pink)
Text Primary:   #ffffff (White)
Text Secondary: #888888 (Gray)
```

### Component Color Mapping
```
ProfileHeader
├── Avatar Border:     Accent Pink (#FF006B)
├── Username:          Text Primary (#fff)
├── Email:             Text Secondary (#888)
├── Edit Button Border: Accent Pink (#FF006B)
└── Edit Button Text:  Accent Pink (#FF006B)

PlaylistCard
├── Background:        Card BG (#1a1f3a)
├── Text:              Text Primary (#fff)
├── SubText:           Text Secondary (#888)
└── Arrow:             Accent Pink (#FF006B)

SongCard
├── Background:        Card BG (#1a1f3a)
├── Title:             Text Primary (#fff)
├── Artist:            Text Secondary (#888)
└── Menu Icon:         Text Secondary (#888)

ArtistCircleItem
├── Avatar Border:     Accent Pink (#FF006B)
├── Name:              Text Primary (#fff)
└── Box Shadow:        Accent Pink (30% opacity)

PreferencesListItem
├── Background:        Card BG (#1a1f3a)
├── Title:             Text Primary (#fff)
└── Chevron:           Accent Pink (#FF006B)

LogoutButton
├── Background:        Accent Pink (#FF006B)
├── Text:              Text Primary (#fff)
└── Shadow:            Accent Pink (30% opacity)
```

---

## 🔧 Reusable Component Checklist

- [x] **ProfileHeader**: Avatar, Username, Email, Edit Button
- [x] **SectionHeader**: Title + See All (optional)
- [x] **PlaylistCard**: Thumbnail, Name, Song Count, Arrow
- [x] **SongCard**: Album Art, Title, Artist, Menu (optional)
- [x] **ArtistCircleItem**: Avatar, Name (horizontal scroll friendly)
- [x] **PreferencesListItem**: Title, Arrow Icon
- [x] **LogoutButton**: Red button with loading state

---

## 📱 Responsive Breakpoints

```
iPhone SE (375px)
├── Avatar: 100px (responsive)
├── Card padding: 12px
├── Thumbnail: 56-64px
└── Full width with 16px margin

iPhone 12/13 (390px)
├── Avatar: 120px
├── Card padding: 12-14px
├── Thumbnail: 64px
└── Full width with 16px margin

iPhone 13 Pro (430px)
├── Avatar: 120px
├── Card padding: 14-16px
├── Thumbnail: 80px (larger screens)
└── Full width with 16px margin
```

---

## ⚡ Performance Tips

1. **Use React.memo()** for list items to prevent unnecessary re-renders
2. **FlatList/SectionList** for large dynamic lists (not ScrollView)
3. **Image caching** with FastImage library
4. **Lazy load** images that aren't visible
5. **Debounce** user interactions (search, scroll events)
6. **Split large components** into smaller, memoized parts

---

## 🧩 Component Export Example

```typescript
// In a barrel export file (components/Profile/index.ts)
export { default as ProfileHeader } from './ProfileHeader';
export { default as SectionHeader } from './SectionHeader';
export { default as PlaylistCard } from './PlaylistCard';
export { default as SongCard } from './SongCard';
export { default as ArtistCircleItem } from './ArtistCircleItem';
export { default as PreferencesListItem } from './PreferencesListItem';
export { default as LogoutButton } from './LogoutButton';

// Usage
import {
  ProfileHeader,
  SectionHeader,
  PlaylistCard,
} from '../../components/Profile';
```

---

**Last Updated**: May 2, 2026  
**Version**: 1.0  
**Complexity Level**: Beginner to Intermediate

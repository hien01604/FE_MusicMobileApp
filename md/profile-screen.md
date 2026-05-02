# Profile Screen - Documentation

## Overview
A modern, user-friendly profile screen for a music streaming app with visible actions, no hidden menus, and a clean, Spotify-like dark theme.

---

## 📁 File Structure

```
src/
├── screens/
│   └── Profile/
│       └── ProfileScreen.tsx          # Main screen component
├── components/
│   └── Profile/
│       ├── ProfileHeader.tsx          # User avatar, username, email, edit button
│       ├── SectionHeader.tsx          # Section title with "See All" action
│       ├── PlaylistCard.tsx           # Vertical playlist card with thumbnail
│       ├── SongCard.tsx               # Horizontal song card with album art
│       ├── ArtistCircleItem.tsx       # Circular artist item for horizontal scroll
│       ├── PreferencesListItem.tsx    # Settings list item with arrow
│       └── LogoutButton.tsx           # Red danger logout button
└── style/
    └── profileStyles.ts               # Centralized color palette and styles
```

---

## 🎨 Design System

### Color Palette
- **Background**: `#0a0e27` (Deep navy primary), `#1a1f3a` (Secondary), `#252d47` (Tertiary)
- **Accent**: `#FF006B` (Pink/Red primary), `#FF4081` (Light pink)
- **Text**: `#ffffff` (Primary), `#888888` (Secondary), `#666666` (Tertiary)

### Typography
- **Headings**: 18-24px, Weight 700
- **Body**: 14-16px, Weight 600
- **Captions**: 12px, Weight 400-600

### Spacing
- **Section gaps**: 28px (vertical), 12px (horizontal)
- **Component padding**: 12-16px
- **Border radius**: 8-20px

### Shadows
- Cards: `shadowOpacity: 0.1, shadowRadius: 4`
- Logout button: `shadowOpacity: 0.3, shadowRadius: 8`

---

## 📱 Component Details

### 1. **ProfileHeader**
Displays user profile information at the top.

**Props:**
```typescript
interface ProfileHeaderProps {
  username: string;
  email: string;
  avatar?: string | ImageSourcePropType;
  onEditPress: () => void;
}
```

**Features:**
- Circular avatar (120x120px) with pink border
- Username in bold white text
- Email in gray text
- Outlined "Edit Profile" button with pink accent

---

### 2. **SectionHeader**
Reusable header for all content sections.

**Props:**
```typescript
interface SectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void;
  hideViewAll?: boolean;
}
```

**Features:**
- Section title (bold, white)
- Optional "See All" link in pink
- Can hide "See All" for preferences section

---

### 3. **PlaylistCard**
Vertical card for playlist items.

**Props:**
```typescript
interface PlaylistCardProps {
  name: string;
  songCount: number;
  thumbnail: string;
  onPress: () => void;
}
```

**Features:**
- Square thumbnail (64x64px)
- Playlist name and song count
- Pink chevron icon
- Card background: `#1a1f3a`

---

### 4. **SongCard**
Horizontal card for songs in "Liked Songs" and "Recently Played".

**Props:**
```typescript
interface SongCardProps {
  title: string;
  artist: string;
  albumImage: string;
  onPress: () => void;
  onMenuPress?: () => void;
}
```

**Features:**
- Album image (56x56px, left side)
- Song title and artist name
- Optional 3-dot menu icon inside card (not hidden)
- Full width with flex layout

---

### 5. **ArtistCircleItem**
Circular item for followed artists in horizontal scroll.

**Props:**
```typescript
interface ArtistCircleItemProps {
  name: string;
  avatar: string;
  onPress: () => void;
}
```

**Features:**
- Circular avatar (80x80px) with pink border
- Artist name below (centered)
- Fixed width (100px) for consistent scrolling

---

### 6. **PreferencesListItem**
List item for preference navigation.

**Props:**
```typescript
interface PreferencesListItemProps {
  title: string;
  onPress: () => void;
}
```

**Features:**
- Full-width card style
- Title on left, chevron on right
- Card background: `#1a1f3a`

---

### 7. **LogoutButton**
Prominent logout button at bottom of screen.

**Props:**
```typescript
interface LogoutButtonProps {
  onPress: () => void;
  loading?: boolean;
}
```

**Features:**
- Full-width button
- Red background (`#FF006B`)
- Shadow effect with red glow
- Loading state support
- Clear separation from other sections

---

## 🎯 Screen Sections

### Section 1: Profile Header
```
[Avatar Circle]
  Username
  email@example.com
 [Edit Profile]
```

### Section 2: My Playlists
```
My Playlists                    [See All]
[Thumb] Summer Vibes 24 songs     ➜
[Thumb] Workout Mix 18 songs      ➜
[Thumb] Chill Evening 32 songs    ➜
```

### Section 3: Liked Songs
```
Liked Songs                     [See All]
[Art] Blinding Lights        ⋮
      The Weeknd
[Art] As It Was               ⋮
      Harry Styles
[Art] Anti-Hero               ⋮
      Taylor Swift
```

### Section 4: Recently Played
```
Recently Played               [See All]
[Art] Levitating            ⋮
      Dua Lipa
[Art] Good 4 U              ⋮
      Olivia Rodrigo
```

### Section 5: Followed Artists
```
Followed Artists            [See All]
[Avatar] [Avatar] [Avatar] [Avatar]
 The     Taylor   Dua     The
Weeknd   Swift    Lipa    Weeknd
```

### Section 6: Preferences
```
Preferences
[Favorite Artists                        ➜]
[Favorite Genres                         ➜]
[Favorite Moods                          ➜]
```

### Section 7: Logout
```
[           LOGOUT              ]
```

---

## 🔄 Layout Behavior

### ScrollView
- Vertical scroll for all sections
- `showsVerticalScrollIndicator={false}`
- Padding: 16px horizontal, 40px bottom

### Horizontal Scrolls
- **Followed Artists**: `horizontal={true}`, no indicator
- Gap: 16px between items
- Right padding for last item

### Responsive Design
- Uses flex layout
- Adapts to different screen sizes
- Safe area for notch/status bar

---

## 🎭 Interaction Patterns

### No Hidden Menus
✅ **Visible Actions**: All important actions are visible
- Edit Profile button is always visible
- See All links are prominent
- Menu icons are inside cards only (songs section)
- Logout is clearly visible at bottom

### Button States
- Default: Active with opacity 0.7
- Pressed: Opacity reduces to show feedback
- Disabled (logout loading): Opacity 0.6

### Navigation
```
ProfileScreen
├── Edit Profile → Edit Profile Screen
├── See All (Playlists) → Playlists Screen
├── See All (Liked Songs) → Liked Songs Screen
├── See All (Recently Played) → Recently Played Screen
├── See All (Artists) → Followed Artists Screen
├── Preference Items → Respective Settings Screens
└── Logout → Logout confirmation → Auth Screen
```

---

## 🚀 Usage

### Basic Integration
```typescript
import ProfileScreen from '../screens/Profile/ProfileScreen';

// In your navigation stack
<Stack.Screen name="Profile" component={ProfileScreen} />
```

### Customization
Modify color palette in `src/style/profileStyles.ts`:
```typescript
export const colors = {
  accent: {
    primary: '#FF006B', // Change accent color here
  },
  // ... other colors
};
```

### Data Binding
Replace mock data in `ProfileScreen.tsx` with API calls:
```typescript
// Example: Fetch user playlists
useEffect(() => {
  const fetchPlaylists = async () => {
    const response = await playlistService.getUserPlaylists();
    setPlaylists(response.data);
  };
  fetchPlaylists();
}, []);
```

---

## ⚡ Performance Tips

1. **Image Optimization**: Use optimized image URLs or local cached images
2. **Lazy Loading**: Consider virtualizing long lists
3. **Memoization**: Wrap components with `React.memo()` if re-renders occur
4. **Key Props**: Always provide unique `key` props in lists

---

## 📋 Accessibility

- ✅ Touch targets ≥ 44x44pts
- ✅ Sufficient color contrast
- ✅ Semantic TouchableOpacity wrappers
- ✅ Descriptive onPress handlers
- ✅ Clear visual feedback

---

## 🔧 Future Enhancements

- [ ] Pull-to-refresh functionality
- [ ] Swipe gestures for actions
- [ ] Animated transitions between sections
- [ ] Share profile functionality
- [ ] Dark/Light theme toggle
- [ ] Offline support with local cache
- [ ] Analytics tracking

---

## 📝 Notes

- **Dark Theme**: Designed for OLED screens (true black backgrounds)
- **Typography**: Uses system font for native feel
- **Spacing**: Follows 4px grid system
- **No Settings Menu**: All preferences use navigation, not hidden menus
- **Responsive**: Works on various phone sizes

---

**Last Updated**: May 2, 2026  
**Version**: 1.0  
**Author**: Design Team

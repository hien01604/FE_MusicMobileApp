# Profile Screen - Implementation Guide & Best Practices

## 🎯 Quick Start

### 1. Install Dependencies (if needed)
```bash
npm install expo-icons
# or
yarn add expo-icons
```

### 2. Import ProfileScreen in Navigation
```typescript
// navigation/AppNavigator.tsx
import ProfileScreen from '../screens/Profile/ProfileScreen';

export const AppNavigator = () => {
  return (
    <Tab.Navigator>
      {/* ... other screens ... */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
```

### 3. Ensure AuthContext is Configured
```typescript
// The ProfileScreen uses useAuth() hook
// Make sure your AuthContext.tsx provides:
// - user object
// - logout() function

interface User {
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContext {
  user: User | null;
  logout: () => Promise<void>;
}
```

---

## 📐 Layout Visualization

### iPhone 13 Pro Frame
```
┌─────────────────────────────────────┐
│ SafeAreaView (Dark Navy Background) │
│                                     │
│              [PROFILE HEADER]       │
│          ┌─────────────────┐       │
│          │    ●●●●●●●●●    │       │
│          │    ● AVATAR ●   │       │
│          │    ●●●●●●●●●    │       │
│          └─────────────────┘       │
│           Username Bold            │
│           email@example.com        │
│         [Edit Profile Button]      │
│                                     │
│              [MY PLAYLISTS]         │
│          ┌──────────────────────┐  │
│          │ █ Summer Vibes      → │  │
│          │   24 songs           │  │
│          └──────────────────────┘  │
│          ┌──────────────────────┐  │
│          │ █ Workout Mix       → │  │
│          │   18 songs           │  │
│          └──────────────────────┘  │
│          ┌──────────────────────┐  │
│          │ █ Chill Evening     → │  │
│          │   32 songs           │  │
│          └──────────────────────┘  │
│                                     │
│              [LIKED SONGS]          │
│          ┌──────────────────────┐  │
│          │ █ Blinding Lights   ⋮ │  │
│          │   The Weeknd         │  │
│          └──────────────────────┘  │
│          ┌──────────────────────┐  │
│          │ █ As It Was         ⋮ │  │
│          │   Harry Styles       │  │
│          └──────────────────────┘  │
│                                     │
│         [RECENTLY PLAYED]           │
│          ┌──────────────────────┐  │
│          │ █ Levitating        ⋮ │  │
│          │   Dua Lipa           │  │
│          └──────────────────────┘  │
│                                     │
│        [FOLLOWED ARTISTS]           │
│     ● The    ● Taylor  ● Dua      │
│    Weeknd    Swift     Lipa       │
│                                     │
│            [PREFERENCES]            │
│     [Favorite Artists            →] │
│     [Favorite Genres             →] │
│     [Favorite Moods              →] │
│                                     │
│         [    RED LOGOUT    ]        │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔗 API Integration Examples

### Fetch User Data
```typescript
// In ProfileScreen.tsx useEffect
useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      const userData = response.data;
      // Update UI with user data
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };
  
  fetchUserProfile();
}, []);
```

### Fetch User Playlists
```typescript
const fetchPlaylists = async () => {
  try {
    const response = await playlistService.getUserPlaylists();
    setPlaylists(response.data.playlists);
  } catch (error) {
    console.error('Failed to fetch playlists:', error);
  }
};
```

### Fetch Liked Songs
```typescript
const fetchLikedSongs = async () => {
  try {
    const response = await songService.getLikedSongs({ limit: 3 });
    setLikedSongs(response.data.songs);
  } catch (error) {
    console.error('Failed to fetch liked songs:', error);
  }
};
```

### Handle Logout
```typescript
const handleLogout = () => {
  Alert.alert('Logout', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Logout',
      onPress: async () => {
        try {
          await logout();
          // Navigation handled by auth context change
        } catch (error) {
          Alert.alert('Error', 'Logout failed');
        }
      },
      style: 'destructive',
    },
  ]);
};
```

---

## 🎨 Theming & Customization

### Change Accent Color
```typescript
// In profileStyles.ts
export const colors = {
  accent: {
    primary: '#FF006B',    // Change this
    secondary: '#FF4081',  // And this
  },
};
```

### Custom Dark Backgrounds
```typescript
// For OLED optimization
background: {
  primary: '#000000',  // True black for OLED
  secondary: '#1a1a1a',
  tertiary: '#252525',
}
```

### Font Customization
```typescript
// If using custom fonts
username: {
  fontFamily: 'CustomFont',
  fontSize: 24,
  fontWeight: '700',
},
```

---

## 🧪 Testing Scenarios

### Test Cases

#### 1. Profile Header Display
- [ ] Avatar displays correctly
- [ ] Username shows properly
- [ ] Email is visible
- [ ] Edit button is clickable

#### 2. Playlist Cards
- [ ] All playlists load
- [ ] Thumbnail images display
- [ ] Song count is accurate
- [ ] Cards are tappable

#### 3. Song Cards
- [ ] Album images load
- [ ] Song and artist names display
- [ ] 3-dot menu is accessible
- [ ] Cards scroll horizontally

#### 4. Artist Circle Items
- [ ] Avatars display in circles
- [ ] Artist names show below
- [ ] Horizontal scroll works
- [ ] Pink border visible

#### 5. Preferences
- [ ] All preference items visible
- [ ] Chevron icons aligned
- [ ] Items are tappable

#### 6. Logout Button
- [ ] Red color is prominent
- [ ] Loading state works
- [ ] Confirmation dialog appears
- [ ] Actually logs out

---

## ⚠️ Common Issues & Solutions

### Issue: Images Not Loading
```typescript
// Solution: Use fallback/placeholder
<Image
  source={{ uri: avatar || 'https://via.placeholder.com/120' }}
  style={styles.avatar}
  onError={() => console.log('Image failed to load')}
/>
```

### Issue: Slow Scrolling
```typescript
// Solution: Optimize with removeClippedSubviews
<ScrollView removeClippedSubviews={true}>
  {/* Content */}
</ScrollView>
```

### Issue: Memory Leak with useEffect
```typescript
// Solution: Add cleanup
useEffect(() => {
  const fetchData = async () => { /* ... */ };
  fetchData();
  
  return () => {
    // Cleanup if needed
  };
}, []);
```

### Issue: 3-Dot Menu Positioning
```typescript
// If menu appears in wrong position, adjust hitSlop
<TouchableOpacity
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  {/* Menu icon */}
</TouchableOpacity>
```

---

## 📊 Performance Optimization

### 1. Memoize Components
```typescript
const MemoizedPlaylistCard = React.memo(PlaylistCard);
const MemoizedSongCard = React.memo(SongCard);
```

### 2. Use FlatList for Long Lists
```typescript
// For many songs/playlists
<FlatList
  data={songs}
  renderItem={({ item }) => <SongCard {...item} />}
  keyExtractor={(item) => item.id}
  showsVerticalScrollIndicator={false}
/>
```

### 3. Lazy Load Images
```typescript
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: avatar }}
  style={styles.avatar}
  cache={FastImage.cacheControl.immutable}
/>
```

### 4. Debounce API Calls
```typescript
import debounce from 'lodash/debounce';

const handleSearch = debounce((query) => {
  // API call
}, 300);
```

---

## 🔐 Security Best Practices

### 1. Secure Token Handling
```typescript
// Use tokenManager for secure token storage
import { tokenManager } from '../../utils/tokenManager';

const logout = async () => {
  await tokenManager.removeToken();
  // Clear other sensitive data
};
```

### 2. Validate User Data
```typescript
interface User {
  username: string;
  email: string;
  avatar?: string;
}

// Validate before display
if (!user?.username) {
  return <LoadingScreen />;
}
```

### 3. API Error Handling
```typescript
try {
  const response = await api.get('/user/profile');
  return response.data;
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired, redirect to login
    logout();
  }
  throw error;
}
```

---

## 📱 Responsive Design Tips

### iPhone Sizes
- iPhone SE (375px width)
- iPhone 12/13 (390px width)
- iPhone 13 Pro (430px width)
- iPhone 14 Pro Max (440px width)

### Safe Area Handling
```typescript
<SafeAreaView style={styles.container}>
  {/* Content automatically respects notch/home indicator */}
</SafeAreaView>
```

### Flexible Dimensions
```typescript
const { width } = Dimensions.get('window');

const thumbnailSize = width > 400 ? 80 : 64;
```

---

## 📚 Related Files

- [Main Style Guide](profileStyles.ts)
- [Product Documentation](product.md)
- [API Documentation](api.md)
- [Architecture](architecture.md)

---

## 🎓 Learning Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Last Updated**: May 2, 2026  
**Version**: 1.0

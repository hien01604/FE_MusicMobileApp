/**
 * Profile Screen Type Definitions
 * All TypeScript interfaces and types used in the Profile Screen
 */

// ============================================================================
// User & Auth Types
// ============================================================================

export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isSignedIn: boolean;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<User>;
    signUp: (email: string, password: string, username: string) => Promise<User>;
}

// ============================================================================
// Music & Content Types
// ============================================================================

export interface Playlist {
    id: string;
    name: string;
    description?: string;
    songCount: number;
    thumbnail: string;
    createdAt?: string;
    updatedAt?: string;
    isPublic?: boolean;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    albumImage: string;
    albumName?: string;
    duration?: number;
    genre?: string;
    isLiked?: boolean;
}

export interface Artist {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
    followerCount?: number;
    isFollowed?: boolean;
}

export interface Mood {
    id: string;
    name: string;
    icon?: string;
    color?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * ProfileHeader Component Props
 * Displays user avatar, username, email, and edit button
 */
export interface ProfileHeaderProps {
    username: string;
    email: string;
    avatar?: string;
    onEditPress: () => void;
}

/**
 * SectionHeader Component Props
 * Displays section title with optional "See All" button
 */
export interface SectionHeaderProps {
    title: string;
    onSeeAllPress?: () => void;
    hideViewAll?: boolean;
}

/**
 * PlaylistCard Component Props
 * Displays a single playlist in card format
 */
export interface PlaylistCardProps {
    id?: string;
    name: string;
    songCount: number;
    thumbnail: string;
    onPress: () => void;
    isLoading?: boolean;
}

/**
 * SongCard Component Props
 * Displays a single song in horizontal card format
 */
export interface SongCardProps {
    id?: string;
    title: string;
    artist: string;
    albumImage: string;
    onPress: () => void;
    onMenuPress?: () => void;
    isPlaying?: boolean;
    showMenu?: boolean;
}

/**
 * ArtistCircleItem Component Props
 * Displays artist in circular avatar format
 */
export interface ArtistCircleItemProps {
    id?: string;
    name: string;
    avatar: string;
    onPress: () => void;
    isFollowed?: boolean;
}

/**
 * PreferencesListItem Component Props
 * Displays a preference option as list item
 */
export interface PreferencesListItemProps {
    title: string;
    subtitle?: string;
    icon?: string;
    onPress: () => void;
    showArrow?: boolean;
}

/**
 * LogoutButton Component Props
 * Displays logout button with loading state
 */
export interface LogoutButtonProps {
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}

// ============================================================================
// Screen State Types
// ============================================================================

/**
 * ProfileScreen State
 * All state variables used in ProfileScreen component
 */
export interface ProfileScreenState {
    user: User | null;
    playlists: Playlist[];
    likedSongs: Song[];
    recentlyPlayed: Song[];
    followedArtists: Artist[];
    preferences: {
        favoriteArtists: Artist[];
        favoriteGenres: string[];
        favoriteMoods: Mood[];
    };
    loading: boolean;
    error: string | null;
    refreshing: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

export interface PlaylistsResponse {
    playlists: Playlist[];
    total: number;
    page: number;
    limit: number;
}

export interface SongsResponse {
    songs: Song[];
    total: number;
    page: number;
    limit: number;
}

export interface ArtistsResponse {
    artists: Artist[];
    total: number;
    page: number;
    limit: number;
}

export interface UserProfileResponse {
    user: User;
    playlists: Playlist[];
    likedSongsCount: number;
    followedArtistsCount: number;
}

// ============================================================================
// Menu Types
// ============================================================================

/**
 * Song Context Menu Options
 * Used for 3-dot menu in SongCard
 */
export interface SongMenuOption {
    id: string;
    label: string;
    icon?: string;
    action: () => void;
    isDanger?: boolean;
}

export enum SongAction {
    PLAY = 'play',
    ADD_TO_QUEUE = 'add_to_queue',
    ADD_TO_PLAYLIST = 'add_to_playlist',
    UNLIKE = 'unlike',
    SHARE = 'share',
    GO_TO_ARTIST = 'go_to_artist',
    REMOVE = 'remove',
}

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * Profile Stack Navigation Parameters
 */
export type ProfileStackParamList = {
    ProfileScreen: undefined;
    EditProfile: { userId: string };
    AllPlaylists: { userId: string };
    AllSongs: { type: 'liked' | 'recent' };
    AllArtists: { type: 'followed' };
    FavoriteArtists: { userId: string };
    FavoriteGenres: { userId: string };
    FavoriteMoods: { userId: string };
};

// ============================================================================
// Event Handler Types
// ============================================================================

export type OnPlaylistPress = (playlist: Playlist) => void;
export type OnSongPress = (song: Song) => void;
export type OnArtistPress = (artist: Artist) => void;
export type OnSeeAllPress = (section: string) => void;
export type OnEditProfilePress = () => void;
export type OnLogoutPress = () => void;
export type OnMenuPress = (songId: string) => void;

// ============================================================================
// Filter & Sort Types
// ============================================================================

export enum PlaylistSortBy {
    NEWEST = 'newest',
    OLDEST = 'oldest',
    NAME_ASC = 'name_asc',
    NAME_DESC = 'name_desc',
    SONG_COUNT = 'song_count',
}

export enum SongSortBy {
    NEWEST = 'newest',
    OLDEST = 'oldest',
    TITLE_ASC = 'title_asc',
    TITLE_DESC = 'title_desc',
    ARTIST = 'artist',
}

// ============================================================================
// Error Types
// ============================================================================

export interface AppError {
    code: string;
    message: string;
    statusCode?: number;
    data?: any;
}

export enum ErrorCode {
    NETWORK_ERROR = 'NETWORK_ERROR',
    UNAUTHORIZED = 'UNAUTHORIZED',
    NOT_FOUND = 'NOT_FOUND',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// ============================================================================
// Utility Types
// ============================================================================

export interface Dimensions {
    width: number;
    height: number;
}

export interface Spacing {
    horizontal: number;
    vertical: number;
}

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    success: string;
    warning: string;
}

// ============================================================================
// Generic Types
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFn<T> = () => Promise<T>;
export type VoidAsyncFn = () => Promise<void>;

/**
 * Pagination helper type
 */
export interface PaginationParams {
    page: number;
    limit: number;
    offset?: number;
}

/**
 * Search filter type
 */
export interface SearchFilter {
    query: string;
    type?: 'songs' | 'artists' | 'playlists';
    genre?: string;
    mood?: string;
}

/**
 * Loading state helper type
 */
export interface LoadingState<T> {
    data: Optional<T>;
    isLoading: boolean;
    error: Optional<AppError>;
}

// ============================================================================
// Async Utility Types
// ============================================================================

/**
 * Result type for operations that can succeed or fail
 * Useful for error handling
 */
export type Result<T, E = AppError> =
    | { success: true; data: T }
    | { success: false; error: E };

/**
 * Async Result type
 */
export type AsyncResult<T, E = AppError> = Promise<Result<T, E>>;

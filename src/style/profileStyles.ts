import { StyleSheet } from 'react-native';

// Color Palette
export const colors = {
    // Background
    background: {
        primary: '#0a0e27',
        secondary: '#1a1f3a',
        tertiary: '#252d47',
    },
    // Accent
    accent: {
        primary: '#FF006B', // Pink/Red
        secondary: '#FF4081', // Light pink
    },
    // Text
    text: {
        primary: '#ffffff',
        secondary: '#888888',
        tertiary: '#666666',
    },
    // Utility
    border: '#2a2f45',
    shadow: '#000000',
};

// Profile Header Styles
export const profileHeaderStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 24,
        paddingHorizontal: 16,
    },
    avatarWrapper: {
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.accent.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        fontSize: 48,
        fontWeight: '700',
        color: colors.text.primary,
    },
    username: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 4,
        textAlign: 'center',
    },
    email: {
        fontSize: 14,
        color: colors.text.secondary,
        marginBottom: 16,
        textAlign: 'center',
    },
    editButton: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: colors.accent.primary,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.accent.primary,
    },
});

// Section Header Styles
export const sectionHeaderStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text.primary,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.accent.primary,
    },
});

// Playlist Card Styles
export const playlistCardStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        padding: 12,
        gap: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    thumbnail: {
        width: 64,
        height: 64,
        borderRadius: 8,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    songCount: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    arrow: {
        marginLeft: 8,
    },
});

// Song Card Styles
export const songCardStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        padding: 12,
        gap: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    albumImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    artist: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    menuButton: {
        padding: 8,
    },
});

// Artist Circle Item Styles
export const artistCircleItemStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: 100,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: colors.accent.primary,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    name: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.primary,
        textAlign: 'center',
    },
});

// Preferences List Item Styles
export const preferencesListItemStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginTop: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
    },
});

// Logout Button Styles
export const logoutButtonStyles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: colors.accent.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.accent.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
    },
});

// Screen Container Styles
export const screenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    section: {
        marginTop: 28,
    },
    playlistsContainer: {
        marginTop: 16,
        gap: 12,
    },
    songsList: {
        marginTop: 16,
        gap: 12,
    },
    artistsContainer: {
        marginTop: 16,
        paddingRight: 16,
        gap: 16,
    },
    logoutSection: {
        marginTop: 40,
        marginBottom: 20,
    },
});

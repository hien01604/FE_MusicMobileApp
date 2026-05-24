import React from 'react';
import {
    Image,
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';

interface ProfileHeaderProps {
    username: string;
    email: string;
    avatarUrl?: string | null;
    onEditPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    username,
    email,
    avatarUrl,
    onEditPress,
}) => {
    const fallbackInitial = (username || email || 'P').charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                    ) : (
                        <Text style={styles.avatarText}>{fallbackInitial}</Text>
                    )}
                </View>
            </View>

            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
            <TouchableOpacity
                style={styles.editButton}
                onPress={onEditPress}
                activeOpacity={0.75}
            >
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 16,
        alignItems: 'center',
    },
    avatarWrapper: {
        marginTop: 8,
        marginBottom: 14,
        borderRadius: 61,
        padding: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 109, 0.42)',
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#FF4D6D',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: '#FF4D6D',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
        elevation: 8,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        fontSize: 42,
        fontWeight: '700',
        color: '#fff',
    },

    username: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },

    email: {
        fontSize: 14,
        color: '#AEB8D8',
    },
    editButton: {
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 109, 0.72)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 77, 109, 0.12)',
        marginTop: 14,
    },
    editButtonText: {
        color: '#FF6F86',
        fontSize: 13,
        fontWeight: '800',
    },
});

export default ProfileHeader;

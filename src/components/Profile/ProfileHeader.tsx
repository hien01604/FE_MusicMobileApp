import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';

interface ProfileHeaderProps {
    username: string;
    email: string;
    onEditPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    username,
    email,
    onEditPress,
}) => {
    return (
        <View style={styles.container}>
            {/* TOP BAR */}
            <View style={styles.topRow}>
                <View />
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={onEditPress}
                    activeOpacity={0.7}
                >
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            {/* AVATAR */}
            <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {username.charAt(0).toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* USER INFO */}
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 16,
        alignItems: 'center',
    },

    topRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    editText: {
        color: '#FF006B',
        fontSize: 14,
        fontWeight: '600',
    },

    avatarWrapper: {
        marginTop: 8,
        marginBottom: 16,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#FF006B',
        justifyContent: 'center',
        alignItems: 'center',

        // shadow đẹp hơn
        shadowColor: '#FF006B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
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
        color: '#aaa',
    },
    editButton: {
    borderWidth: 1.5,
    borderColor: '#FF006B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
},

editButtonText: {
    color: '#FF006B',
    fontSize: 13,
    fontWeight: '600',
},
});

export default ProfileHeader;
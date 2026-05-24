import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlaylistCardProps {
    name: string;
    songCount: number;
    thumbnail: string;
    onPress: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
    name,
    songCount,
    thumbnail,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Thumbnail */}
            <Image
                source={{ uri: thumbnail }}
                style={styles.thumbnail}
            />

            {/* Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>
                    {name}
                </Text>
                <Text style={styles.songCount}>{songCount} songs</Text>
            </View>

            {/* Arrow Icon */}
            <Ionicons
                name="chevron-forward"
                size={24}
                color="#FF006B"
                style={styles.arrow}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1f3a',
        borderRadius: 12,
        padding: 12,
        gap: 12,
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
        color: '#fff',
        marginBottom: 4,
    },
    songCount: {
        fontSize: 12,
        color: '#888',
    },
    arrow: {
        marginLeft: 8,
    },
});

export default PlaylistCard;

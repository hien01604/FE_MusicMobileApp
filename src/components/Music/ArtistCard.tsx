import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Artist } from '../../types';

interface Props {
    item: Artist;
    onPress?: () => void;
}

export default function ArtistCard({ item, onPress }: Props) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name} numberOfLines={1}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        marginRight: 12,
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.82)',
    },
    name: {
        color: '#FFFFFF',
        marginTop: 6,
        textAlign: 'center',
    },
});

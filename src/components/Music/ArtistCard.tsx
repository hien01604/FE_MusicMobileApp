import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Artist } from '../../types';

interface Props {
    item: Artist;
    onPress?: () => void;
}

export default function ArtistCard({ item, onPress }: Props) {
    return (
        <TouchableOpacity
            style={{ width: 140, marginRight: 12 }}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: 140, borderRadius: 12 }}
            />
            <Text style={{ color: 'white', marginTop: 6 }}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
}
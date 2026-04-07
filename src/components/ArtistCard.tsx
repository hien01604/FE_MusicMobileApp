import { View, Text, Image } from "react-native";
import { Artist } from "../../src/types";

interface Props {
    item: Artist;
}

export default function ArtistCard({ item }: Props) {
    return (
        <View style={{ width: 140, marginRight: 12 }}>
            <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: 140, borderRadius: 12 }}
            />
            <Text style={{ color: "white", marginTop: 6 }}>
                {item.name}
            </Text>
        </View>
    );
}
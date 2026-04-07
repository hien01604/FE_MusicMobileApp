import { View, Text } from "react-native";
import { Category } from "../../src/types";

interface Props {
    item: Category;
}

export default function CategoryCard({ item }: Props) {
    return (
        <View
            style={{
                flex: 1,
                padding: 16,
                borderRadius: 16,
                backgroundColor: "#2a2a4a",
            }}
        >
            <Text style={{ color: "white" }}>{item.title}</Text>
        </View>
    );
}
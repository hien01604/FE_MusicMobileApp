import { FlatList, ListRenderItem } from "react-native";

interface Props<T> {
    data: T[];
    renderItem: ListRenderItem<T>;
}

export default function HorizontalList<T>({
    data,
    renderItem,
}: Props<T>) {
    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
        />
    );
}
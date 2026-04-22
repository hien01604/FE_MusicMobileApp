import { FlatList, ListRenderItem, StyleProp, ViewStyle } from 'react-native';

interface Props<T> {
    data: T[];
    renderItem: ListRenderItem<T>;
    keyExtractor?: (item: T, index: number) => string;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function HorizontalList<T>({
    data,
    renderItem,
    keyExtractor,
    contentContainerStyle,
}: Props<T>) {
    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            keyExtractor={(item, index) => {
                if (keyExtractor) {
                    return keyExtractor(item, index);
                }

                const candidate = item as { id?: string | number };
                if (candidate.id !== undefined && candidate.id !== null) {
                    return String(candidate.id);
                }

                return index.toString();
            }}
            renderItem={renderItem}
            contentContainerStyle={contentContainerStyle}
            initialNumToRender={4}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews
        />
    );
}
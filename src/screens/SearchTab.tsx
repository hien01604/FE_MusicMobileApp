import React, { memo, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import SearchBar from '../components/SearchBar';

type SearchItem = {
    id: string;
    title: string;
    kind: string;
};

const SEARCH_ITEMS: ReadonlyArray<SearchItem> = [
    { id: 'search-1', title: 'Dream City', kind: 'Song' },
    { id: 'search-2', title: 'Analog Heart', kind: 'Album' },
    { id: 'search-3', title: 'Echo Saints', kind: 'Artist' },
    { id: 'search-4', title: 'Night Drive Essentials', kind: 'Playlist' },
    { id: 'search-5', title: 'Skyline Radio', kind: 'Podcast' },
    { id: 'search-6', title: 'Cloudline', kind: 'Song' },
];

const SearchTabComponent = () => {
    const [query, setQuery] = useState('');

    const filteredItems = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return SEARCH_ITEMS;
        }

        return SEARCH_ITEMS.filter((item) => {
            return (
                item.title.toLowerCase().includes(normalizedQuery) ||
                item.kind.toLowerCase().includes(normalizedQuery)
            );
        });
    }, [query]);

    return (
        <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            extraData={query}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Search songs, artists, playlists"
                />
            }
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.kind}</Text>
                </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyState}>No matches found.</Text>}
        />
    );
};

export const SearchTab = memo(SearchTabComponent);

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: 'rgba(14, 68, 61, 0.85)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 6,
        color: '#BDEEE1',
        fontSize: 13,
    },
    emptyState: {
        color: '#AEB8D8',
        textAlign: 'center',
        marginTop: 12,
    },
});

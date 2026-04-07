import React, { memo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type HomeMix = {
    id: string;
    title: string;
    subtitle: string;
};

const HOME_MIXES: ReadonlyArray<HomeMix> = [
    { id: 'mix-1', title: 'Daily Mix 01', subtitle: 'Chillwave, Dream Pop, Indie' },
    { id: 'mix-2', title: 'Workout Pulse', subtitle: 'EDM, Trap, Bass House' },
    { id: 'mix-3', title: 'Late Night Focus', subtitle: 'Lo-fi, Ambient, Instrumental' },
    { id: 'mix-4', title: 'Indie Radar', subtitle: 'Fresh indie tracks this week' },
    { id: 'mix-5', title: 'Neon Memories', subtitle: 'Synthwave and retro anthems' },
];

const HomeTabComponent = () => {
    return (
        <FlatList
            data={HOME_MIXES}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
            )}
        />
    );
};

export const HomeTab = memo(HomeTabComponent);

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: 'rgba(31, 36, 74, 0.85)',
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
        color: '#B8C0E8',
        fontSize: 13,
    },
});

import React, { memo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type RadioStation = {
    id: string;
    name: string;
    genre: string;
};

const RADIO_STATIONS: ReadonlyArray<RadioStation> = [
    { id: 'station-1', name: 'Signal FM', genre: 'Electronic' },
    { id: 'station-2', name: 'Afterhours Live', genre: 'Deep House' },
    { id: 'station-3', name: 'Rock District', genre: 'Alternative Rock' },
    { id: 'station-4', name: 'Velvet Jazz', genre: 'Nu Jazz' },
    { id: 'station-5', name: 'Beat Stream', genre: 'Hip Hop' },
];

const RadioTabComponent = () => {
    return (
        <FlatList
            data={RADIO_STATIONS}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.subtitle}>{item.genre}</Text>
                </View>
            )}
        />
    );
};

export const RadioTab = memo(RadioTabComponent);

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: 'rgba(24, 57, 88, 0.85)',
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
        color: '#AEDAFB',
        fontSize: 13,
    },
});

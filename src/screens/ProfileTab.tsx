import React, { memo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type ProfileAction = {
    id: string;
    label: string;
    description: string;
};

const PROFILE_ACTIONS: ReadonlyArray<ProfileAction> = [
    { id: 'profile-1', label: 'Account', description: 'Manage personal details and subscriptions' },
    { id: 'profile-2', label: 'Playback', description: 'Audio quality and streaming preferences' },
    { id: 'profile-3', label: 'Downloads', description: 'Offline songs and storage usage' },
    { id: 'profile-4', label: 'Notifications', description: 'New releases and reminder settings' },
    { id: 'profile-5', label: 'Privacy', description: 'Listening activity and connected apps' },
];

const ProfileTabComponent = () => {
    return (
        <FlatList
            data={PROFILE_ACTIONS}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.title}>{item.label}</Text>
                    <Text style={styles.subtitle}>{item.description}</Text>
                </View>
            )}
        />
    );
};

export const ProfileTab = memo(ProfileTabComponent);

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: 'rgba(56, 34, 79, 0.85)',
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
        color: '#D8C2F0',
        fontSize: 13,
    },
});

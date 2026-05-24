import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import { getTasteProfile, type TasteProfile } from '../../services/tasteProfile.service';
import type { RootStackParamList } from '../../navigation/type';
import { SAIRA_STENCIL_ONE_REGULAR } from '../../../utils/const';

type Props = NativeStackScreenProps<RootStackParamList, 'TasteProfile'>;

const EMPTY_TASTE: TasteProfile = {
    likedSongsCount: 0,
    topArtists: [],
    topGenres: [],
};

function formatList(items: string[], fallback: string): string {
    return items.length > 0 ? items.join(', ') : fallback;
}

export default function TasteProfileScreen({ navigation }: Props) {
    const [taste, setTaste] = useState<TasteProfile>(EMPTY_TASTE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let mounted = true;

            const loadTaste = async () => {
                setLoading(true);
                setError(null);

                try {
                    const profile = await getTasteProfile();

                    if (mounted) {
                        setTaste(profile);
                    }
                } catch {
                    if (mounted) {
                        setTaste(EMPTY_TASTE);
                        setError('Could not load your taste profile.');
                    }
                } finally {
                    if (mounted) {
                        setLoading(false);
                    }
                }
            };

            void loadTaste();

            return () => {
                mounted = false;
            };
        }, [])
    );

    return (
        <Layout>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.header}>
                    <BackButton onBack={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Taste Profile</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.hero}>
                    <View style={styles.heroIcon}>
                        <MaterialIcons name="graphic-eq" size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.heroTitle}>Your Taste</Text>
                    <Text style={styles.heroSubtitle}>
                        A quick snapshot of what you keep coming back to.
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color="#FF4D6D" />
                ) : (
                    <>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <View style={styles.card}>
                            <Text style={styles.label}>Liked Songs</Text>
                            <Text style={styles.value}>{taste.likedSongsCount}</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.label}>Top Artists</Text>
                            <Text style={styles.listValue}>
                                {formatList(taste.topArtists, 'Follow artists to build this list')}
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.label}>Top Genres</Text>
                            <Text style={styles.listValue}>
                                {formatList(taste.topGenres, 'Choose genres in preferences')}
                            </Text>
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.preferencesButton,
                                pressed && styles.preferencesButtonPressed,
                            ]}
                            onPress={() => navigation.navigate('Preferences')}
                        >
                            <MaterialIcons name="tune" size={18} color="#FFFFFF" />
                            <Text style={styles.preferencesText}>Update preferences</Text>
                        </Pressable>
                    </>
                )}
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 130,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerTitle: {
        color: '#FFFFFF',
        flex: 1,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        fontSize: 22,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 32,
    },
    hero: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(21, 26, 53, 0.86)',
        padding: 18,
        marginBottom: 18,
    },
    heroIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
        marginBottom: 12,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: '900',
    },
    heroSubtitle: {
        color: '#AEB8D8',
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 19,
        marginTop: 6,
    },
    card: {
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 16,
        paddingVertical: 15,
        marginBottom: 12,
    },
    label: {
        color: '#AEB8D8',
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    value: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '900',
    },
    listValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        lineHeight: 22,
    },
    preferencesButton: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FF4D6D',
        borderRadius: 12,
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
        minHeight: 42,
        paddingHorizontal: 14,
    },
    preferencesButtonPressed: {
        opacity: 0.8,
    },
    preferencesText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '900',
    },
    errorText: {
        color: '#FF7B95',
        marginBottom: 12,
        textAlign: 'center',
    },
});

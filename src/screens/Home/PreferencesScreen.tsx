import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import SearchBar from '../../components/common/SearchBar';
import {
    mapArtistDtoToOnboardingArtist,
    searchArtists,
} from '../../services/artists.service';
import { updatePreferences } from '../../services/users.service';
import type { RootStackParamList } from '../../navigation/type';
import type { Artist } from '../../types/artist.types';

type Props = NativeStackScreenProps<RootStackParamList, 'Preferences'>;

export default function PreferencesScreen({ navigation }: Props) {
    const [query, setQuery] = useState('');
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const trimmedQuery = query.trim();

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        const timeoutId = setTimeout(() => {
            searchArtists({ q: trimmedQuery, limit: 30 })
                .then((result) => {
                    if (!cancelled) {
                        setArtists(result.map(mapArtistDtoToOnboardingArtist));
                    }
                })
                .catch((searchError) => {
                    if (!cancelled) {
                        setArtists([]);
                        setError(
                            searchError instanceof Error
                                ? searchError.message
                                : 'Could not load artists.'
                        );
                    }
                })
                .finally(() => {
                    if (!cancelled) {
                        setLoading(false);
                    }
                });
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [trimmedQuery]);

    const selectedCount = selectedArtistIds.length;
    const selectedLookup = useMemo(
        () => new Set(selectedArtistIds),
        [selectedArtistIds]
    );

    const toggleArtist = (artistId: string) => {
        setSelectedArtistIds((current) =>
            current.includes(artistId)
                ? current.filter((id) => id !== artistId)
                : [...current, artistId]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            await updatePreferences({ artistIds: selectedArtistIds });
            Alert.alert('Preferences updated', 'Your favorite artists were saved.');
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : 'Could not save preferences.'
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onBack={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Preferences</Text>
                    <Pressable
                        accessibilityRole="button"
                        disabled={saving}
                        onPress={() => void handleSave()}
                        style={({ pressed }) => [
                            styles.saveButton,
                            pressed && !saving && styles.saveButtonPressed,
                            saving && styles.saveButtonDisabled,
                        ]}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <MaterialIcons name="check" size={20} color="#FFFFFF" />
                        )}
                    </Pressable>
                </View>

                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Search artists"
                />
                <Text style={styles.selectionText}>
                    Favorite artists selected: {selectedCount}
                </Text>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {loading ? (
                    <View style={styles.stateContainer}>
                        <ActivityIndicator size="large" color="#FF4D6D" />
                    </View>
                ) : (
                    <FlatList
                        data={artists}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.artistRow}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.artistList}
                        ListEmptyComponent={
                            <View style={styles.stateContainer}>
                                <Text style={styles.emptyText}>No artists found.</Text>
                            </View>
                        }
                        renderItem={({ item }) => {
                            const selected = selectedLookup.has(item.id);

                            return (
                                <Pressable
                                    onPress={() => toggleArtist(item.id)}
                                    style={({ pressed }) => [
                                        styles.artistButton,
                                        selected && styles.artistButtonSelected,
                                        pressed && styles.artistButtonPressed,
                                    ]}
                                >
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={styles.artistImage}
                                    />
                                    <Text style={styles.artistName} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    {selected ? (
                                        <View style={styles.selectedMark}>
                                            <MaterialIcons
                                                name="check"
                                                size={14}
                                                color="#FFFFFF"
                                            />
                                        </View>
                                    ) : null}
                                </Pressable>
                            );
                        }}
                    />
                )}
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '800',
    },
    saveButton: {
        alignItems: 'center',
        backgroundColor: '#FF4D6D',
        borderRadius: 18,
        height: 36,
        justifyContent: 'center',
        width: 36,
    },
    saveButtonPressed: {
        opacity: 0.78,
    },
    saveButtonDisabled: {
        opacity: 0.55,
    },
    selectionText: {
        color: '#AEB8D8',
        marginBottom: 12,
    },
    errorText: {
        color: '#FF7B95',
        marginBottom: 12,
    },
    stateContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 28,
    },
    emptyText: {
        color: '#AEB8D8',
    },
    artistList: {
        paddingBottom: 28,
    },
    artistRow: {
        gap: 12,
    },
    artistButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(30, 32, 61, 0.68)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 8,
        borderWidth: 1,
        flex: 1,
        marginBottom: 12,
        minHeight: 154,
        padding: 12,
    },
    artistButtonSelected: {
        borderColor: '#FF4D6D',
        backgroundColor: 'rgba(255, 77, 109, 0.16)',
    },
    artistButtonPressed: {
        opacity: 0.82,
    },
    artistImage: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 48,
        height: 96,
        width: 96,
    },
    artistName: {
        color: '#FFFFFF',
        fontWeight: '700',
        marginTop: 10,
        textAlign: 'center',
    },
    selectedMark: {
        alignItems: 'center',
        backgroundColor: '#FF4D6D',
        borderRadius: 11,
        height: 22,
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        top: 10,
        width: 22,
    },
});

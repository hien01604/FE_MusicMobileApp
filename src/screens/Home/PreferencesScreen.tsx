import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import AppModal from '../../components/common/AppModal';
import AddArtistModal from '../../components/common/AddArtistModal';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import {
    GENRE_OPTIONS,
    PreferenceOption,
    PreferenceTab,
} from '../../constants/preferences';
import { updatePreferences } from '../../services/users.service';
import {
    getStoredPreferences,
    saveStoredPreferences,
    StoredPreferences,
} from '../../services/preferences.storage';
import { getGenres } from '../../services/genres.service';
import type { RootStackParamList } from '../../navigation/type';
import { SAIRA_STENCIL_ONE_REGULAR } from '../../../utils/const';


type Props = NativeStackScreenProps<RootStackParamList, 'Preferences'>;

const tabs: { id: PreferenceTab; label: string }[] = [
    { id: 'artists', label: 'Artists' },
    { id: 'genres', label: 'Genres' },
];

export default function PreferencesScreen({ navigation, route }: Props) {
    const [activeTab, setActiveTab] = useState<PreferenceTab>(
        route.params?.initialTab ?? 'artists'
    );

    const [genreOptions, setGenreOptions] = useState<PreferenceOption[]>([]);
    const [preferences, setPreferences] = useState<StoredPreferences>({
        artists: [],
        genres: [],
        moods: [],
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');
    const [addVisible, setAddVisible] = useState(false);


    useEffect(() => {
        let mounted = true;

        getGenres()
            .then((genres) => {
                if (mounted) {
                    setGenreOptions(genres);
                }
            })
            .catch(() => undefined);

        getStoredPreferences().then((stored) => {
            if (mounted) {
                setPreferences(stored);
            }
        });

        return () => {
            mounted = false;
        };
    }, []);



    const selectedIds = useMemo(
        () => new Set(preferences[activeTab].map((item) => item.id)),
        [activeTab, preferences]
    );

    const selectedCount = preferences[activeTab].length;

    const togglePreference = (tab: PreferenceTab, option: PreferenceOption) => {
        setPreferences((current) => {
            const exists = current[tab].some((item) => item.id === option.id);

            return {
                ...current,
                [tab]: exists
                    ? current[tab].filter((item) => item.id !== option.id)
                    : [...current[tab], option],
            };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            await saveStoredPreferences(preferences);
            const artistIds = preferences.artists.map((artist) => artist.id);
            const genreIds = preferences.genres.map((genre) => genre.id);

            if (artistIds.length >= 3 && genreIds.length > 0) {
                await updatePreferences({
                    artistIds,
                    genreIds,
                    moodIds: [],
                });
            }
            setInfoTitle('Preferences updated');
            setInfoDescription(
                artistIds.length >= 3
                    ? 'Your preferences were saved.'
                    : 'Your preferences were saved locally. Add 3 artists to sync them to the server.'
            );
            setInfoVisible(true);
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : 'Preferences were saved locally, but could not sync.'
            );
        } finally {
            setSaving(false);
        }
    };

    const renderOptionChip = (tab: PreferenceTab, option: PreferenceOption) => {
        const selected = preferences[tab].some((item) => item.id === option.id);

        return (
            <Pressable
                key={option.id}
                onPress={() => togglePreference(tab, option)}
                style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.itemPressed,
                ]}
            >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {option.label}
                </Text>
                {selected ? <MaterialIcons name="check" size={16} color="#FFFFFF" /> : null}
            </Pressable>
        );
    };

    const renderSelectedArtists = () => {
        const selected = preferences.artists;

        if (!selected || selected.length === 0) {
            return (
                <View style={styles.stateContainer}>
                    <Text style={styles.emptyText}>No favorite artists yet. Tap + to add.</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={selected}
                keyExtractor={(item) => item.id}
                numColumns={3}
                columnWrapperStyle={styles.artistRow}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.artistList}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.selectedArtistContainer}>
                            <Pressable
                                onPress={() => togglePreference('artists', item)}
                                style={({ pressed }) => [
                                    styles.selectedArtistButton,
                                    pressed && styles.itemPressed,
                                ]}
                            >
                                <Image
                                    source={{ uri: `https://picsum.photos/seed/${item.id}/160` }}
                                    style={styles.selectedArtistAvatar}
                                />
                                <View style={styles.selectedMinusBadge}>
                                    <MaterialIcons name="check" size={15} color="#FFFFFF" />
                                </View>
                                <Text style={styles.artistName} numberOfLines={1}>
                                    {item.label}
                                </Text>
                            </Pressable>
                        </View>
                    );
                }}
            />
        );
    };

    return (
        <Layout>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onBack={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Preferences</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.tabs}>
                    {tabs.map((tab) => {
                        const selected = activeTab === tab.id;

                        return (
                            <Pressable
                                key={tab.id}
                                onPress={() => setActiveTab(tab.id)}
                                style={[styles.tab, selected && styles.tabSelected]}
                            >
                                <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
                                    {tab.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {activeTab === 'artists' ? null : null}

                <Text style={styles.selectionText}>
                    Selected {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}: {selectedCount}
                </Text>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <AppModal
                    visible={infoVisible}
                    title={infoTitle}
                    description={infoDescription}
                    confirmText="OK"
                    onCancel={() => setInfoVisible(false)}
                    onConfirm={() => setInfoVisible(false)}
                />

                {activeTab === 'artists' ? (
                    renderSelectedArtists()
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.optionGrid}
                    >
                        {genreOptions.map((option) =>
                            renderOptionChip(activeTab, option)
                        )}
                    </ScrollView>
                )}
                <View style={styles.floatingActions}>
                    {activeTab === 'artists' ? (
                        <Pressable
                            accessibilityRole="button"
                            disabled={saving}
                            onPress={() => setAddVisible(true)}
                            style={({ pressed }) => [
                                styles.floatingAddButton,
                                pressed && styles.saveButtonPressed,
                                saving && styles.saveButtonDisabled,
                            ]}
                        >
                            <Text style={styles.floatingAddText}>Add</Text>
                        </Pressable>
                    ) : null}

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
                            <Text style={styles.saveButtonText}>Save</Text>
                        )}
                    </Pressable>
                </View>
            </View>
            <AddArtistModal
                visible={addVisible}
                existingIds={preferences.artists.map((a) => a.id)}
                existingOptions={preferences.artists}
                onClose={() => setAddVisible(false)}
                onConfirm={(options: PreferenceOption[]) => {
                    setPreferences((current) => ({
                        ...current,
                        artists: options,
                    }));
                }}
            />
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
        minHeight: 40,
        marginBottom: 14,
        position: 'relative',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        fontSize: 22,
        left: 40,
        position: 'absolute',
        right: 40,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 32,
    },
    saveButton: {
        alignItems: 'center',
        backgroundColor: '#FF4D6D',
        borderRadius: 18,
        height: 36,
        justifyContent: 'center',
        minWidth: 68,
        paddingHorizontal: 14,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },
    saveButtonPressed: {
        opacity: 0.78,
    },
    saveButtonDisabled: {
        opacity: 0.55,
    },
    floatingActions: {
        position: 'absolute',
        right: 0,
        bottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        zIndex: 20,
    },
    floatingAddButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderRadius: 18,
        height: 36,
        justifyContent: 'center',
        minWidth: 68,
        paddingHorizontal: 14,
    },
    floatingAddText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
    },
    tabs: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
    },
    tab: {
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        flex: 1,
        paddingVertical: 12,
        backgroundColor: 'rgba(30, 32, 61, 0.68)',
    },
    tabSelected: {
        backgroundColor: 'rgba(255, 77, 109, 0.22)',
        borderColor: '#FF4D6D',
        shadowColor: '#FF4D6D',
        shadowOpacity: 0.22,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    tabText: {
        color: '#AEB8D8',
        fontWeight: '700',
    },
    tabTextSelected: {
        color: '#FFFFFF',
    },
    selectionText: {
        color: '#AEB8D8',
        marginBottom: 12,
        marginTop: 12,
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
        paddingBottom: 112,
    },
    artistRow: {
        gap: 10,
    },
    selectedArtistButton: {
        alignItems: 'center',
        flex: 1,
        minHeight: 126,
        paddingVertical: 8,
        paddingHorizontal: 4,
        justifyContent: 'center',
    },
    selectedArtistAvatar: {
        width: 82,
        height: 82,
        borderRadius: 41,
        borderWidth: 3,
        borderColor: '#FF4D6D',
    },
    selectedArtistContainer: {
        flex: 1,
        marginBottom: 12,
        alignItems: 'center',
    },
    selectedMinusBadge: {
        position: 'absolute',
        right: 10,
        top: 68,
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
        borderWidth: 2,
        borderColor: '#080B1F',
    },
    artistButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(30, 32, 61, 0.68)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
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
    itemPressed: {
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
    optionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingBottom: 112,
    },
    chip: {
        alignItems: 'center',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: 'rgba(30, 32, 61, 0.68)',
    },
    chipSelected: {
        backgroundColor: 'rgba(255, 77, 109, 0.22)',
        borderColor: '#FF4D6D',
        shadowColor: '#FF4D6D',
        shadowOpacity: 0.16,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    chipText: {
        color: '#AEB8D8',
        fontWeight: '700',
    },
    chipTextSelected: {
        color: '#FFFFFF',
    },
});

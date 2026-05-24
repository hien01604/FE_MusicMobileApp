import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../components/common/Layout';
import BackButton from '../../components/common/BackButton';
import AppModal from '../../components/common/AppModal';
import AddToPlaylistModal from '../../components/common/AddToPlaylistModal';
import { SongListItem } from '../../components/Music/SongListItem';
import { getApiErrorMessage } from '../../services/api';
import { createAIVibeMix } from '../../services/aiVibeMix.service';
import { likeSong, unlikeSong } from '../../services/users.service';
import { publishSongPatch, subscribeSongPatches } from '../../services/songState.events';
import { usePlayerStore } from '../../store/playerStore';
import type { RootStackParamList } from '../../navigation/type';
import type { Song } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AIVibeMix'>;

const EXAMPLE_PROMPTS = [
    'Tôi muốn nghe nhạc chill để học bài ban đêm, không quá buồn',
    'Tạo playlist nghe khi đi xe buýt trời mưa',
    'Nhạc năng lượng để tập gym',
    'Nhạc nhẹ nhẹ để code deadline',
];

export default function AIVibeMixScreen({ navigation }: Props) {
    const [prompt, setPrompt] = useState('');
    const [playlistTitle, setPlaylistTitle] = useState('Your VibeMix');
    const [playlistDescription, setPlaylistDescription] = useState<string | undefined>();
    const [songs, setSongs] = useState<Song[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [playlistSong, setPlaylistSong] = useState<Song | null>(null);
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoDescription, setInfoDescription] = useState('');
    const playSong = usePlayerStore((state) => state.playSong);
    const updateSongById = usePlayerStore((state) => state.updateSongById);

    const trimmedPrompt = prompt.trim();
    const canGenerate = trimmedPrompt.length >= 4 && !isGenerating;

    const applySongState = useCallback((songId: string, patch: Partial<Song>) => {
        setSongs((currentSongs) =>
            currentSongs.map((song) => (song.id === songId ? { ...song, ...patch } : song))
        );
        updateSongById(songId, patch);
    }, [updateSongById]);

    useEffect(() => subscribeSongPatches(applySongState), [applySongState]);

    const updateSongState = useCallback((songId: string, patch: Partial<Song>) => {
        applySongState(songId, patch);
        publishSongPatch(songId, patch);
    }, [applySongState]);

    const showInfo = useCallback((title: string, description: string) => {
        setInfoTitle(title);
        setInfoDescription(description);
        setInfoVisible(true);
    }, []);

    const handleGenerate = useCallback(async () => {
        if (!canGenerate) {
            return;
        }

        setIsGenerating(true);

        try {
            const result = await createAIVibeMix(trimmedPrompt);
            setPlaylistTitle(result.title);
            setPlaylistDescription(result.description);
            setSongs(result.songs);

            if (result.songs.length === 0) {
                showInfo('No songs found', 'AI VibeMix did not return any songs for this mood.');
            }
        } catch (error) {
            showInfo('Could not create VibeMix', getApiErrorMessage(error, 'Please try again.'));
        } finally {
            setIsGenerating(false);
        }
    }, [canGenerate, showInfo, trimmedPrompt]);

    const handleSongPress = useCallback((song: Song) => {
        void playSong(song, songs);
        navigation.navigate('Player', { songId: song.id });
    }, [navigation, playSong, songs]);

    const handleToggleLike = useCallback(async (song: Song) => {
        const nextLiked = !song.isLiked;
        updateSongState(song.id, { isLiked: nextLiked });

        try {
            if (nextLiked) {
                await likeSong({ songId: song.id });
            } else {
                await unlikeSong(song.id);
            }
        } catch {
            updateSongState(song.id, { isLiked: Boolean(song.isLiked) });
            showInfo('Error', 'Could not update liked songs.');
        }
    }, [showInfo, updateSongState]);

    const header = useMemo(() => (
        <View>
            <View style={styles.headerRow}>
                <BackButton onBack={() => navigation.goBack()} />
            </View>

            <View style={styles.titleBlock}>
                <View style={styles.iconBadge}>
                    <MaterialIcons name="auto-awesome" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.title}>AI VibeMix</Text>
                <Text style={styles.subtitle}>
                    Describe your mood and let AI create a playlist for you.
                </Text>
            </View>

            <View style={styles.promptPanel}>
                <TextInput
                    value={prompt}
                    onChangeText={setPrompt}
                    placeholder="What do you want to listen to?"
                    placeholderTextColor="rgba(220,228,255,0.48)"
                    style={styles.input}
                    multiline
                    textAlignVertical="top"
                    maxLength={240}
                    editable={!isGenerating}
                />
                <View style={styles.promptFooter}>
                    <Text style={styles.counter}>{prompt.length}/240</Text>
                    <Pressable
                        disabled={!canGenerate}
                        onPress={handleGenerate}
                        style={({ pressed }) => [
                            styles.generateButton,
                            !canGenerate && styles.generateButtonDisabled,
                            pressed && styles.generateButtonPressed,
                        ]}
                    >
                        {isGenerating ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <MaterialIcons name="playlist-play" size={20} color="#FFFFFF" />
                        )}
                        <Text style={styles.generateText}>
                            {isGenerating ? 'Creating' : 'Create'}
                        </Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.examples}>
                {EXAMPLE_PROMPTS.map((example) => (
                    <Pressable
                        key={example}
                        disabled={isGenerating}
                        onPress={() => setPrompt(example)}
                        style={({ pressed }) => [
                            styles.exampleChip,
                            pressed && styles.exampleChipPressed,
                        ]}
                    >
                        <Text style={styles.exampleText} numberOfLines={2}>
                            {example}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {songs.length > 0 && (
                <View style={styles.resultHeader}>
                    <View>
                        <Text style={styles.resultTitle}>{playlistTitle}</Text>
                        <Text style={styles.resultMeta}>
                            {songs.length} songs
                            {playlistDescription ? ` - ${playlistDescription}` : ''}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    ), [
        canGenerate,
        handleGenerate,
        isGenerating,
        navigation,
        playlistDescription,
        playlistTitle,
        prompt,
        songs.length,
    ]);

    return (
        <Layout>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <FlatList
                    data={songs}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={header}
                    contentContainerStyle={styles.content}
                    renderItem={({ item }) => (
                        <SongListItem
                            song={item}
                            onPress={handleSongPress}
                            onToggleLike={handleToggleLike}
                            onAddToPlaylist={setPlaylistSong}
                        />
                    )}
                />
            </KeyboardAvoidingView>

            <AddToPlaylistModal
                visible={Boolean(playlistSong)}
                song={playlistSong}
                onClose={() => setPlaylistSong(null)}
                onAdded={(song) => updateSongState(song.id, { isInPlaylist: true })}
                onRemoved={(song) => updateSongState(song.id, { isInPlaylist: false })}
                onError={(message) => showInfo('Error', message)}
            />
            <AppModal
                visible={infoVisible}
                title={infoTitle}
                description={infoDescription}
                confirmText="OK"
                onCancel={() => setInfoVisible(false)}
                onConfirm={() => setInfoVisible(false)}
            />
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: 130,
    },
    headerRow: {
        paddingTop: 4,
    },
    titleBlock: {
        marginBottom: 18,
    },
    iconBadge: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
        marginBottom: 12,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '900',
    },
    subtitle: {
        color: '#AEB8D8',
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
        marginTop: 6,
    },
    promptPanel: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(21, 26, 53, 0.86)',
        padding: 14,
    },
    input: {
        minHeight: 122,
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '600',
        padding: 0,
    },
    promptFooter: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    counter: {
        color: 'rgba(220,228,255,0.56)',
        fontSize: 12,
        fontWeight: '700',
    },
    generateButton: {
        minWidth: 116,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#FF4D6D',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 14,
    },
    generateButtonDisabled: {
        opacity: 0.45,
    },
    generateButtonPressed: {
        transform: [{ scale: 0.98 }],
    },
    generateText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
    },
    examples: {
        marginTop: 14,
        gap: 10,
    },
    exampleChip: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    exampleChipPressed: {
        borderColor: 'rgba(255,77,109,0.55)',
        backgroundColor: 'rgba(255,77,109,0.16)',
    },
    exampleText: {
        color: '#DCE4FF',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '700',
    },
    resultHeader: {
        marginTop: 24,
        marginBottom: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
        paddingTop: 18,
    },
    resultTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
    },
    resultMeta: {
        color: '#AEB8D8',
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 18,
        marginTop: 4,
    },
});

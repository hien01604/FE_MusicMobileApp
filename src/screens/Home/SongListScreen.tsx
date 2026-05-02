import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import { SongListItem } from '../../components/Music/SongListItem';
import { getSongsByType } from '../../services/song.service';
import type { Song } from '../../types';
import type { RootStackParamList } from '../../navigation/type';
import SearchBar from '../../components/common/SearchBar';
import { SAIRA_STENCIL_ONE_REGULAR } from '../../../utils/const';

type SongListScreenProps = NativeStackScreenProps<RootStackParamList, 'SongList'>;

type SongListViewProps = {
    title: string;
    type: 'all' | 'new' | 'trending' | 'continueListening' | 'recommended';
    onBack?: () => void;
};

export function SongListView({ title, type, onBack }: SongListViewProps) {
    const [searchText, setSearchText] = useState('');
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation<any>();
    

    useEffect(() => {
        let isMounted = true;

        const loadSongs = async () => {
            setIsLoading(true);
            const result = await getSongsByType(type);

            if (isMounted) {
                setSongs(result);
                setIsLoading(false);
            }
        };

        void loadSongs();

        return () => {
            isMounted = false;
        };
    }, [type]);

    const filteredSongs = useMemo(() => {
        const normalized = searchText.trim().toLowerCase();

        if (!normalized) {
            return songs;
        }

        return songs.filter(
            (song) =>
                song.title.toLowerCase().includes(normalized) ||
                song.artist.toLowerCase().includes(normalized)
        );
    }, [searchText, songs]);

    const handleSongPress = (song: Song) => {
        console.log('Playing song:', song.title);
    };

    const handleMenuPress = (song: Song) => {
        console.log('Menu pressed for:', song.title);
    };

    return (
        <Layout>

            <View style={styles.container}>
                {/* BACK + TITLE */}
                                <View style={styles.headerRow}>
                                <BackButton onBack={() => navigation.goBack()} />
                                    <Text style={styles.headerTitle}>{title}</Text>
                                    <View style={{ width: 32 }} />
                                </View>
                <View style={styles.headerSection}>
                    <SearchBar
                        value={searchText}
                        onChange={setSearchText}
                        placeholder="Search for songs, artists, playlists..."
                    />
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF4D6D" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredSongs}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <SongListItem
                                song={item}
                                onPress={handleSongPress}
                                onMenuPress={handleMenuPress}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialIcons
                                    name="music-note"
                                    size={48}
                                    color="rgba(255, 255, 255, 0.3)"
                                />
                                <Text style={styles.emptyText}>No songs found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </Layout>
    );
}

export default function SongListScreen({ route, navigation }: SongListScreenProps) {
    const { title, type } = route.params;
    return (
        <SongListView title={title} type={type} onBack={() => navigation.goBack()} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        color: '#FFFFFF',
        marginBottom: 16,
        letterSpacing: 0.5,
        textAlign: "center",
    },
    contentContainer: {
        flex: 1,
    },
    headerSection: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        color: '#FFFFFF',
        marginBottom: 16,
        letterSpacing: 0.5,
        textAlign: "center",
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F1F1',
        borderRadius: 28,
        paddingHorizontal: 14,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        paddingBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 16,
        marginTop: 12,
    },
});

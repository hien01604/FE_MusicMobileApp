import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SearchBar from './SearchBar';
import { searchArtists, mapArtistDtoToOnboardingArtist } from '../../services/artists.service';
import type { PreferenceOption } from '../../constants/preferences';

type Props = {
    visible: boolean;
    onClose: () => void;
    onConfirm: (options: PreferenceOption[]) => void;
    existingIds?: string[];
    existingOptions?: PreferenceOption[];
};

export default function AddArtistModal({
    visible,
    onClose,
    onConfirm,
    existingIds = [],
    existingOptions = [],
}: Props) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<PreferenceOption[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!visible) {
            setQuery('');
            setResults([]);
            setSelectedIds(new Set());
            return;
        }

        if (existingIds.length > 0) {
            setSelectedIds(new Set(existingIds));
        }

        let cancelled = false;
        setLoading(true);

        const timeout = setTimeout(() => {
            searchArtists({ q: query, limit: 40 })
                .then((dtos) => {
                    if (cancelled) return;
                    const options = dtos.map(mapArtistDtoToOnboardingArtist).map((a) => ({ id: a.id, label: a.name }));
                    setResults(options);
                })
                .catch(() => {
                    if (!cancelled) setResults([]);
                })
                .finally(() => {
                    if (!cancelled) setLoading(false);
                });
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [existingIds, visible, query]);

    const toggle = (id: string) => {
        setSelectedIds((cur) => {
            const next = new Set(cur);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleConfirm = () => {
        const resultById = new Map(results.map((artist) => [artist.id, artist]));
        const existingById = new Map(existingOptions.map((artist) => [artist.id, artist]));
        const selected = Array.from(selectedIds)
            .map((id) => resultById.get(id) ?? existingById.get(id))
            .filter((artist): artist is PreferenceOption => Boolean(artist));

        onConfirm(selected);
        onClose();
    };

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => undefined}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add artists</Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <MaterialIcons name="close" size={20} color="#FFFFFF" />
                        </Pressable>
                    </View>

                    <SearchBar value={query} onChange={setQuery} placeholder="Search artists" />

                    {loading ? (
                        <View style={styles.stateContainer}>
                            <ActivityIndicator size="small" color="#FF4D6D" />
                        </View>
                    ) : (
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                            columnWrapperStyle={styles.artistRow}
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={<Text style={styles.emptyText}>No artists found.</Text>}
                            renderItem={({ item }) => {
                                const selected = selectedIds.has(item.id);

                                return (
                                    <Pressable
                                        onPress={() => toggle(item.id)}
                                        style={({ pressed }) => [
                                            styles.artistItem,
                                            selected && styles.itemSelected,
                                            pressed && styles.itemPressed,
                                        ]}
                                    >
                                        <View style={styles.avatarWrap}>
                                            <Image
                                                source={{ uri: `https://picsum.photos/seed/${item.id}/120` }}
                                                style={styles.avatar}
                                            />
                                            <View
                                                style={[
                                                    styles.toggleBadge,
                                                    selected && styles.toggleBadgeSelected,
                                                ]}
                                            >
                                                <MaterialIcons
                                                    name={selected ? 'remove' : 'add'}
                                                    size={16}
                                                    color="#FFFFFF"
                                                />
                                            </View>
                                        </View>
                                        <Text
                                            style={[
                                                styles.itemLabel,
                                                selected && styles.itemLabelSelected,
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                        />
                    )}

                    <View style={styles.footerRow}>
                        <Pressable style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleConfirm}
                            disabled={selectedIds.size === 0}
                            style={({ pressed }) => [
                                styles.confirmButton,
                                pressed && styles.itemPressed,
                                selectedIds.size === 0 && styles.confirmDisabled,
                            ]}
                        >
                            <Text style={styles.confirmText}>Done ({selectedIds.size})</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 18,
        paddingBottom: 28,
        backgroundColor: 'rgba(4, 7, 24, 0.45)',
    },
    sheet: {
        maxHeight: '72%',
        borderRadius: 16,
        backgroundColor: '#151A35',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        padding: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    closeButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateContainer: {
        paddingVertical: 22,
    },
    list: {
        flexGrow: 0,
        marginTop: 8,
    },
    listContent: {
        paddingBottom: 4,
        gap: 12,
    },
    emptyText: {
        color: '#AEB8D8',
        paddingVertical: 16,
        textAlign: 'center',
    },
    artistRow: {
        gap: 10,
    },
    artistItem: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    itemSelected: {
        borderColor: 'rgba(255, 77, 109, 0.62)',
        backgroundColor: 'rgba(255, 77, 109, 0.1)',
    },
    itemPressed: {
        opacity: 0.78,
    },
    avatarWrap: {
        position: 'relative',
    },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    toggleBadge: {
        position: 'absolute',
        right: -2,
        bottom: 1,
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
        borderWidth: 2,
        borderColor: '#151A35',
    },
    toggleBadgeSelected: {
        backgroundColor: '#7CF7B0',
    },
    itemLabel: {
        color: '#FFFFFF',
        fontWeight: '700',
        marginTop: 8,
        minHeight: 34,
        textAlign: 'center',
        fontSize: 12,
    },
    itemLabelSelected: {
        color: '#FFFFFF',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    cancelText: {
        color: '#AEB8D8',
        fontWeight: '700',
    },
    confirmButton: {
        backgroundColor: '#FF4D6D',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    confirmText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    confirmDisabled: {
        opacity: 0.5,
    },
});

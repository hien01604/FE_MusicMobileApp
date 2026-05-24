import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { Playlist } from '../../types';

type Props = {
    visible: boolean;
    playlist: Playlist | null;
    onClose: () => void;
    onRename: (playlist: Playlist) => void;
    onDelete: (playlist: Playlist) => void;
};

export default function PlaylistOptionsModal({
    visible,
    playlist,
    onClose,
    onRename,
    onDelete,
}: Props) {
    const runAction = (action: (playlist: Playlist) => void) => {
        if (!playlist) {
            return;
        }

        onClose();
        action(playlist);
    };

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => undefined}>
                    <View style={styles.handle} />
                    <Text style={styles.title} numberOfLines={1}>
                        {playlist?.name ?? 'Playlist'}
                    </Text>
                    <Text style={styles.subtitle}>Manage this playlist</Text>

                    <Pressable
                        style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                        onPress={() => runAction(onRename)}
                    >
                        <View style={styles.iconWrap}>
                            <MaterialIcons name="drive-file-rename-outline" size={21} color="#FFFFFF" />
                        </View>
                        <View style={styles.optionTextBlock}>
                            <Text style={styles.optionTitle}>Rename</Text>
                            <Text style={styles.optionSubtitle}>Update the playlist name</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.45)" />
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.option,
                            styles.deleteOption,
                            pressed && styles.optionPressed,
                        ]}
                        onPress={() => runAction(onDelete)}
                    >
                        <View style={[styles.iconWrap, styles.deleteIconWrap]}>
                            <MaterialIcons name="delete-outline" size={21} color="#FFFFFF" />
                        </View>
                        <View style={styles.optionTextBlock}>
                            <Text style={[styles.optionTitle, styles.deleteText]}>Delete</Text>
                            <Text style={styles.optionSubtitle}>Remove this playlist only</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.45)" />
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelPressed]}
                        onPress={onClose}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>
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
        backgroundColor: 'rgba(4, 7, 24, 0.52)',
    },
    sheet: {
        borderRadius: 18,
        backgroundColor: '#151A35',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        padding: 14,
    },
    handle: {
        alignSelf: 'center',
        width: 42,
        height: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.18)',
        marginBottom: 14,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
    subtitle: {
        color: '#AEB8D8',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 14,
    },
    option: {
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 12,
        marginBottom: 10,
    },
    deleteOption: {
        backgroundColor: 'rgba(255,77,109,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,77,109,0.24)',
    },
    optionPressed: {
        opacity: 0.78,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4C6EF5',
        marginRight: 12,
    },
    deleteIconWrap: {
        backgroundColor: '#FF4D6D',
    },
    optionTextBlock: {
        flex: 1,
    },
    optionTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    optionSubtitle: {
        color: '#AEB8D8',
        fontSize: 12,
        marginTop: 3,
    },
    deleteText: {
        color: '#FF8EA3',
    },
    cancelButton: {
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginTop: 2,
    },
    cancelPressed: {
        opacity: 0.8,
    },
    cancelText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
});

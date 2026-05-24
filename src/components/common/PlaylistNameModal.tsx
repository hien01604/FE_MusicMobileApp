import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface PlaylistNameModalProps {
    visible: boolean;
    loading?: boolean;
    initialName?: string;
    title?: string;
    description?: string;
    confirmText?: string;
    onCancel: () => void;
    onConfirm: (name: string) => void;
}

export default function PlaylistNameModal({
    visible,
    loading = false,
    initialName = '',
    title = 'Create playlist',
    description = 'Enter a playlist name to save this song.',
    confirmText = 'Create',
    onCancel,
    onConfirm,
}: PlaylistNameModalProps) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (visible) {
            setName(initialName);
        }
    }, [initialName, visible]);

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
            <Pressable style={styles.overlay} onPress={onCancel}>
                <Pressable style={styles.sheet} onPress={() => undefined}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>

                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Playlist name"
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        style={styles.input}
                        autoFocus
                    />

                    <View style={styles.actions}>
                        <Pressable onPress={onCancel} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => onConfirm(name.trim())}
                            disabled={loading || !name.trim()}
                            style={({ pressed }) => [
                                styles.confirmBtn,
                                pressed && !loading && styles.confirmBtnPressed,
                                (loading || !name.trim()) && styles.confirmBtnDisabled,
                            ]}
                        >
                            <Text style={styles.confirmText}>{confirmText}</Text>
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
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: 'rgba(4, 7, 24, 0.55)',
    },
    sheet: {
        borderRadius: 18,
        padding: 18,
        backgroundColor: '#151A35',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
    description: {
        marginTop: 8,
        color: '#AEB8D8',
        lineHeight: 20,
    },
    input: {
        marginTop: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: '#FFFFFF',
        fontSize: 15,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    actions: {
        marginTop: 18,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    cancelText: {
        color: '#AEB8D8',
        fontWeight: '600',
    },
    confirmBtn: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#FF4D6D',
    },
    confirmBtnPressed: {
        opacity: 0.85,
    },
    confirmBtnDisabled: {
        opacity: 0.5,
    },
    confirmText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
});

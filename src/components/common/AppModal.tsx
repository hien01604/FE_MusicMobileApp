import React from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

type Variant = 'default' | 'danger';

interface Props {
    visible: boolean;
    title: string;
    description?: string;

    confirmText?: string;
    cancelText?: string;

    onConfirm: () => void;
    onCancel: () => void;

    loading?: boolean;
    variant?: Variant;
}

export default function AppModal({
    visible,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    loading = false,
    variant = 'default',
}: Props) {
    const isDanger = variant === 'danger';

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* TITLE */}
                    <Text style={styles.title}>{title}</Text>

                    {/* DESCRIPTION */}
                    {description && (
                        <Text style={styles.description}>{description}</Text>
                    )}

                    {/* ACTIONS */}
                    <View style={styles.actions}>
                        <Pressable onPress={onCancel} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </Pressable>

                        <Pressable
                            onPress={onConfirm}
                            style={[
                                styles.confirmBtn,
                                isDanger && styles.dangerBtn,
                            ]}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.confirmText}>
                                    {confirmText}
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: '#1a1d3a',
        borderRadius: 16,
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        color: '#aaa',
        marginBottom: 20,
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    cancelText: {
        color: '#aaa',
    },
    confirmBtn: {
        backgroundColor: '#4c6ef5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    dangerBtn: {
        backgroundColor: '#ff4d6d',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '600',
    },
});
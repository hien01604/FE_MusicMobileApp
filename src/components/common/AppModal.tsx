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
        backgroundColor: 'rgba(4, 7, 24, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 22,
    },
    container: {
        width: '100%',
        backgroundColor: '#151A35',
        borderRadius: 18,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
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
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.07)',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    cancelText: {
        color: '#DCE4FF',
        fontWeight: '700',
    },
    confirmBtn: {
        backgroundColor: '#4c6ef5',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    dangerBtn: {
        backgroundColor: '#ff4d6d',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '600',
    },
});

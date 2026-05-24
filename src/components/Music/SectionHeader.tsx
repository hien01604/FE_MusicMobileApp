import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SectionHeaderProps {
    title: string;
    onSeeAllPress?: () => void;
    onAddPress?: () => void;
    hideViewAll?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    onSeeAllPress,
    onAddPress,
    hideViewAll,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.actions}>
                {onAddPress && (
                    <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
                        <MaterialIcons name="add" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {!hideViewAll && onSeeAllPress && (
                    <TouchableOpacity onPress={onSeeAllPress}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAll: {
        color: '#ff4d6d',
        fontSize: 14,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
    },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SectionHeaderProps {
    title: string;
    onSeeAllPress?: () => void;
    hideViewAll?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    onSeeAllPress,
    hideViewAll,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            {!hideViewAll && onSeeAllPress && (
                <TouchableOpacity onPress={onSeeAllPress}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            )}
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
});
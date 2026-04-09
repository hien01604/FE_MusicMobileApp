import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
    title: string;
    // Thêm dòng này vào: nó là một hàm không nhận tham số và không trả về giá trị
    onSeeAll?: () => void;
}
export const SectionHeader = ({ title, onSeeAll }: SectionHeaderProps) => (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    seeAll: { color: '#ff4d6d', fontSize: 14 },
});
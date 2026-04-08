import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity>
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
import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
    title: string;
    icon: string; 
    color: string; 
}

// src/components/Music/CategoryCard.tsx

export const CategoryCard = ({ title, icon, color }: Props) => {
    return (
        <TouchableOpacity style={[styles.card, { backgroundColor: color }]}>
            <View style={styles.content}>
                <MaterialIcons name={icon as any} size={22} color="#fff" />
                <Text
                    style={styles.text}
                    numberOfLines={1}
                    // Tự động thu nhỏ cỡ chữ nếu text quá dài
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.75}
                >
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '48.5%',
        height: 60,
        borderRadius: 12,
        marginTop: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12, // Giảm nhẹ padding để Text có thêm không gian
    },
    text: {
        color: '#fff',
        marginLeft: 8, // Giảm khoảng cách icon-text một chút
        fontWeight: '600',
        fontSize: 14,
        flex: 1, // Ép text chiếm toàn bộ không gian còn lại để tự thu nhỏ
    },
});
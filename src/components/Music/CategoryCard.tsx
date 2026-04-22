import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryCardProps {
    title: string;
    icon?: string;
    onPress?: () => void;
}

export const CategoryCard = ({ title, icon = 'music-note', onPress }: CategoryCardProps) => {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
            <LinearGradient
                colors={['#4c3fa2', '#2a215c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconWrapper}
            >

                <View style={styles.iconGlow}>
                    <MaterialIcons
                        name={icon as keyof typeof MaterialIcons.glyphMap}
                        size={22}
                        color="#fff"
                    />
                </View>
            </LinearGradient>

            <View style={styles.textSection}>
                <Text
                    style={styles.text}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.85}
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
        height: 62,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 14,
        borderWidth: 1,
        backgroundColor: 'rgba(36, 36, 43, 0.7)',
    },
    iconWrapper: {
        width: 54,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 20,
        position: 'relative',
    },

    iconGlow: {
        zIndex: 2,
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    textSection: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 8,
        justifyContent: 'center',
    },
    text: {
        color: '#F2F2F2',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'capitalize',
    },
});
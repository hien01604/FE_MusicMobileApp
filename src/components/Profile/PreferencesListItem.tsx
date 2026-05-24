import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PreferencesListItemProps {
    title: string;
    onPress: () => void;
}

const PreferencesListItem: React.FC<PreferencesListItemProps> = ({
    title,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.6}
        >
            <Text style={styles.title}>{title}</Text>
            <Ionicons
                name="chevron-forward"
                size={20}
                color="#FF006B"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1f3a',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginTop: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default PreferencesListItem;

import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface PreferencesListItemProps {
    title: string;
    subtitle?: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
}

const PreferencesListItem: React.FC<PreferencesListItemProps> = ({
    title,
    subtitle,
    icon = 'chevron-right',
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.6}
        >
            <View style={styles.iconWrap}>
                <MaterialIcons name={icon} size={20} color="#FF6F86" />
            </View>
            <View style={styles.textBlock}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? (
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {subtitle}
                    </Text>
                ) : null}
            </View>
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
        backgroundColor: 'rgba(26, 31, 58, 0.78)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginTop: 12,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 77, 109, 0.12)',
        marginRight: 12,
    },
    textBlock: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    subtitle: {
        color: '#AEB8D8',
        fontSize: 12,
        marginTop: 4,
    },
});

export default PreferencesListItem;

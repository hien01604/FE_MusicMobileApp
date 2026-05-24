import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const HEADER_TABS = ['Home', 'Library', 'Search', 'Profile'] as const;

export type HeaderTab = (typeof HEADER_TABS)[number];

interface HeaderTabsProps {
    activeTab: HeaderTab;
    onTabPress: (tab: HeaderTab) => void;
}

const HeaderTabsComponent = ({ activeTab, onTabPress }: HeaderTabsProps) => {
    return (
        <View style={styles.headerTabs}>
            {HEADER_TABS.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => onTabPress(tab)}
                    style={[styles.tab, tab === activeTab && styles.activeTab]}
                >
                    <Text style={[styles.tabText, tab === activeTab && styles.activeTabText]}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export const HeaderTabs = memo(HeaderTabsComponent);

const styles = StyleSheet.create({
    headerTabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20
    },
    activeTab: {
        backgroundColor: '#1e203d'
    },
    tabText: {
        color: '#888',
        fontWeight: '600'
    },
    activeTabText: {
        color: '#ff4d6d'
    },
});

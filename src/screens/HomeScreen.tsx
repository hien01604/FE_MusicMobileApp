import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { HeaderTab, HeaderTabs } from '../components/HeaderTabs';
import Layout from '../components/Layout';
import { HomeTab } from './HomeTab';
import { RadioTab } from './RadioTab';
import { ProfileTab } from './ProfileTab';
import { SearchTab } from './SearchTab';

const TAB_COMPONENTS: Record<HeaderTab, React.ComponentType> = {
    Radio: RadioTab,
    Home: HomeTab,
    Profile: ProfileTab,
    Search: SearchTab,
};

const HomeScreen = () => {
    const [activeTab, setActiveTab] = useState<HeaderTab>('Home');
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const handleTabPress = useCallback(
        (tab: HeaderTab) => {
            if (tab !== activeTab) {
                setActiveTab(tab);
            }
        },
        [activeTab]
    );

    const ActiveTabComponent = useMemo(() => TAB_COMPONENTS[activeTab], [activeTab]);

    useEffect(() => {
        fadeAnim.setValue(0.3);
        slideAnim.setValue(8);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start();
    }, [activeTab, fadeAnim, slideAnim]);

    return (
        <Layout>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <HeaderTabs activeTab={activeTab} onTabPress={handleTabPress} />
                </View>

                <Animated.View
                    key={activeTab}
                    style={[
                        styles.contentContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <ActiveTabComponent />
                </Animated.View>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        zIndex: 5,
    },
    contentContainer: {
        flex: 1,
    },
});

export default HomeScreen;
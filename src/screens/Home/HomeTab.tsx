import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { categories, songs } from '../../data/mockData';
import { CategoryCard } from '../../components/Music/CategoryCard';
import { SectionHeader } from '../../components/Music/SectionHeader';
import HorizontalList from '../../components/Music/HorizontalList';
import { SongCard } from '../../components/Music/SongCard';

export const HomeTab = () => {
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentBottom}
        >
            {/* 1. Grid Danh mục (Liked, Playlists,...) */}
            <View style={styles.grid}>
                {categories.map((item) => (
                    <CategoryCard
                        key={item.id}
                        title={item.title}
                        icon={item.icon}
                        color={item.color}
                    />
                ))}
            </View>

            {/* 2. Section: New Songs */}
            <View style={styles.section}>
                <SectionHeader title="New Songs" onSeeAll={() => { }} />
                <HorizontalList
                    data={songs}
                    renderItem={({ item }) => <SongCard item={item} />}
                />
            </View>

            {/* 3. Section: Recommended for you */}
            <View style={styles.section}>
                <SectionHeader title="Recommended for you" onSeeAll={() => { }} />
                <HorizontalList
                    data={songs}
                    renderItem={({ item }) => <SongCard item={item} />}
                />
            </View>

            {/* 4. Section: Popular Artist */}
            <View style={styles.section}>
                <SectionHeader title="Popular Artist" onSeeAll={() => { }} />
                <HorizontalList
                    data={songs}
                    renderItem={({ item }) => <SongCard item={item} />}
                />
            </View>
        </ScrollView>
    );
};

// src/screens/main/HomeTab.tsx

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Đảm bảo con số này khớp hoàn toàn với lề của HeaderBar phía trên
        paddingHorizontal: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // space-between sẽ đẩy 2 card ra sát 2 mép của paddingHorizontal: 16
        justifyContent: 'space-between',
        marginTop: 4, 
    },
    section: {
        marginTop: 25,
    },
    contentBottom: {
        paddingBottom: 100,
    },
});
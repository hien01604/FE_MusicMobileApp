import React from 'react';
import { ScrollView, StyleSheet, View, StatusBar } from 'react-native';
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
            // Thêm padding dưới để không bị che khuất bởi trình điều khiển nhạc (nếu có)
            contentContainerStyle={styles.contentBottom}
        >
            {/* Đảm bảo StatusBar hòa hợp với tone tối */}
            <StatusBar barStyle="light-content" />

            {/* 1. Grid Danh mục: Sử dụng gap để tạo khoảng cách đều giữa các card */}
            <View style={styles.grid}>
                {categories.map((item) => (
                    <CategoryCard
                        key={item.id}
                        title={item.title}
                        icon={item.icon}
                    />
                ))}
            </View>

            {/* 2. Các Section bài hát */}
            <View style={styles.section}>
                <SectionHeader title="New Songs" onSeeAll={() => { }} />
                <HorizontalList
                    data={songs}
                    renderItem={({ item }) => <SongCard item={item} />}
                />
            </View>

            <View style={styles.section}>
                <SectionHeader title="Recommended for you" onSeeAll={() => { }} />
                <HorizontalList
                    data={songs}
                    renderItem={({ item }) => <SongCard item={item} />}
                />
            </View>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    section: {
        marginTop: 30, 
    },
    contentBottom: {
        paddingBottom: 120,
    },
});
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from '../../components/common/BackButton';
import Layout from '../../components/common/Layout';
import { getFollowedArtists } from '../../services/followedArtists.storage';
import { subscribeFollowedArtists } from '../../services/artistFollow.events';
import type { Artist } from '../../types';
import type { RootStackParamList } from '../../navigation/type';
import { SAIRA_STENCIL_ONE_REGULAR } from '../../../utils/const';

type Props = NativeStackScreenProps<RootStackParamList, 'FollowedArtists'>;

export default function FollowedArtistsScreen({ navigation }: Props) {
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        void getFollowedArtists().then(setArtists);
        return subscribeFollowedArtists(setArtists);
    }, []);

    return (
        <Layout>
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackButton onBack={() => navigation.goBack()} />
                    <Text style={styles.sectionTitle}>Followed Artists</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <FlatList
                    data={artists}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    columnWrapperStyle={styles.artistRow}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No followed artists yet.</Text>
                    }
                    renderItem={({ item }) => (
                        <Pressable
                            style={({ pressed }) => [
                                styles.artistItem,
                                pressed && styles.artistItemPressed,
                            ]}
                            onPress={() =>
                                navigation.navigate('ArtistDetail', { artistId: item.id })
                            }
                        >
                            <Image source={{ uri: item.image }} style={styles.avatar} />
                            <Text style={styles.artistName} numberOfLines={2}>
                                {item.name}
                            </Text>
                        </Pressable>
                    )}
                />
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    sectionTitle: {
        color: '#FFFFFF',
        flex: 1,
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        fontSize: 22,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 32,
    },
    listContent: {
        paddingTop: 12,
        paddingBottom: 120,
        gap: 14,
    },
    artistRow: {
        gap: 10,
    },
    artistItem: {
        flex: 1,
        alignItems: 'center',
        minHeight: 132,
        paddingHorizontal: 4,
        paddingVertical: 8,
    },
    artistItemPressed: {
        opacity: 0.78,
    },
    avatar: {
        width: 82,
        height: 82,
        borderRadius: 41,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    artistName: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 9,
        minHeight: 34,
        textAlign: 'center',
    },
    emptyText: {
        color: '#AEB8D8',
        textAlign: 'center',
        paddingVertical: 32,
    },
});

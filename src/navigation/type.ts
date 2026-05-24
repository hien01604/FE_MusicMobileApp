import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import type { SongListSource } from "../types";
import type { PreferenceOption, PreferenceTab } from "../constants/preferences";

/* ================= ROOT STACK ================= */

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    SignUp: {
        artists?: PreferenceOption[];
        genres?: PreferenceOption[];
        moods?: PreferenceOption[];
        artistIds?: string[];
        // optional prefilled form values when returning from welcome
        username?: string;
        email?: string;
        password?: string;
    } | undefined;
    ForgotPassword: undefined;
    ResetPassword: { token?: string } | undefined;
    Welcome_1: undefined;
    Welcome_2: {
        username?: string;
        email?: string;
        password?: string;
    } | undefined;
    Welcome_3: {
        artists?: PreferenceOption[];
        username?: string;
        email?: string;
        password?: string;
    } | undefined;
    Welcome_4: {
        artists?: PreferenceOption[];
        genres?: PreferenceOption[];
        moods?: PreferenceOption[];
        username?: string;
        email?: string;
        password?: string;
    } | undefined;
    Home: undefined;
    Library: undefined;
    Profile: undefined;
    Search: undefined;
    AIVibeMix: undefined;
    TasteProfile: undefined;
    Player: { songId?: string } | undefined;
    SongList: SongListSource;
    Playlists: undefined;
    PlaylistDetail: { playlistId: string; playlistName?: string };
    EditProfile: undefined;
    Artists: undefined;
    FollowedArtists: undefined;
    ArtistDetail: { artistId: string };
    Preferences: { initialTab?: PreferenceTab } | undefined;
};

/* ================= GENERIC HELPERS ================= */

// Dùng khi cần
export type StackNavigation<T extends keyof RootStackParamList> =
    NativeStackNavigationProp<RootStackParamList, T>;

export type StackRoute<T extends keyof RootStackParamList> =
    RouteProp<RootStackParamList, T>;

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import type { SongListType } from "../data/songLibraryData";

/* ================= ROOT STACK ================= */

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    Welcome_1: undefined;
    Welcome_2: undefined;
    Welcome_3: undefined;
    Welcome_4: undefined;
    Home: undefined;
    Library: undefined;
    Profile: undefined;
    Search: undefined;
    Player: undefined;
    SongList: { title: string; type: SongListType };
};

/* ================= GENERIC HELPERS ================= */

// Dùng khi cần
export type StackNavigation<T extends keyof RootStackParamList> =
    NativeStackNavigationProp<RootStackParamList, T>;

export type StackRoute<T extends keyof RootStackParamList> =
    RouteProp<RootStackParamList, T>;
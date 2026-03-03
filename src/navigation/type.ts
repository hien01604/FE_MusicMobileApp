import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

/* ================= ROOT STACK ================= */

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    Home: undefined;
};

/* ================= GENERIC HELPERS ================= */

// Dùng khi cần
export type StackNavigation<T extends keyof RootStackParamList> =
    NativeStackNavigationProp<RootStackParamList, T>;

export type StackRoute<T extends keyof RootStackParamList> =
    RouteProp<RootStackParamList, T>;
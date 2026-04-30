import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/Loading/SplashScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import SongListScreen from "../screens/Home/SongListScreen";
import WelcomeScreen_1 from "../screens/Welcome/WelcomeScreen_1";
import WelcomeScreen_2 from "../screens/Welcome/WelcomeScreen_2";
import WelcomeScreen_3 from "../screens/Welcome/WelcomeScreen_3";
import WelcomeScreen_4 from "../screens/Welcome/WelcomeScreen_4";
import { ProfileTab } from "../screens/Home/ProfileTab";
import { SearchTab } from "../screens/Home/SearchTab";
import PlayerScreen from "../screens/Player/PlayerScreen";
import MiniPlayer from "../components/Player/MiniPlayer";

import { useAuth } from "../hooks/useAuth";
import type { RootStackParamList } from "./type";
import { AUTH_UI_ONLY_MODE } from "../../utils/const";
import { usePlayerStore } from "../store/playerStore";

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function AppNavigator() {
    const { isAuthenticated } = useAuth();
    const [isSplashFinished, setSplashFinished] = React.useState(false);
    const initPlayerSync = usePlayerStore((state) => state.initPlayerSync);

    React.useEffect(() => {
        void initPlayerSync();
    }, [initPlayerSync]);

    if (!isSplashFinished) {
        return (
            <SplashScreen
                showLoadingText={true}
                onFinish={() => setSplashFinished(true)}
            />
        );
    }

    const shouldShowAuthFlow = AUTH_UI_ONLY_MODE || !isAuthenticated;

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName={AUTH_UI_ONLY_MODE ? "Welcome_1" : isAuthenticated ? "Home" : "Welcome_1"}
                screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            >
                {shouldShowAuthFlow ? (
                    <>
                        <Stack.Screen name="Welcome_1" component={WelcomeScreen_1} />
                        <Stack.Screen name="Welcome_2" component={WelcomeScreen_2} />
                        <Stack.Screen name="Welcome_3" component={WelcomeScreen_3} />
                        <Stack.Screen name="Welcome_4" component={WelcomeScreen_4} />

                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="SongList" component={SongListScreen} />
                        <Stack.Screen name="Profile" component={ProfileTab} />
                        <Stack.Screen name="Search" component={SearchTab} />
                        <Stack.Screen
                            name="Player"
                            component={PlayerScreen}
                            options={{ animation: "slide_from_bottom" }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="SongList" component={SongListScreen} />
                        <Stack.Screen
                            name="Player"
                            component={PlayerScreen}
                            options={{ animation: "slide_from_bottom" }}
                        />
                    </>
                )}
            </Stack.Navigator>

            <MiniPlayer
                onOpenPlayer={() => {
                    if (navigationRef.isReady()) {
                        navigationRef.navigate("Player");
                    }
                }}
            />
        </NavigationContainer>
    );
}
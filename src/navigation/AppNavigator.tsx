import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/Loading/SplashScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/Auth/ResetPasswordScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import SongListScreen from "../screens/Home/SongListScreen";
import WelcomeScreen_1 from "../screens/Welcome/WelcomeScreen_1";
import WelcomeScreen_2 from "../screens/Welcome/WelcomeScreen_2";
import WelcomeScreen_3 from "../screens/Welcome/WelcomeScreen_3";
import ProfileTab from "../screens/Home/ProfileTab";
import { SearchTab } from "../screens/Home/SearchTab";
import PlayerScreen from "../screens/Player/PlayerScreen";
import MiniPlayer from "../components/Player/MiniPlayer";
import EditProfileScreen from "../screens/Home/EditProfileScreen";
import PreferencesScreen from "../screens/Home/PreferencesScreen";
import ArtistDetailScreen from "../screens/Artist/ArtistDetailScreen";
import ArtistsScreen from "../screens/Artist/ArtistsScreen";
import FollowedArtistsScreen from "../screens/Artist/FollowedArtistsScreen";
import PlaylistDetailScreen from "../screens/Home/PlaylistDetailScreen";
import PlaylistsScreen from "../screens/Home/PlaylistsScreen";
import AIVibeMixScreen from "../screens/Home/AIVibeMixScreen";
import TasteProfileScreen from "../screens/Home/TasteProfileScreen";

import { useAuthContext } from "../contexts/AuthContext";
import type { RootStackParamList } from "./type";
import { usePlayerStore } from "../store/playerStore";
import { hasOpenedAppBefore, markAppOpened } from "../services/appLaunch.storage";

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuthContext(); // 🔥 FIX
    const [isSplashFinished, setSplashFinished] = React.useState(false);
    const [launchChecked, setLaunchChecked] = React.useState(false);
    const [isFirstOpen, setIsFirstOpen] = React.useState(false);
    const [currentRouteName, setCurrentRouteName] = React.useState<string | undefined>();
    const initPlayerSync = usePlayerStore((state) => state.initPlayerSync);

    React.useEffect(() => {
        void initPlayerSync();
    }, [initPlayerSync]);

    React.useEffect(() => {
        let mounted = true;

        const loadLaunchState = async () => {
            const openedBefore = await hasOpenedAppBefore();

            if (!openedBefore) {
                await markAppOpened();
            }

            if (mounted) {
                setIsFirstOpen(!openedBefore);
                setLaunchChecked(true);
            }
        };

        void loadLaunchState();

        return () => {
            mounted = false;
        };
    }, []);

    // loading + splash
    if (isLoading || !launchChecked || !isSplashFinished) {
        return (
            <SplashScreen
                showLoadingText={true}
                onFinish={() => setSplashFinished(true)}
            />
        );
    }

    const shouldShowAuthFlow = !isAuthenticated;
    const authInitialRouteName = "Welcome_1";

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                setCurrentRouteName(navigationRef.getCurrentRoute()?.name);
            }}
            onStateChange={() => {
                setCurrentRouteName(navigationRef.getCurrentRoute()?.name);
            }}
        >
            <Stack.Navigator
                key={shouldShowAuthFlow ? "auth-flow" : "app-flow"}
                initialRouteName={shouldShowAuthFlow ? authInitialRouteName : "Home"}
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

                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="SongList" component={SongListScreen} />
                        <Stack.Screen name="Playlists" component={PlaylistsScreen} />
                        <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
                        <Stack.Screen name="Profile" component={ProfileTab} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                        <Stack.Screen name="Preferences" component={PreferencesScreen} />
                        <Stack.Screen name="Artists" component={ArtistsScreen} />
                        <Stack.Screen name="FollowedArtists" component={FollowedArtistsScreen} />
                        <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
                        <Stack.Screen name="Search" component={SearchTab} />
                        <Stack.Screen name="AIVibeMix" component={AIVibeMixScreen} />
                        <Stack.Screen name="TasteProfile" component={TasteProfileScreen} />
                        <Stack.Screen
                            name="Player"
                            component={PlayerScreen}
                            options={{ animation: "slide_from_bottom" }}
                        />
                    </>
                )}
            </Stack.Navigator>

            {/* chỉ show player khi đã login */}
            {isAuthenticated && currentRouteName !== "Player" && (
                <MiniPlayer
                    onOpenPlayer={() => {
                        if (navigationRef.isReady()) {
                            navigationRef.navigate("Player");
                        }
                    }}
                />
            )}
        </NavigationContainer>
    );
}

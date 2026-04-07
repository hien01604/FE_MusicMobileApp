import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen_1 from "../screens/WelcomeScreen_1";
import WelcomeScreen_2 from "../screens/WelcomeScreen_2";
import WelcomeScreen_3 from "../screens/WelcomeScreen_3";
import WelcomeScreen_4 from "../screens/WelcomeScreen_4";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";

import { useAuth } from "../hooks/useAuth";
import type { RootStackParamList } from "./type";
import { AUTH_UI_ONLY_MODE } from "../../utils/const";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { isAuthenticated } = useAuth();
    const [isSplashFinished, setSplashFinished] = React.useState(false);

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
        <NavigationContainer>
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
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="Search" component={SearchScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Home" component={HomeScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen_1 from "../screens/WelcomeScreen_1";


import { useAuth } from "../hooks/useAuth";
import type { RootStackParamList } from "./type";
import WelcomeScreen_2 from "../screens/WelcomeScreen_2";
import WelcomeScreen_3 from "../screens/WelcomeScreen_3";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuth();
    const [isSplashFinished, setSplashFinished] = React.useState(false);

    if (!isSplashFinished) {
        return (
            <SplashScreen
                showLoadingText={true}
                onFinish={() => setSplashFinished(true)}
            />
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={isAuthenticated ? "Home" : "Login"}
                screenOptions={{ headerShown: false, animation: "slide_from_right" }}
            >
                <Stack.Screen name="Welcome_1" component={WelcomeScreen_1} />
                <Stack.Screen name="Welcome_2" component={WelcomeScreen_2} />
                <Stack.Screen name="Welcome_3" component={WelcomeScreen_3} />

                {isAuthenticated ? (
                    <Stack.Screen name="Home" component={HomeScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
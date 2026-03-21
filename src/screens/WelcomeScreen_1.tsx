import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import WelcomeLayout from "../components/Welcome/WelcomeLayout";
import WelcomeComponent from "../components/Welcome/Welcome_1";

import { RootStackParamList } from "../navigation/type";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Welcome_1"
>;

export default function WelcomeScreen_1() {
    const navigation = useNavigation<NavigationProp>();

    const handleStart = () => {
        navigation.navigate("Welcome_2");
    };
    const onLogin = () => {
        navigation.navigate("Login");
    };

    return (
        <WelcomeLayout>
            <WelcomeComponent onStart={handleStart} onLogin={onLogin} />
        </WelcomeLayout>
    );
}
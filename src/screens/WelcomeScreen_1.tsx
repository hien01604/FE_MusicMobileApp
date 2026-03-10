import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import WelcomeLayout from "../components/Welcome/WelcomeLayout";
import WelcomeComponent from "../components/Welcome/WelcomeComponent";

import { RootStackParamList } from "../navigation/type";
import Logo from "../components/Logo";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Welcome_1"
>;

export default function WelcomeScreen() {
    const navigation = useNavigation<NavigationProp>();

    const handleStart = () => {
        // navigation.navigate("Welcome_2");
    };

    return (
        <WelcomeLayout>
            <WelcomeComponent onStart={handleStart} />
        </WelcomeLayout>
    );
}
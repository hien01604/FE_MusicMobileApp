import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import WelcomeLayout from "../components/Welcome/WelcomeLayout";
import WelcomeComponent from "../components/Welcome/Welcome_2";

import { RootStackParamList } from "../navigation/type";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Welcome_2"
>;

export default function WelcomeScreen_2() {
    const navigation = useNavigation<NavigationProp>();

    const handleContinue = () => {
        // navigation.navigate("Welcome_3");
    };

    return (
        <WelcomeLayout>
            <WelcomeComponent onContinue={handleContinue} />
        </WelcomeLayout>
    );
}
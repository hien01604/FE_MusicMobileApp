import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import WelcomeLayout from "../../components/Welcome/WelcomeLayout";
import WelcomeComponent from "../../components/Welcome/Welcome_3";

import { RootStackParamList } from "../../navigation/type";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Welcome_3"
>;

export default function WelcomeScreen_3() {
    const navigation = useNavigation<NavigationProp>();

    const handleContinue = () => {
        navigation.navigate("Welcome_4");
    };

    return (
        <WelcomeLayout>
            <WelcomeComponent onContinue={handleContinue} />
        </WelcomeLayout>
    );
}
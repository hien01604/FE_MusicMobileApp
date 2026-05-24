import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import WelcomeLayout from "../../components/Welcome/WelcomeLayout";
import WelcomeComponent from "../../components/Welcome/Welcome_2";

import { RootStackParamList } from "../../navigation/type";
import type { PreferenceOption } from "../../constants/preferences";
import type { StackRoute } from "../../navigation/type";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Welcome_2"
>;

export default function WelcomeScreen_2() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<StackRoute<"Welcome_2">>();

    const handleContinue = (artists: PreferenceOption[]) => {
        navigation.navigate("Welcome_3", {
            artists,
            username: route.params?.username,
            email: route.params?.email,
            password: route.params?.password,
        });
    };

    const handleSkip = () => {
        navigation.navigate("Welcome_3", {
            artists: [],
            username: route.params?.username,
            email: route.params?.email,
            password: route.params?.password,
        });
    };

    return (
        <WelcomeLayout>
            <WelcomeComponent onContinue={handleContinue} onSkip={handleSkip} />
        </WelcomeLayout>
    );
}

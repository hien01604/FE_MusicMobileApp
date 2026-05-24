import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import WelcomeLayout from "../../components/Welcome/WelcomeLayout";
import WelcomeComponent from "../../components/Welcome/Welcome_4";

import { RootStackParamList, StackRoute } from "../../navigation/type";
import type { PreferenceOption } from "../../constants/preferences";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Welcome_4"
>;

export default function WelcomeScreen_4() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<StackRoute<"Welcome_4">>();

    const handleContinue = (moods: PreferenceOption[] = []) => {
        navigation.navigate("SignUp", {
            artists: route.params?.artists ?? [],
            genres: route.params?.genres ?? [],
            moods,
            username: route.params?.username,
            email: route.params?.email,
            password: route.params?.password,
        });
    };

    return (
        <WelcomeLayout>
            <WelcomeComponent
                onContinue={handleContinue}
                onSkip={() => handleContinue([])}
            />
        </WelcomeLayout>
    );
}

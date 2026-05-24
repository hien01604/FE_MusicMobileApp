import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import WelcomeLayout from "../../components/Welcome/WelcomeLayout";
import WelcomeComponent from "../../components/Welcome/Welcome_3";

import { RootStackParamList, StackRoute } from "../../navigation/type";
import type { PreferenceOption } from "../../constants/preferences";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Welcome_3"
>;

export default function WelcomeScreen_3() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<StackRoute<"Welcome_3">>();

    const handleContinue = (genres: PreferenceOption[]) => {
        navigation.navigate("SignUp", {
            artists: route.params?.artists ?? [],
            genres,
            moods: [],
            username: route.params?.username,
            email: route.params?.email,
            password: route.params?.password,
        });
    };

    return (
        <WelcomeLayout>
            <WelcomeComponent onContinue={handleContinue} />
        </WelcomeLayout>
    );
}

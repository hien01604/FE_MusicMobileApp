import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import WelcomeLayout from "../../components/Welcome/WelcomeLayout";
import WelcomeComponent from "../../components/Welcome/Welcome_4";

import { RootStackParamList } from "../../navigation/type";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Welcome_4"
>;

export default function WelcomeScreen_4() {
    const navigation = useNavigation<NavigationProp>();

    const handleContinue = (artistIds: string[] = []) => {
        navigation.navigate("SignUp", { artistIds });
    };

    return (
        <WelcomeLayout>
            <WelcomeComponent onContinue={handleContinue} />
        </WelcomeLayout>
    );
}

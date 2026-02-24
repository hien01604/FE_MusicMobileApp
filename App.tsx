import { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import SplashScreen from "./src/screens/SplashScreen";
import { useFonts } from "expo-font";
import { ORBITRON_BOLD } from "../music-mobile/utils/const";

export default function App() {
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    [ORBITRON_BOLD]: require("./assets/font/Orbitron/static/Orbitron-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(() => {
        setReady(true);
      }, 2500);
    }
  }, [fontsLoaded]);

  if (!ready) {
    return <SplashScreen />;
  }

  return <AppNavigator />;
}
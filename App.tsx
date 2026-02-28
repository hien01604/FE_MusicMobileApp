import { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import SplashScreen from "./src/screens/SplashScreen";
import { useFonts } from "expo-font";
import { OPENSANS_REGULAR, SAIRA_STENCIL_ONE_REGULAR } from "./utils/const";

export default function App() {
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    [OPENSANS_REGULAR]: require("./assets/font/OpenSan/static/OpenSans-Regular.ttf"),
    [SAIRA_STENCIL_ONE_REGULAR]: require("./assets/font/Saira_Stencil_One/SairaStencilOne-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setReady(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }

  if (!ready) {
    return <SplashScreen />;
  }

  return <AppNavigator />;
}
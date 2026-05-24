import AppNavigator from "./src/navigation/AppNavigator";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { OPENSANS_REGULAR, SAIRA_STENCIL_ONE_REGULAR } from "./utils/const";
import { AuthProvider } from "./src/contexts/AuthContext";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getApiHealth } from "./src/services/app.service";

export default function App() {
  useEffect(() => {
    void getApiHealth().catch(() => undefined);
  }, []);

  const [fontsLoaded] = useFonts({
    [OPENSANS_REGULAR]: require("./assets/font/OpenSan/static/OpenSans-Regular.ttf"),
    [SAIRA_STENCIL_ONE_REGULAR]: require("./assets/font/Saira_Stencil_One/SairaStencilOne-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

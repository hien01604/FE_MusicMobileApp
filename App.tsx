import AppNavigator from "./src/navigation/AppNavigator";
import { useFonts } from "expo-font";
import { OPENSANS_REGULAR, SAIRA_STENCIL_ONE_REGULAR } from "./utils/const";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    [OPENSANS_REGULAR]: require("./assets/font/OpenSan/static/OpenSans-Regular.ttf"),
    [SAIRA_STENCIL_ONE_REGULAR]: require("./assets/font/Saira_Stencil_One/SairaStencilOne-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
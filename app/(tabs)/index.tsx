import { SafeAreaView } from "react-native-safe-area-context";
import Home from "@/components/layout/Home/Home";
import { theme } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background.default }}
    >
      <Home />
    </SafeAreaView>
  );
}

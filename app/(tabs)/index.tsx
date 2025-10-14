import Home from "@/components/layout/Home/Home";
import { theme } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabOneScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.default }} >
      <Home />
    </SafeAreaView>
  );
}

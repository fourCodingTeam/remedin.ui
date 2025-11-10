import { SafeAreaView } from "react-native-safe-area-context";
import { Health } from "@/components/layout/Health";
import { theme } from "@/constants/theme";

export default function SaudeScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background.default }}
    >
      <Health />
    </SafeAreaView>
  );
}

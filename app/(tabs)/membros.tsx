import { SafeAreaView } from "react-native-safe-area-context";
import { Members } from "@/components/layout";
import { theme } from "@/constants/theme";

export default function MembrosScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background.default }}
    >
      <Members />
    </SafeAreaView>
  );
}

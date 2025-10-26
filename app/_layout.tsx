import { useUserStore } from "@/stores";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    FigtreeBlack: require("@/assets/fonts/Figtree-Black.ttf"),
    FigtreeBlackItalic: require("@/assets/fonts/Figtree-BlackItalic.ttf"),
    FigtreeBold: require("@/assets/fonts/Figtree-Bold.ttf"),
    FigtreeBoldItalic: require("@/assets/fonts/Figtree-BoldItalic.ttf"),
    FigtreeExtraBold: require("@/assets/fonts/Figtree-ExtraBold.ttf"),
    FigtreeExtraBoldItalic: require("@/assets/fonts/Figtree-ExtraBoldItalic.ttf"),
    FigtreeItalic: require("@/assets/fonts/Figtree-Italic.ttf"),
    FigtreeLight: require("@/assets/fonts/Figtree-Light.ttf"),
    FigtreeLightItalic: require("@/assets/fonts/Figtree-LightItalic.ttf"),
    FigtreeMedium: require("@/assets/fonts/Figtree-Medium.ttf"),
    FigtreeMediumItalic: require("@/assets/fonts/Figtree-MediumItalic.ttf"),
    FigtreeRegular: require("@/assets/fonts/Figtree-Regular.ttf"),
    FigtreeSemiBold: require("@/assets/fonts/Figtree-SemiBold.ttf"),
    FigtreeSemiBoldItalic: require("@/assets/fonts/Figtree-SemiBoldItalic.ttf"),
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // if (showSplash) {
  //   return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  // }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { isLoggedIn } = useUserStore();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

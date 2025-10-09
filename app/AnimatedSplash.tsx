import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from "react-native-reanimated";

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const eyesOpacity = useSharedValue(0);
  const mascotScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const bgColor = useSharedValue(0);

  useEffect(() => {
    eyesOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    bgColor.value = withDelay(1600, withTiming(1, { duration: 500 }));
    mascotScale.value = withDelay(1800, withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) }));
    textOpacity.value = withDelay(2600, withTiming(1, { duration: 600 }));
    
    setTimeout(() => (onFinish)(), 4000);
  }, []);

  const animatedBg = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value === 0 ? "#000" : "#00FF66",
  }));

  const eyesStyle = useAnimatedStyle(() => ({
    opacity: eyesOpacity.value,
  }));

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mascotScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedBg]}>
      <Animated.View style={[styles.eyesContainer, eyesStyle]}>
        <View style={styles.eye} />
        <View style={styles.eye} />
      </Animated.View>

      <Animated.View style={[textStyle]}>
        <Text style={styles.text}>Olá!</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eyesContainer: {
    flexDirection: "row",
    position: "absolute",
  },
  eye: {
    width: 25,
    height: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginHorizontal: 10,
  },
  mascotContainer: {
    position: "absolute",
  },
  text: {
    marginTop: 20,
    fontSize: 28,
    fontFamily: "FigtreeBold",
    color: "white",
  },
});

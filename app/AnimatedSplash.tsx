import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { StyledText } from "@/components/ui";
import { theme } from "@/constants/theme";

const BLINK_TO_FADE_DELAY = 1100;
const BACKGROUND_FADE_DURATION = 800;
const TEXT_FADE_DELAY = 300;
const TEXT_FADE_DURATION = 500;
const TEXT_SWITCH_DELAY = 2300;
const FINISH_DELAY = 2200;

const animationSource = require("@/assets/images/auth/remedinAnimation.json");
const staticSource = require("@/assets/images/auth/remedinStatic.png");

const RadialGradientBackground = () => (
  <Svg height="100%" preserveAspectRatio="xMidYMid slice" width="100%">
    <Defs>
      <RadialGradient
        cx="50%"
        cy="120%"
        fx="50%"
        fy="120%"
        id="splashGradient"
        r="120%"
      >
        <Stop
          offset="0%"
          stopColor={theme.colors.accent.primaryFaded}
          stopOpacity={1}
        />
        <Stop
          offset="50%"
          stopColor={theme.colors.accent.primaryFaded}
          stopOpacity={1}
        />
        <Stop
          offset="100%"
          stopColor={theme.colors.accent.primary}
          stopOpacity={1}
        />
      </RadialGradient>
    </Defs>
    <Rect fill="url(#splashGradient)" height="100%" width="100%" x="0" y="0" />
  </Svg>
);

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const [messageIndex, setMessageIndex] = useState(0);

  const backgroundProgress = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslate = useSharedValue(12);
  const staticOpacity = useSharedValue(0);
  const lottieOpacity = useSharedValue(1);

  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const queueFinish = useCallback(() => {
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
    }
    finishTimeoutRef.current = setTimeout(() => {
      onFinish();
    }, FINISH_DELAY);
  }, [onFinish]);

  const showSecondMessage = useCallback(() => {
    setMessageIndex(1);
    queueFinish();
  }, [queueFinish]);

  useEffect(() => {
    backgroundProgress.value = 0;
    textOpacity.value = 0;
    textTranslate.value = 12;
    staticOpacity.value = 0;
    lottieOpacity.value = 1;
    setMessageIndex(0);

    fadeTimeoutRef.current = setTimeout(() => {
      backgroundProgress.value = withTiming(1, {
        duration: BACKGROUND_FADE_DURATION,
        easing: Easing.out(Easing.quad),
      });

      textOpacity.value = withDelay(
        TEXT_FADE_DELAY,
        withTiming(
          1,
          { duration: TEXT_FADE_DURATION, easing: Easing.out(Easing.quad) },
          () => {
            textTranslate.value = withTiming(0, {
              duration: TEXT_FADE_DURATION,
            });
          }
        )
      );

      staticOpacity.value = withDelay(
        TEXT_FADE_DELAY,
        withTiming(1, {
          duration: TEXT_FADE_DURATION,
          easing: Easing.out(Easing.quad),
        })
      );

      textTimeoutRef.current = setTimeout(() => {
        textOpacity.value = withTiming(
          0,
          { duration: 250, easing: Easing.out(Easing.quad) },
          (finished) => {
            if (!finished) {
              return;
            }
            runOnJS(showSecondMessage)();
            textTranslate.value = 12;
            textOpacity.value = withTiming(1, {
              duration: TEXT_FADE_DURATION,
              easing: Easing.out(Easing.quad),
            });
            textTranslate.value = withTiming(0, {
              duration: TEXT_FADE_DURATION,
              easing: Easing.out(Easing.quad),
            });
          }
        );
      }, TEXT_SWITCH_DELAY);
    }, BLINK_TO_FADE_DELAY);

    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }

      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
      }

      if (textTimeoutRef.current) {
        clearTimeout(textTimeoutRef.current);
      }
    };
  }, [
    backgroundProgress,
    staticOpacity,
    textOpacity,
    textTranslate,
    lottieOpacity,
    showSecondMessage,
  ]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundProgress.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslate.value }],
  }));

  const lottieStyle = useAnimatedStyle(() => ({
    opacity: lottieOpacity.value,
    // transform: [{ scale: 0.95 + 0.05 * lottieOpacity.value }],
  }));

  const staticStyle = useAnimatedStyle(() => ({
    opacity: staticOpacity.value,
    // transform: [{ scale: 0.95 + 0.05 * staticOpacity.value }],
  }));

  const handleAnimationFinish = () => {
    lottieOpacity.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });
  };

  return (
    <Animated.View style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[styles.gradientOverlay, backgroundStyle]}
      >
        <RadialGradientBackground />
      </Animated.View>
      <Animated.View style={[styles.textContainer, textStyle]}>
        <StyledText color="black" variant="largestBold">
          {messageIndex === 0 ? "Um segundo..." : "Vamos começar?"}
        </StyledText>
      </Animated.View>

      <Animated.View style={styles.animationWrapper}>
        <Animated.View style={[styles.fill, lottieStyle]}>
          <LottieView
            autoPlay
            loop={false}
            onAnimationFinish={handleAnimationFinish}
            source={animationSource}
            style={styles.lottie}
          />
        </Animated.View>

        <Animated.View pointerEvents="none" style={[styles.fill, staticStyle]}>
          <Image
            resizeMode="contain"
            source={staticSource}
            style={styles.staticImage}
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    position: "absolute",
    top: "12%",
    alignItems: "center",
  },
  animationWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "125%",
    height: "125%",
  },
  staticImage: {
    width: "125%",
    height: "125%",
  },
});

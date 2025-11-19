import { useOnboardingStore } from "@/store/onboardingStore";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const { hasCompletedOnboarding } = useOnboardingStore();
  const segments = useSegments();
  const router = useRouter();

  const rootNavigationState = useRootNavigationState();

  // useEffect(() => {
  //   if (!rootNavigationState?.key) return;

  //   const inOnboarding = segments[0] === 'onboarding';

  //   if (!hasCompletedOnboarding && !inOnboarding) {
  //     router.replace('/onboarding');
  //   } else if (hasCompletedOnboarding && inOnboarding) {
  //     router.replace('/(tabs)');
  //   }
  // }, [hasCompletedOnboarding, segments, rootNavigationState?.key]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

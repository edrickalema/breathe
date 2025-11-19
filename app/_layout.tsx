import { useOnboardingStore } from "@/store/onboardingStore";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";

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
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

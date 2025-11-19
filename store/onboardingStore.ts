import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
    hasCompletedOnboarding: boolean;
    userGoals: string[];
    faithMode: boolean;
    screenTimeLimit: { hours: number; minutes: number };
    completeOnboarding: () => void;
    toggleGoal: (goalId: string) => void;
    setFaithMode: (enabled: boolean) => void;
    setScreenTimeLimit: (hours: number, minutes: number) => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            hasCompletedOnboarding: false,
            userGoals: [],
            faithMode: false,
            screenTimeLimit: { hours: 4, minutes: 0 }, // Default 4 hours
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
            toggleGoal: (goalId) =>
                set((state) => {
                    const exists = state.userGoals.includes(goalId);
                    return {
                        userGoals: exists
                            ? state.userGoals.filter((id) => id !== goalId)
                            : [...state.userGoals, goalId],
                    };
                }),
            setFaithMode: (enabled) => set({ faithMode: enabled }),
            setScreenTimeLimit: (hours, minutes) => set({ screenTimeLimit: { hours, minutes } }),
            reset: () =>
                set({
                    hasCompletedOnboarding: false,
                    userGoals: [],
                    faithMode: false,
                    screenTimeLimit: { hours: 4, minutes: 0 },
                }),
        }),
        {
            name: 'onboarding-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

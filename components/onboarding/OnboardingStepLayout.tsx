import { Companion, Mood } from '@/components/Companion';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingStepLayoutProps {
    children: ReactNode;
    companionMood: Mood;
    onNext: () => void;
    nextLabel?: string;
    showSkip?: boolean;
    hideFooter?: boolean;
    showBack?: boolean;
    step?: number;
    totalSteps?: number;
}

export default function OnboardingStepLayout({
    children,
    companionMood,
    onNext,
    nextLabel = 'Continue',
    showSkip = false,
    hideFooter = false,
    showBack = true,
    step,
    totalSteps = 5,
}: OnboardingStepLayoutProps) {
    const router = useRouter();
    const { completeOnboarding } = useOnboardingStore();

    const handleSkip = () => {
        completeOnboarding();
        router.replace('/(tabs)');
    };

    const { top } = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header, { paddingTop: top + 20 }]}>
                {showBack ? (
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color={Colors.text.primary} />
                    </TouchableOpacity>
                ) : <View style={styles.backButtonPlaceholder} />}

                {step && (
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} />
                    </View>
                )}

                {showSkip ? (
                    <TouchableOpacity onPress={handleSkip} style={styles.headerSkipButton}>
                        <Text style={styles.headerSkipText}>Skip</Text>
                    </TouchableOpacity>
                ) : <View style={styles.headerSkipPlaceholder} />}
            </View>

            <View style={styles.contentWrapper}>
                {/* Prominent Companion Section - Fixed at top like the reference */}
                <View style={styles.companionSection}>
                    <Companion mood={companionMood} size={width * 0.55} />
                </View>

                <Animated.View
                    entering={SlideInRight}
                    exiting={SlideOutLeft}
                    style={styles.contentSection}
                >
                    <View style={styles.stepContainer}>
                        {children}
                    </View>
                </Animated.View>

                {!hideFooter && (
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.button} onPress={onNext}>
                            <Text style={styles.buttonText}>{nextLabel}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.l,
        paddingVertical: Spacing.s, // Reduced vertical padding to fit companion better
        height: 50,
        zIndex: 10,
    },
    backButton: {
        padding: Spacing.s,
        marginLeft: -Spacing.s,
    },
    backButtonPlaceholder: {
        width: 40,
    },
    progressBarContainer: {
        flex: 1,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        marginHorizontal: Spacing.l,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    headerSkipButton: {
        padding: Spacing.s,
        marginRight: -Spacing.s,
    },
    headerSkipPlaceholder: {
        width: 40,
    },
    headerSkipText: {
        ...Typography.small,
        color: Colors.text.secondary,
        fontWeight: '600',
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'space-between',
    },
    companionSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.s,
        marginBottom: Spacing.m,
        height: height * 0.25, // Dedicate top 25% to companion
    },
    contentSection: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    stepContainer: {
        flex: 1,
        alignItems: 'center',
    },
    footer: {
        padding: Spacing.xl,
        paddingBottom: Spacing.xl + 10,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 18,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.full,
        width: '100%',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        ...Typography.button,
        fontSize: 18,
        color: Colors.text.inverse,
        fontWeight: '600',
    },
});

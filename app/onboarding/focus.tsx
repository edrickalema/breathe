import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { Check, Target } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FocusScreen() {
    const router = useRouter();

    return (
        <OnboardingStepLayout
            companionMood="focused"
            onNext={() => router.push('/onboarding/doomscroll')}
            step={3} // Adjust step number based on flow
            totalSteps={5}
        >
            <View style={styles.header}>
                <Text style={[Typography.h2, styles.title]}>Focus Sessions</Text>
                <Text style={[Typography.bodyRegular, styles.subtitle]}>
                    25 minutes of distraction-free work. I'll block tempting apps and stay with you.
                </Text>
            </View>

            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Target size={48} color={Colors.primary} />
                </View>
                <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                        <Check size={20} color={Colors.success} />
                        <Text style={styles.featureText}>Block distracting apps</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Check size={20} color={Colors.success} />
                        <Text style={styles.featureText}>Track focus streaks</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Check size={20} color={Colors.success} />
                        <Text style={styles.featureText}>Visualize progress</Text>
                    </View>
                </View>
            </View>
        </OnboardingStepLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        marginTop: Spacing.l,
    },
    title: {
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.m,
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        color: Colors.text.secondary,
        textAlign: 'center',
        fontSize: 16,
        paddingHorizontal: Spacing.l,
        lineHeight: 24,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        width: '100%',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    iconContainer: {
        marginBottom: Spacing.l,
        padding: Spacing.m,
        backgroundColor: Colors.surfaceHighlight,
        borderRadius: BorderRadius.full,
    },
    featureList: {
        width: '100%',
        gap: Spacing.m,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.m,
    },
    featureText: {
        color: Colors.text.primary,
        fontSize: 16,
        fontWeight: '500',
    },
});

import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DoomscrollScreen() {
    const router = useRouter();

    return (
        <OnboardingStepLayout
            companionMood="warning"
            onNext={() => router.push('/onboarding/permissions')}
            step={4}
            totalSteps={5}
        >
            <View style={styles.header}>
                <Text style={[Typography.h2, styles.title]}>Gentle Interventions</Text>
                <Text style={[Typography.bodyRegular, styles.subtitle]}>
                    Scrolling for too long? I'll gently check in. No judgement, just awareness.
                </Text>
            </View>

            <View style={[styles.demoCard, { borderColor: Colors.warning }]}>
                <View style={styles.warningHeader}>
                    <Text style={{ fontSize: 24 }}>⚠️</Text>
                    <Text style={[Typography.h4, { color: Colors.text.primary, marginLeft: Spacing.s }]}>Check In</Text>
                </View>
                <Text style={styles.demoText}>You've been scrolling for 15 minutes.</Text>
                <Text style={[styles.demoText, { marginTop: Spacing.s, fontStyle: 'italic', color: Colors.text.secondary }]}>
                    "Take 3 deep breaths with me?"
                </Text>
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
    demoCard: {
        backgroundColor: Colors.surface,
        padding: Spacing.xl,
        borderRadius: BorderRadius.xl,
        width: '100%',
        borderWidth: 2,
        borderColor: Colors.warning,
        shadowColor: Colors.warning,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.m,
    },
    demoText: {
        color: Colors.text.primary,
        fontSize: 16,
        lineHeight: 24,
    },
});

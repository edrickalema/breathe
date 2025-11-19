import { Mood } from '@/components/Companion';
import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CompanionScreen() {
    const router = useRouter();
    const [companionMood, setCompanionMood] = useState<Mood>('calm');

    return (
        <OnboardingStepLayout
            companionMood={companionMood}
            onNext={() => router.push('/onboarding/faith')}
            step={5}
            totalSteps={5}
        >
            <View style={styles.header}>
                <Text style={[Typography.h2, styles.title]}>Meet Your Companion</Text>
                <Text style={[Typography.bodyRegular, styles.subtitle]}>
                    I reflect your digital wellbeing. Keep me calm and happy!
                </Text>
            </View>

            {/* Removed duplicate Companion preview since it's now in the layout */}

            <View style={styles.moodSelectorContainer}>
                <Text style={styles.instruction}>Tap to see my moods:</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.moodScroll}
                >
                    {(['calm', 'focused', 'tired', 'proud', 'warning'] as Mood[]).map((m) => (
                        <TouchableOpacity
                            key={m}
                            style={[styles.moodChip, companionMood === m && styles.moodChipActive]}
                            onPress={() => setCompanionMood(m)}
                        >
                            <Text style={[styles.moodChipText, companionMood === m && styles.moodChipTextActive]}>
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </OnboardingStepLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        marginTop: 0,
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
    moodSelectorContainer: {
        width: '100%',
        alignItems: 'center',
    },
    instruction: {
        ...Typography.caption,
        color: Colors.text.tertiary,
        marginBottom: Spacing.m,
    },
    moodScroll: {
        gap: Spacing.m,
        paddingHorizontal: Spacing.m,
    },
    moodChip: {
        paddingVertical: Spacing.s,
        paddingHorizontal: Spacing.l,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    moodChipActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
    },
    moodChipText: {
        color: Colors.text.secondary,
        fontSize: 14,
        fontWeight: '600',
    },
    moodChipTextActive: {
        color: Colors.text.inverse,
    },
});

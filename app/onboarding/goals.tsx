import { Mood } from '@/components/Companion';
import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GoalsScreen() {
    const router = useRouter();
    const { userGoals, toggleGoal } = useOnboardingStore();
    const [mood, setMood] = useState<Mood>('calm');

    // Reactive mood: Change mood based on selection
    useEffect(() => {
        if (userGoals.length === 0) {
            setMood('calm');
        } else if (userGoals.length >= 3) {
            setMood('proud'); // Excited if many goals
        } else {
            setMood('focused'); // Focused if selecting
        }
    }, [userGoals]);

    const goals = [
        { id: 'reduce', icon: '📱', text: 'Reduce screen time' },
        { id: 'focus', icon: '🎯', text: 'Be focused & productive' },
        { id: 'habits', icon: '🌱', text: 'Build healthy habits' },
        { id: 'sleep', icon: '🌙', text: 'Sleep better' },
    ];

    return (
        <OnboardingStepLayout
            companionMood={mood}
            onNext={() => router.push('/onboarding/snooze')}
            step={1}
            totalSteps={4}
        >
            <View style={styles.header}>
                <Text style={[Typography.h2, styles.title]}>What are your goals?</Text>
                <Text style={[Typography.bodyRegular, styles.subtitle]}>
                    Select all that apply
                </Text>
            </View>

            <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={styles.goalsGrid}
                showsVerticalScrollIndicator={false}
            >
                {goals.map((goal) => {
                    const isSelected = userGoals.includes(goal.id);
                    return (
                        <TouchableOpacity
                            key={goal.id}
                            style={[
                                styles.goalCard,
                                isSelected && styles.goalCardSelected
                            ]}
                            onPress={() => toggleGoal(goal.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.goalIcon}>{goal.icon}</Text>
                                </View>
                                <Text style={[Typography.bodyRegular, styles.goalText]}>{goal.text}</Text>
                            </View>

                            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                {isSelected && <Check size={14} color={Colors.text.inverse} strokeWidth={4} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </OnboardingStepLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: Spacing.l,
        marginTop: 0, // Removed top margin as companion is above
    },
    title: {
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.xs,
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        color: Colors.text.secondary,
        textAlign: 'center',
        fontSize: 16,
        paddingHorizontal: Spacing.l,
    },
    scrollContent: {
        width: '100%',
    },
    goalsGrid: {
        gap: Spacing.m,
        paddingBottom: Spacing.xl,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
        padding: Spacing.l,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        height: 80,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    goalCardSelected: {
        borderColor: Colors.primary,
        borderWidth: 2,
        backgroundColor: Colors.surface,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: Spacing.m,
    },
    goalIcon: {
        fontSize: 24,
    },
    goalText: {
        color: Colors.text.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
    },
    checkboxSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
});

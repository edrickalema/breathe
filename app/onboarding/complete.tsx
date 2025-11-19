import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useRouter } from 'expo-router';
import { ArrowRight, Calendar, Eye, Target } from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function CompleteScreen() {
    const router = useRouter();
    const { completeOnboarding } = useOnboardingStore();

    const handleComplete = (route?: string) => {
        completeOnboarding();
        if (route) {
            router.replace(route as any);
        } else {
            router.replace('/(tabs)');
        }
    };

    const actions = [
        {
            id: 'focus',
            icon: <Target size={28} color={Colors.primary} />,
            title: 'Start 5-Minute Focus',
            description: 'Try a quick session to get in the zone.',
            route: '/(tabs)/focus',
            buttonText: 'Focus Now'
        },
        {
            id: 'snooze',
            icon: <Calendar size={28} color={Colors.primary} />,
            title: 'Snooze Your First App',
            description: 'Practice intentional waiting with a snooze.',
            route: '/(tabs)/timeline',
            buttonText: 'Snooze Now'
        },
        {
            id: 'browse',
            icon: <Eye size={28} color={Colors.primary} />,
            title: 'Look Around First',
            description: 'Explore the app at your own pace.',
            route: '/(tabs)',
            buttonText: 'Enter App'
        }
    ];

    return (
        <OnboardingStepLayout
            companionMood="proud"
            onNext={() => handleComplete()}
            nextLabel="Enter Breathe"
            hideFooter={true}
            showBack={false}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={styles.scrollView}
            >
                <Text style={[Typography.h1, styles.title]}>You're All Set! 🎉</Text>
                <Text style={[Typography.bodyLarge, styles.subtitle]}>
                    Ready to build healthier phone habits? Let's start with something small.
                </Text>

                <View style={styles.cardsContainer}>
                    {actions.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            style={styles.card}
                            onPress={() => handleComplete(action.route)}
                            activeOpacity={0.9}
                        >
                            <View style={styles.cardIcon}>
                                {action.icon}
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{action.title}</Text>
                                <Text style={styles.cardDescription}>{action.description}</Text>
                            </View>
                            <View style={styles.cardAction}>
                                <ArrowRight size={24} color={Colors.primary} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </OnboardingStepLayout>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: Spacing.xl,
        width: '100%',
    },
    title: {
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.m,
        fontSize: 32,
        fontWeight: '800',
    },
    subtitle: {
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        fontSize: 16,
        paddingHorizontal: Spacing.l,
        lineHeight: 24,
    },
    cardsContainer: {
        width: '100%',
        gap: Spacing.m,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.l,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        width: '100%', // Ensure full width
    },
    cardIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.m,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
    cardAction: {
        padding: Spacing.s,
        justifyContent: 'center',
    },
});

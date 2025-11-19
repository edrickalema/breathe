import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function FaithScreen() {
    const router = useRouter();
    const { faithMode, setFaithMode } = useOnboardingStore();

    return (
        <OnboardingStepLayout
            companionMood="calm"
            onNext={() => router.push('/onboarding/complete')}
            showSkip
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[Typography.h2, styles.title]}>Faith & Wellbeing</Text>
                    <Text style={[Typography.bodyRegular, styles.subtitle]}>
                        Would you like biblical encouragement alongside your digital wisdom?
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Enable Faith Mode</Text>
                            <Text style={styles.description}>
                                Receive scripture and faith-based reflections.
                            </Text>
                        </View>
                        <Switch
                            value={faithMode}
                            onValueChange={setFaithMode}
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.surface}
                        />
                    </View>
                </View>

                <View style={styles.examplesContainer}>
                    <Text style={styles.sectionTitle}>Examples:</Text>
                    <View style={styles.exampleItem}>
                        <Text style={styles.exampleText}>"Be still and know..."</Text>
                        <Text style={styles.exampleContext}>When starting focus</Text>
                    </View>
                    <View style={styles.exampleItem}>
                        <Text style={styles.exampleText}>"Guard your heart..."</Text>
                        <Text style={styles.exampleContext}>During interventions</Text>
                    </View>
                    <View style={styles.exampleItem}>
                        <Text style={styles.exampleText}>"Do not be anxious..."</Text>
                        <Text style={styles.exampleContext}>In weekly insights</Text>
                    </View>
                </View>

                {faithMode && (
                    <View style={styles.quoteCard}>
                        <Text style={styles.quoteText}>"Be still, and know that I am God."</Text>
                        <Text style={styles.quoteReference}>Psalm 46:10</Text>
                    </View>
                )}
            </ScrollView>
        </OnboardingStepLayout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        alignItems: 'center',
        paddingBottom: Spacing.xl,
        width: '100%',
    },
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
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.l,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.l,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        paddingRight: Spacing.m,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    description: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    examplesContainer: {
        width: '100%',
        marginBottom: Spacing.l,
        paddingHorizontal: Spacing.s,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: Spacing.m,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    exampleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.s,
        paddingVertical: Spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    exampleText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: Colors.text.primary,
    },
    exampleContext: {
        fontSize: 14,
        color: Colors.text.tertiary,
    },
    quoteCard: {
        padding: Spacing.l,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: BorderRadius.l,
        width: '100%',
        alignItems: 'center',
        marginTop: Spacing.m,
    },
    quoteText: {
        color: Colors.text.primary,
        fontStyle: 'italic',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: Spacing.s,
    },
    quoteReference: {
        color: Colors.text.secondary,
        fontSize: 14,
        fontWeight: '600',
    },
});

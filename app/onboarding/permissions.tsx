import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { Bell, Clock } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PermissionsScreen() {
    const router = useRouter();

    const requestNotifications = async () => {
        try {
            await Notifications.requestPermissionsAsync();
        } catch (error) {
            console.log('Permission error', error);
        }
    };

    // Placeholder for alarm permission logic
    const requestAlarms = async () => {
        // Logic for exact alarms would go here
        console.log('Requesting alarm permissions');
    };

    return (
        <OnboardingStepLayout
            companionMood="calm"
            onNext={() => router.push('/onboarding/companion')}
            step={3}
            totalSteps={5}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[Typography.h2, styles.title]}>Two Quick Permissions</Text>
                    <Text style={[Typography.bodyRegular, styles.subtitle]}>
                        To make Breathe work its magic
                    </Text>
                </View>

                <View style={styles.cardsContainer}>
                    {/* Notification Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                                <Bell size={24} color="#2196F3" />
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.cardTitle}>Notifications</Text>
                                <Text style={styles.cardPurpose}>Remind you when snoozed items return</Text>
                            </View>
                        </View>
                        <Text style={styles.cardPrivacy}>No tracking, just timely nudges.</Text>
                        <TouchableOpacity style={styles.allowButton} onPress={requestNotifications}>
                            <Text style={styles.allowButtonText}>Allow Notifications</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Exact Alarms Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                                <Clock size={24} color="#FF9800" />
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.cardTitle}>Exact Timing</Text>
                                <Text style={styles.cardPurpose}>Precisely schedule focus sessions</Text>
                            </View>
                        </View>
                        <Text style={styles.cardPrivacy}>Required for Android 12+ to work reliably.</Text>
                        <TouchableOpacity style={styles.allowButton} onPress={requestAlarms}>
                            <Text style={styles.allowButtonText}>Allow Alarms</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.footerNote}>
                    🔒 All data stays on your device. No cloud, no tracking.
                </Text>
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
        marginBottom: Spacing.l,
        marginTop: 0,
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
    cardsContainer: {
        width: '100%',
        gap: Spacing.l,
        marginBottom: Spacing.xl,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.l,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.m,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.m,
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    cardPurpose: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    cardPrivacy: {
        fontSize: 14,
        color: Colors.text.tertiary,
        fontStyle: 'italic',
        marginBottom: Spacing.m,
    },
    allowButton: {
        backgroundColor: Colors.surfaceHighlight,
        paddingVertical: Spacing.m,
        borderRadius: BorderRadius.l,
        alignItems: 'center',
    },
    allowButtonText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    footerNote: {
        fontSize: 12,
        color: Colors.text.tertiary,
        textAlign: 'center',
        marginTop: Spacing.s,
    },
});

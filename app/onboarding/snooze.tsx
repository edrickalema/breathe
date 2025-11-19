import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import WheelPicker from '@/components/ui/WheelPicker';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SnoozeScreen() {
    const router = useRouter();
    const { screenTimeLimit, setScreenTimeLimit } = useOnboardingStore();

    // Local state for smooth UI before persisting
    const [hours, setHours] = useState(screenTimeLimit.hours.toString());
    const [minutes, setMinutes] = useState(screenTimeLimit.minutes.toString());

    // Generate arrays for picker
    const hoursData = Array.from({ length: 24 }, (_, i) => i.toString());
    const minutesData = Array.from({ length: 12 }, (_, i) => (i * 5).toString()); // 0, 5, 10...

    useEffect(() => {
        setScreenTimeLimit(parseInt(hours), parseInt(minutes));
    }, [hours, minutes]);

    // Calculate mood based on screen time
    const getCompanionMood = () => {
        const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
        if (totalMinutes <= 120) return 'focused'; // < 2 hours: Healthy/Focused
        if (totalMinutes <= 240) return 'calm';    // 2-4 hours: Normal/Calm
        if (totalMinutes <= 360) return 'tired';   // 4-6 hours: Tired
        return 'warning';                          // > 6 hours: Warning/Unhealthy
    };

    return (
        <OnboardingStepLayout
            companionMood={getCompanionMood()}
            onNext={() => router.push('/onboarding/focus')}
            step={2}
            totalSteps={5}
        >
            <View style={styles.header}>
                <Text style={[Typography.h2, styles.title]}>I want to limit my screen time to...</Text>
                <Text style={[Typography.bodyRegular, styles.subtitle]}>
                    Breathe will remind you when your screen time is close to the limit.
                </Text>
            </View>

            <View style={styles.pickerContainer}>
                <View style={styles.pickerWrapper}>
                    <WheelPicker
                        items={hoursData}
                        initialValue={hours}
                        onValueChange={setHours}
                        width={100}
                        label="HOURS"
                    />
                    <View style={styles.divider} />
                    <WheelPicker
                        items={minutesData}
                        initialValue={minutes}
                        onValueChange={setMinutes}
                        width={100}
                        label="MINS"
                    />
                </View>
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
    pickerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: Spacing.l,
    },
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.l,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    divider: {
        width: 1,
        height: 60,
        backgroundColor: Colors.border,
        marginHorizontal: Spacing.l,
    },
});

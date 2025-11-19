import OnboardingStepLayout from '@/components/onboarding/OnboardingStepLayout';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <OnboardingStepLayout
            companionMood="calm"
            onNext={() => router.push('/onboarding/goals')}
            nextLabel="Get Started"
            showSkip={false}
            showBack={false}
            hideFooter={false}
        >
            <View style={styles.container}>
                {/* Companion is now handled by the layout */}

                <View style={styles.textWrapper}>
                    <Text style={[Typography.h1, styles.title]}>Welcome to Breathe</Text>
                    <Text style={[Typography.bodyLarge, styles.subtitle]}>
                        Track & control your screen time.
                    </Text>
                </View>
            </View>
        </OnboardingStepLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', // Changed to start since companion is above
        width: '100%',
        paddingTop: Spacing.l,
    },
    textWrapper: {
        alignItems: 'center',
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
        fontSize: 18,
        fontWeight: '500',
    },
});

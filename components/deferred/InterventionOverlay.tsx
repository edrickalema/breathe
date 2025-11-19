import { Companion } from '@/components/Companion';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

interface InterventionOverlayProps {
    visible: boolean;
    itemName: string;
    returnTime: number;
    reason?: string;
    onOpenAnyway: () => void;
    onExtendSnooze: () => void;
    onCancel: () => void;
}

export function InterventionOverlay({
    visible,
    itemName,
    returnTime,
    reason,
    onOpenAnyway,
    onExtendSnooze,
    onCancel,
}: InterventionOverlayProps) {
    const [countdown, setCountdown] = useState('');
    const scale = useSharedValue(0.8);

    useEffect(() => {
        if (visible) {
            scale.value = withRepeat(
                withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        }
    }, [visible]);

    useEffect(() => {
        if (!visible) return;

        const updateCountdown = () => {
            const now = Date.now();
            const diff = Math.max(0, returnTime - now);
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setCountdown(`${minutes}m ${seconds}s`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [visible, returnTime]);

    const animatedCircleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Modal visible={visible} transparent animationType="fade">
            <BlurView intensity={90} tint="dark" style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.companionContainer}>
                        <Companion mood="warning" size={120} />
                    </View>

                    <Text style={styles.title}>Wait!</Text>
                    <Text style={styles.subtitle}>
                        {itemName} is snoozed for another
                    </Text>
                    <Text style={styles.countdown}>{countdown}</Text>

                    {reason && (
                        <View style={styles.reasonContainer}>
                            <Text style={styles.reasonLabel}>You said:</Text>
                            <Text style={styles.reasonText}>"{reason}"</Text>
                        </View>
                    )}

                    <Animated.View style={[styles.breathingCircle, animatedCircleStyle]} />
                    <Text style={styles.instruction}>Take 3 deep breaths...</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.primaryButton} onPress={onCancel}>
                            <Text style={styles.primaryButtonText}>Okay, I'll Wait</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton} onPress={onExtendSnooze}>
                            <Text style={styles.secondaryButtonText}>+15 Minutes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onOpenAnyway} style={styles.linkButton}>
                            <Text style={styles.linkButtonText}>I really need to open it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    companionContainer: {
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h1,
        color: Colors.text.primary,
        marginBottom: Spacing.s,
    },
    subtitle: {
        ...Typography.bodyLarge,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    countdown: {
        ...Typography.h2,
        color: Colors.primary,
        marginVertical: Spacing.m,
        fontVariant: ['tabular-nums'],
    },
    reasonContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: Spacing.m,
        borderRadius: BorderRadius.m,
        marginVertical: Spacing.l,
        width: '100%',
    },
    reasonLabel: {
        ...Typography.caption,
        color: Colors.text.tertiary,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    reasonText: {
        ...Typography.bodyRegular,
        color: Colors.text.primary,
        fontStyle: 'italic',
    },
    breathingCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(6, 182, 212, 0.1)', // Primary color with low opacity
        position: 'absolute',
        top: 100,
        zIndex: -1,
    },
    instruction: {
        ...Typography.bodyRegular,
        color: Colors.text.secondary,
        marginBottom: Spacing.xl * 2,
    },
    actions: {
        width: '100%',
        gap: Spacing.m,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.m,
        borderRadius: BorderRadius.l,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.text.secondary,
        paddingVertical: Spacing.m,
        borderRadius: BorderRadius.l,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: Colors.text.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    linkButton: {
        paddingVertical: Spacing.s,
        alignItems: 'center',
        marginTop: Spacing.s,
    },
    linkButtonText: {
        color: Colors.text.tertiary,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

import { Companion } from '@/components/Companion';
import { Colors } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get('window');

interface CircularTimerProps {
    totalSeconds: number;
    remainingSeconds: number;
    size?: number;
}

export function CircularTimer({
    totalSeconds,
    remainingSeconds,
    size = width * 0.7
}: CircularTimerProps) {
    const progress = useSharedValue(0);

    const radius = (size - 20) / 2;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const progressValue = totalSeconds > 0
            ? (totalSeconds - remainingSeconds) / totalSeconds
            : 0;

        progress.value = withTiming(progressValue, {
            duration: 1000,
            easing: Easing.linear,
        });
    }, [remainingSeconds, totalSeconds]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={Colors.border}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    {/* Progress Circle */}
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={Colors.primary}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        animatedProps={animatedProps}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>

            {/* Companion in Center */}
            <View style={styles.center}>
                <Companion mood="focused" size={size * 0.35} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

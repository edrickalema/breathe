import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

export function NowMarker() {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Animated.View style={[styles.dot, animatedStyle]} />
            <Text style={styles.label}>NOW</Text>
            <View style={styles.line} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.l,
        paddingHorizontal: Spacing.l,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginHorizontal: Spacing.s,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.text.tertiary,
        letterSpacing: 1,
        marginHorizontal: Spacing.s,
    },
});

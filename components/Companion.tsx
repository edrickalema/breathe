import { Colors } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop } from 'react-native-svg';

export type Mood = 'calm' | 'focused' | 'tired' | 'scattered' | 'warning' | 'proud' | 'sleeping';

interface CompanionProps {
    mood?: Mood;
    size?: number;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function Companion({ mood = 'calm', size = 200 }: CompanionProps) {
    // Animation Values
    const breath = useSharedValue(1);

    // Breathing Animation
    useEffect(() => {
        breath.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1.0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    // Mood Config
    const getMoodColor = (m: Mood) => {
        switch (m) {
            case 'calm': return Colors.mood.calm;
            case 'focused': return Colors.mood.focused;
            case 'tired': return Colors.mood.tired;
            case 'scattered': return Colors.mood.scattered;
            case 'warning': return Colors.mood.warning;
            case 'proud': return Colors.mood.proud;
            case 'sleeping': return Colors.mood.sleeping;
            default: return Colors.mood.calm;
        }
    };

    const baseColor = getMoodColor(mood);

    // Animated Styles
    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: breath.value }],
        };
    }, []);

    // Eye Rendering Helper
    const renderEye = (cx: number, cy: number, mood: Mood) => {
        // Base Eye (Sclera)
        const eyeRadius = 12;

        // Pupil Config based on mood
        let pupilRadius = 5;
        let pupilColor = "#0B0D17";
        let eyelidHeight = 0; // 0 = open, 12 = closed
        let pupilOffsetX = 0;
        let pupilOffsetY = 0;

        switch (mood) {
            case 'focused':
                pupilRadius = 4;
                break;
            case 'tired':
                eyelidHeight = 6; // Half closed
                pupilOffsetY = 2;
                break;
            case 'sleeping':
                eyelidHeight = 11; // Fully closed
                break;
            case 'warning':
                pupilRadius = 3; // Constricted
                pupilColor = Colors.danger; // Red pupil for warning
                break;
            case 'scattered':
                pupilRadius = 3;
                pupilOffsetX = Math.random() * 2 - 1; // Jittery (simulated)
                break;
            case 'proud':
                pupilRadius = 6; // Dilated with joy
                break;
            case 'calm':
            default:
                pupilRadius = 5;
                break;
        }

        return (
            <G>
                {/* Sclera (White part) */}
                <Circle cx={cx} cy={cy} r={eyeRadius} fill="#FFFFFF" />

                {/* Pupil */}
                {mood !== 'sleeping' && (
                    <Circle
                        cx={cx + pupilOffsetX}
                        cy={cy + pupilOffsetY}
                        r={pupilRadius}
                        fill={pupilColor}
                    />
                )}

                {/* Highlight (Reflection) - makes it look wet/real */}
                {mood !== 'sleeping' && (
                    <Circle cx={cx - 3} cy={cy - 3} r={2.5} fill="#FFFFFF" opacity={0.8} />
                )}

                {/* Eyelid (for blinking/tired/sleeping) */}
                {eyelidHeight > 0 && (
                    <Path
                        d={`M${cx - eyeRadius},${cy - eyeRadius} L${cx + eyeRadius},${cy - eyeRadius} L${cx + eyeRadius},${cy - eyeRadius + eyelidHeight} L${cx - eyeRadius},${cy - eyeRadius + eyelidHeight} Z`}
                        fill={baseColor} // Match body color to look like skin/eyelid
                    />
                )}
            </G>
        );
    };

    // Face Rendering
    const renderFace = () => {
        // Mouths
        let mouth;
        switch (mood) {
            case 'focused':
                mouth = <Path d="M45,68 Q50,70 55,68" stroke="#0B0D17" strokeWidth="2" strokeLinecap="round" />;
                break;
            case 'tired':
                mouth = <Path d="M45,72 Q50,70 55,72" stroke="#0B0D17" strokeWidth="2" strokeLinecap="round" />;
                break;
            case 'sleeping':
                mouth = <Circle cx="50" cy="70" r="3" fill="#0B0D17" opacity={0.5} />;
                break;
            case 'warning':
                mouth = <Path d="M45,75 Q50,70 55,75" stroke="#0B0D17" strokeWidth="2" strokeLinecap="round" />;
                break;
            case 'proud':
                mouth = <Path d="M42,68 Q50,78 58,68" stroke="#0B0D17" strokeWidth="2" strokeLinecap="round" />;
                break;
            case 'scattered':
                mouth = <Path d="M45,70 Q48,68 50,70 T55,70" stroke="#0B0D17" strokeWidth="2" strokeLinecap="round" />;
                break;
            case 'calm':
            default:
                mouth = <Path d="M45,68 Q50,73 55,68" stroke="#0B0D17" strokeWidth="2" strokeLinecap="round" />;
                break;

        }

        return (
            <G>
                {renderEye(35, 55, mood)}
                {renderEye(65, 55, mood)}
                {mouth}
            </G>
        );
    };

    return (
        <Animated.View style={[styles.container, { width: size, height: size }, containerStyle]}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                <Defs>
                    <RadialGradient id="bodyGradient" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor={baseColor} stopOpacity="1" />
                        <Stop offset="100%" stopColor={baseColor} stopOpacity="0.8" />
                    </RadialGradient>
                    <RadialGradient id="bellyGradient" cx="50%" cy="80%" rx="30%" ry="20%">
                        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* Left Leg */}
                <Path
                    d="M35,90 Q30,100 40,100 L45,95"
                    stroke={baseColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Right Leg */}
                <Path
                    d="M65,90 Q70,100 60,100 L55,95"
                    stroke={baseColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                />

                {/* Left Arm */}
                <Path
                    d="M15,60 Q5,65 10,75"
                    stroke={baseColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Right Arm */}
                <Path
                    d="M85,60 Q95,65 90,75"
                    stroke={baseColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                />

                {/* Main Body */}
                <Path
                    d="M50,5 C25,5 5,40 5,65 C5,85 20,98 50,98 C80,98 95,85 95,65 C95,40 75,5 50,5 Z"
                    fill="url(#bodyGradient)"
                />

                {/* Swirl Detail (Hair) */}
                <Path
                    d="M50,5 C45,5 35,15 40,25 C42,28 48,28 50,25"
                    stroke={Colors.surface}
                    strokeWidth="0"
                    fill="none"
                />

                {/* Belly Highlight */}
                <Circle cx="50" cy="75" r="20" fill="url(#bellyGradient)" />

                {/* Face */}
                {renderFace()}
            </Svg>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

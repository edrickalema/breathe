import { Companion } from '@/components/Companion';
import { CircularTimer } from '@/components/focus/CircularTimer';
import { SessionType, SessionTypeSelector } from '@/components/focus/SessionTypeSelector';
import WheelPicker from '@/components/ui/WheelPicker';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Check, Pause, Play, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const SESSION_DURATIONS: Record<SessionType, number> = {
    pomodoro: 25 * 60,
    deepwork: 90 * 60,
    quick: 15 * 60,
    custom: 30 * 60,
};

const PRESET_BLOCKED_APPS: Record<SessionType, string[]> = {
    pomodoro: ['📷 Instagram', '🐦 Twitter', '📧 Email'],
    deepwork: ['📷 Instagram', '🐦 Twitter', '📧 Email', '💬 Messages', '🎵 Spotify'],
    quick: ['📷 Instagram', '🐦 Twitter'],
    custom: [],
};

const AVAILABLE_APPS = [
    '📷 Instagram',
    '🐦 Twitter',
    '📧 Email',
    '💬 Messages',
    '🎵 Spotify',
    '📺 YouTube',
    '🎮 Games',
    '📱 TikTok',
];

const ENCOURAGEMENTS = [
    "You're doing great!",
    "Stay focused!",
    "Keep it up!",
    "Almost there!",
    "You've got this!",
];

export default function FocusScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [sessionType, setSessionType] = useState<SessionType>('pomodoro');
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(SESSION_DURATIONS.pomodoro);
    const [totalSeconds, setTotalSeconds] = useState(SESSION_DURATIONS.pomodoro);
    const [showCompletion, setShowCompletion] = useState(false);
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [customMinutes, setCustomMinutes] = useState('30');
    const [selectedApps, setSelectedApps] = useState<string[]>([]);
    const [blockedApps, setBlockedApps] = useState<string[]>(PRESET_BLOCKED_APPS.pomodoro);
    const [encouragement, setEncouragement] = useState(ENCOURAGEMENTS[0]);

    useEffect(() => {
        if (!isActive) {
            const duration = SESSION_DURATIONS[sessionType];
            setRemainingSeconds(duration);
            setTotalSeconds(duration);

            if (sessionType !== 'custom') {
                setBlockedApps(PRESET_BLOCKED_APPS[sessionType]);
            } else {
                setBlockedApps(selectedApps);
            }
        }
    }, [sessionType, isActive, selectedApps]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && !isPaused && remainingSeconds > 0) {
            interval = setInterval(() => {
                setRemainingSeconds((prev) => {
                    const newValue = prev - 1;

                    // Haptic feedback and encouragement on minute milestones
                    if (newValue % 60 === 0 && newValue > 0) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setEncouragement(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
                    }

                    if (newValue === 0) {
                        handleComplete();
                    }

                    return newValue;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused, remainingSeconds]);

    const handleSessionTypeSelect = (type: SessionType) => {
        Haptics.selectionAsync();
        if (type === 'custom') {
            setShowCustomPicker(true);
        } else {
            setSessionType(type);
        }
    };

    const handleCustomSessionSet = () => {
        const duration = parseInt(customMinutes) * 60;
        SESSION_DURATIONS.custom = duration;
        setSessionType('custom');
        setBlockedApps(selectedApps);
        setShowCustomPicker(false);
    };

    const toggleAppSelection = (app: string) => {
        setSelectedApps(prev =>
            prev.includes(app)
                ? prev.filter(a => a !== app)
                : [...prev, app]
        );
    };

    const handleStart = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsActive(true);
        setIsPaused(false);
        setEncouragement(ENCOURAGEMENTS[0]);
    };

    const handlePause = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsPaused(!isPaused);
    };

    const handleEnd = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setIsActive(false);
        setIsPaused(false);
        setRemainingSeconds(SESSION_DURATIONS[sessionType]);
    };

    const handleComplete = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsActive(false);
        setShowCompletion(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const minutesData = Array.from({ length: 120 }, (_, i) => (i + 1).toString());

    if (isActive) {
        // Active Mode - Minimalistic with companion outside ring
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleEnd}
                >
                    <X size={24} color={Colors.text.tertiary} />
                </TouchableOpacity>

                <View style={styles.activeContainer}>
                    {/* Circular Timer */}
                    <CircularTimer
                        totalSeconds={totalSeconds}
                        remainingSeconds={remainingSeconds}
                    />
                    <Text style={styles.timeText}>{formatTime(remainingSeconds)}</Text>
                </View>

                {/* Companion outside ring with speech bubble */}
                <View style={styles.companionSection}>
                    <View style={styles.speechBubble}>
                        <Text style={styles.speechText}>{encouragement}</Text>
                        <View style={styles.speechTail} />
                    </View>
                    <Companion mood="focused" size={100} />
                </View>

                <View style={styles.activeControls}>
                    <TouchableOpacity
                        style={styles.pauseButton}
                        onPress={handlePause}
                    >
                        {isPaused ? (
                            <Play size={28} color={Colors.primary} />
                        ) : (
                            <Pause size={28} color={Colors.primary} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleEnd}>
                        <Text style={styles.endEarlyText}>End early</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Setup Mode - Minimalistic
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <X size={24} color={Colors.text.tertiary} />
            </TouchableOpacity>

            <View style={styles.setupContainer}>
                {/* Duration Preview */}
                <Text style={styles.durationPreview}>{formatTime(remainingSeconds)}</Text>

                {/* Session Type Selector */}
                <SessionTypeSelector
                    selected={sessionType}
                    onSelect={handleSessionTypeSelect}
                />

                {/* Blocked Apps Preview for Presets */}
                {sessionType !== 'custom' && blockedApps.length > 0 && (
                    <View style={styles.blockedPreview}>
                        <Text style={styles.blockedLabel}>Will block</Text>
                        <View style={styles.appChips}>
                            {blockedApps.map((app) => (
                                <View key={app} style={styles.chip}>
                                    <Text style={styles.chipText}>{app}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>

            {/* Start Button */}
            <TouchableOpacity
                style={styles.startButton}
                onPress={handleStart}
            >
                <Play size={24} color="#FFF" fill="#FFF" />
            </TouchableOpacity>

            {/* Custom Session Bottom Sheet */}
            <Modal
                visible={showCustomPicker}
                transparent
                animationType="slide"
            >
                <TouchableOpacity
                    style={styles.bottomSheetOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCustomPicker(false)}
                >
                    <TouchableOpacity activeOpacity={1}>
                        <View style={styles.bottomSheet}>
                            <View style={styles.bottomSheetHandle} />
                            <Text style={styles.bottomSheetTitle}>Custom Session</Text>

                            <Text style={styles.sectionLabel}>Duration</Text>
                            <View style={styles.pickerContainer}>
                                <WheelPicker
                                    items={minutesData}
                                    initialValue={customMinutes}
                                    onValueChange={setCustomMinutes}
                                    width={120}
                                    label="MINUTES"
                                />
                            </View>

                            <Text style={styles.sectionLabel}>Block Apps</Text>
                            <ScrollView
                                style={styles.appsList}
                                showsVerticalScrollIndicator={false}
                            >
                                {AVAILABLE_APPS.map((app) => (
                                    <TouchableOpacity
                                        key={app}
                                        style={styles.appItem}
                                        onPress={() => toggleAppSelection(app)}
                                    >
                                        <Text style={styles.appItemText}>{app}</Text>
                                        <View style={[
                                            styles.checkbox,
                                            selectedApps.includes(app) && styles.checkboxSelected
                                        ]}>
                                            {selectedApps.includes(app) && (
                                                <Check size={16} color="#FFF" />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <TouchableOpacity
                                style={styles.bottomSheetButton}
                                onPress={handleCustomSessionSet}
                            >
                                <Text style={styles.bottomSheetButtonText}>Start Session</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Completion Modal */}
            <Modal
                visible={showCompletion}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalEmoji}>🎉</Text>
                        <Text style={styles.modalTitle}>Well done!</Text>
                        <Text style={styles.modalSubtitle}>
                            {formatTime(totalSeconds)} of focused work
                        </Text>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setShowCompletion(false);
                                router.back();
                            }}
                        >
                            <Text style={styles.modalButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        right: Spacing.l,
        zIndex: 10,
        padding: Spacing.s,
    },
    // Setup Mode - Minimalistic
    setupContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xl * 2,
    },
    durationPreview: {
        fontSize: 96,
        fontWeight: '200',
        color: Colors.text.primary,
        letterSpacing: -4,
    },
    startButton: {
        position: 'absolute',
        bottom: Spacing.xl * 2,
        alignSelf: 'center',
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    blockedPreview: {
        alignItems: 'center',
        gap: Spacing.m,
        marginTop: Spacing.l,
    },
    blockedLabel: {
        fontSize: 12,
        color: Colors.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    appChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.s,
    },
    chip: {
        backgroundColor: Colors.surface,
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.l,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chipText: {
        fontSize: 13,
        color: Colors.text.secondary,
    },
    // Active Mode
    activeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    timeText: {
        position: 'absolute',
        fontSize: 56,
        fontWeight: '300',
        color: Colors.text.primary,
        letterSpacing: -1,
    },
    companionSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    speechBubble: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.l,
        padding: Spacing.m,
        paddingHorizontal: Spacing.l,
        marginBottom: Spacing.s,
        borderWidth: 1,
        borderColor: Colors.border,
        position: 'relative',
    },
    speechText: {
        ...Typography.bodyRegular,
        color: Colors.text.primary,
        textAlign: 'center',
    },
    speechTail: {
        position: 'absolute',
        bottom: -8,
        left: '50%',
        marginLeft: -8,
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: Colors.surface,
    },
    activeControls: {
        alignItems: 'center',
        gap: Spacing.l,
        paddingBottom: Spacing.xl * 2,
    },
    pauseButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    endEarlyText: {
        fontSize: 14,
        color: Colors.text.tertiary,
        textDecorationLine: 'underline',
    },
    // Bottom Sheet
    bottomSheetOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.xl,
        paddingBottom: Spacing.xl + 20,
        maxHeight: height * 0.8,
    },
    bottomSheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: Spacing.l,
    },
    bottomSheetTitle: {
        ...Typography.h3,
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.m,
    },
    pickerContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    appsList: {
        maxHeight: 200,
        marginBottom: Spacing.l,
    },
    appItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    appItemText: {
        fontSize: 16,
        color: Colors.text.primary,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    bottomSheetButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: BorderRadius.l,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSheetButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // Completion Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.l,
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl * 2,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
    },
    modalEmoji: {
        fontSize: 72,
        marginBottom: Spacing.l,
    },
    modalTitle: {
        ...Typography.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.s,
    },
    modalSubtitle: {
        ...Typography.bodyRegular,
        color: Colors.text.secondary,
        marginBottom: Spacing.xl,
    },
    modalButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl * 2,
        paddingVertical: Spacing.m,
        borderRadius: BorderRadius.l,
    },
    modalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

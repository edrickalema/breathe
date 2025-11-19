import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Check, Clock, Edit2, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface TimelineCardProps {
    icon: string; // emoji
    title: string;
    returnTime: string;
    reason?: string;
    countdown: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onComplete?: () => void;
    index?: number;
}

export function TimelineCard({
    icon,
    title,
    returnTime,
    reason,
    countdown,
    onEdit,
    onDelete,
    onComplete,
    index = 0,
}: TimelineCardProps) {
    const renderRightActions = () => {
        if (!onDelete) return null;
        return (
            <TouchableOpacity style={styles.deleteAction} onPress={onDelete}>
                <Trash2 size={24} color="#FFF" />
            </TouchableOpacity>
        );
    };

    const renderLeftActions = () => {
        if (!onComplete) return null;
        return (
            <TouchableOpacity style={styles.completeAction} onPress={onComplete}>
                <Check size={24} color="#FFF" />
            </TouchableOpacity>
        );
    };

    return (
        <Animated.View
            entering={FadeInRight.delay(index * 100)}
            style={styles.container}
        >
            <Swipeable
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                containerStyle={styles.swipeContainer}
            >
                <View style={styles.card}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>{icon}</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.returnTime}>{returnTime}</Text>
                        {reason && (
                            <Text style={styles.reason}>"{reason}"</Text>
                        )}
                        <View style={styles.countdownRow}>
                            <Clock size={14} color={Colors.text.tertiary} />
                            <Text style={styles.countdown}>{countdown}</Text>
                        </View>
                    </View>

                    {/* Actions (Still kept for accessibility/visibility) */}
                    <View style={styles.actions}>
                        {onEdit && (
                            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                                <Edit2 size={18} color={Colors.text.secondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Swipeable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.m,
    },
    swipeContainer: {
        borderRadius: BorderRadius.l,
        overflow: 'hidden',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        padding: Spacing.m,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.l, // Ensure card itself has radius
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.m,
    },
    icon: {
        fontSize: 24,
    },
    content: {
        flex: 1,
    },
    title: {
        ...Typography.bodyLarge,
        color: Colors.text.primary,
        fontWeight: '600',
        marginBottom: 2,
    },
    returnTime: {
        fontSize: 13,
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    reason: {
        fontSize: 12,
        color: Colors.text.tertiary,
        fontStyle: 'italic',
        marginBottom: 4,
    },
    countdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    countdown: {
        fontSize: 12,
        color: Colors.text.tertiary,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.s,
    },
    actionButton: {
        padding: Spacing.xs,
    },
    deleteAction: {
        backgroundColor: Colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    completeAction: {
        backgroundColor: Colors.success,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
});

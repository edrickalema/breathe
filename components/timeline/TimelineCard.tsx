import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Clock, Edit2, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    index = 0,
}: TimelineCardProps) {
    return (
        <Animated.View
            entering={FadeInRight.delay(index * 100)}
            style={styles.card}
        >
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

            {/* Actions */}
            <View style={styles.actions}>
                {onEdit && (
                    <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                        <Edit2 size={18} color={Colors.text.secondary} />
                    </TouchableOpacity>
                )}
                {onDelete && (
                    <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                        <Trash2 size={18} color={Colors.danger} />
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.l,
        padding: Spacing.m,
        marginBottom: Spacing.m,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
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
});

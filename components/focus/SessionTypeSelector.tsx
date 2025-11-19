import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type SessionType = 'pomodoro' | 'deepwork' | 'quick' | 'custom';

interface SessionTypeSelectorProps {
    selected: SessionType;
    onSelect: (type: SessionType) => void;
}

const sessionTypes = [
    { id: 'pomodoro' as SessionType, label: 'Pomodoro', duration: 25 },
    { id: 'deepwork' as SessionType, label: 'Deep Work', duration: 90 },
    { id: 'quick' as SessionType, label: 'Quick Focus', duration: 15 },
    { id: 'custom' as SessionType, label: 'Custom', duration: 0 },
];

export function SessionTypeSelector({ selected, onSelect }: SessionTypeSelectorProps) {
    const handleSelect = (type: SessionType) => {
        Haptics.selectionAsync();
        onSelect(type);
    };

    return (
        <View style={styles.container}>
            {sessionTypes.map((type) => {
                const isSelected = selected === type.id;
                return (
                    <TouchableOpacity
                        key={type.id}
                        style={[
                            styles.pill,
                            isSelected && styles.pillSelected,
                        ]}
                        onPress={() => handleSelect(type.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.pillText,
                            isSelected && styles.pillTextSelected,
                        ]}>
                            {type.label}
                        </Text>
                        {type.duration > 0 && (
                            <Text style={[
                                styles.pillDuration,
                                isSelected && styles.pillDurationSelected,
                            ]}>
                                {type.duration}m
                            </Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: Spacing.s,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    pill: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        borderRadius: BorderRadius.xl,
        borderWidth: 2,
        borderColor: Colors.border,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    pillSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    pillTextSelected: {
        color: '#FFF',
    },
    pillDuration: {
        fontSize: 12,
        color: Colors.text.tertiary,
    },
    pillDurationSelected: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
});

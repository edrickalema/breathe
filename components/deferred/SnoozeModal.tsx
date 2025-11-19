import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useDeferredStore } from '@/store/deferredStore';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface SnoozeModalProps {
    visible: boolean;
    onClose: () => void;
}

const PRESET_TIMES = [
    { label: 'Later Today', value: 'today_evening' },
    { label: 'Tomorrow Morning', value: 'tomorrow_morning' },
    { label: 'This Weekend', value: 'weekend' },
    { label: 'Custom', value: 'custom' },
];

export function SnoozeModal({ visible, onClose }: SnoozeModalProps) {
    const addItem = useDeferredStore((state) => state.addItem);
    const [title, setTitle] = useState('');
    const [reason, setReason] = useState('');
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

    const handleSave = async () => {
        if (!title || !selectedPreset) return;

        let returnTime = Date.now();
        const now = new Date();

        switch (selectedPreset) {
            case 'today_evening':
                // Set to 6 PM today, or tomorrow if already past
                const evening = new Date(now);
                evening.setHours(18, 0, 0, 0);
                if (evening.getTime() <= now.getTime()) {
                    evening.setDate(evening.getDate() + 1);
                }
                returnTime = evening.getTime();
                break;
            case 'tomorrow_morning':
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(9, 0, 0, 0);
                returnTime = tomorrow.getTime();
                break;
            case 'weekend':
                const weekend = new Date(now);
                const daysUntilSaturday = (6 - weekend.getDay() + 7) % 7 || 7;
                weekend.setDate(weekend.getDate() + daysUntilSaturday);
                weekend.setHours(10, 0, 0, 0);
                returnTime = weekend.getTime();
                break;
            case 'custom':
                // For MVP, just set to 1 minute for testing
                returnTime = Date.now() + 60000;
                break;
        }

        await addItem({
            type: 'task', // Default for now
            title,
            icon: '📝', // Default icon
            returnTime,
            reason,
        });

        // Reset and close
        setTitle('');
        setReason('');
        setSelectedPreset(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Snooze Something</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={Colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.label}>What do you want to snooze?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Check Instagram, Reply to email"
                            placeholderTextColor={Colors.text.tertiary}
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={styles.label}>When should it return?</Text>
                        <View style={styles.presetContainer}>
                            {PRESET_TIMES.map((preset) => (
                                <TouchableOpacity
                                    key={preset.value}
                                    style={[
                                        styles.presetButton,
                                        selectedPreset === preset.value && styles.presetButtonSelected
                                    ]}
                                    onPress={() => setSelectedPreset(preset.value)}
                                >
                                    <Text
                                        style={[
                                            styles.presetText,
                                            selectedPreset === preset.value && styles.presetTextSelected
                                        ]}
                                    >
                                        {preset.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Why are you snoozing it? (Optional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="e.g., Need to focus on work"
                            placeholderTextColor={Colors.text.tertiary}
                            value={reason}
                            onChangeText={setReason}
                            multiline
                            numberOfLines={3}
                        />

                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                (!title || !selectedPreset) && styles.saveButtonDisabled
                            ]}
                            onPress={handleSave}
                            disabled={!title || !selectedPreset}
                        >
                            <Text style={styles.saveButtonText}>Snooze It</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.l,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.l,
    },
    title: {
        ...Typography.h3,
        color: Colors.text.primary,
    },
    label: {
        ...Typography.bodyBold,
        color: Colors.text.secondary,
        marginBottom: Spacing.s,
        marginTop: Spacing.m,
    },
    input: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.m,
        padding: Spacing.m,
        color: Colors.text.primary,
        borderWidth: 1,
        borderColor: Colors.border,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    presetContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.s,
    },
    presetButton: {
        paddingVertical: Spacing.s,
        paddingHorizontal: Spacing.m,
        borderRadius: BorderRadius.m,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    presetButtonSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    presetText: {
        color: Colors.text.secondary,
        fontSize: 14,
    },
    presetTextSelected: {
        color: '#FFF',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.l,
        padding: Spacing.m,
        alignItems: 'center',
        marginTop: Spacing.xl,
        marginBottom: Spacing.l,
    },
    saveButtonDisabled: {
        backgroundColor: Colors.surfaceHighlight,
        opacity: 0.5,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

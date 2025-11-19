import { Companion } from '@/components/Companion';
import WheelPicker from '@/components/ui/WheelPicker';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useSettingsStore } from '@/store/settingsStore';
import { Clock, Plus, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

type BottomSheetType =
    | 'companionName'
    | 'moodSensitivity'
    | 'sessionType'
    | 'blockEnforcement'
    | 'doomscrollSensitivity'
    | 'interventionStyle'
    | 'appLimits'
    | 'monitoredApps'
    | 'scheduledSessions'
    | 'addAppLimit'
    | 'addScheduledSession'
    | null;

interface AppLimit {
    id: string;
    appName: string;
    appIcon: string;
    dailyLimit: number; // minutes
}

interface ScheduledSession {
    id: string;
    days: string[];
    time: string;
    duration: number;
    type: string;
}

// Mock app data
const AVAILABLE_APPS = [
    { name: 'Instagram', icon: '📷' },
    { name: 'Twitter', icon: '🐦' },
    { name: 'TikTok', icon: '📱' },
    { name: 'YouTube', icon: '📺' },
    { name: 'Facebook', icon: '👥' },
    { name: 'Reddit', icon: '🤖' },
    { name: 'Snapchat', icon: '👻' },
    { name: 'WhatsApp', icon: '💬' },
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const settings = useSettingsStore();
    const [activeSheet, setActiveSheet] = useState<BottomSheetType>(null);
    const [tempValue, setTempValue] = useState<any>(null);

    // App Management State
    const [appLimits, setAppLimits] = useState<AppLimit[]>([
        { id: '1', appName: 'Instagram', appIcon: '📷', dailyLimit: 30 },
        { id: '2', appName: 'Twitter', appIcon: '🐦', dailyLimit: 20 },
    ]);
    const [monitoredApps, setMonitoredApps] = useState<string[]>(['Instagram', 'Twitter', 'TikTok', 'YouTube']);

    // Scheduling State
    const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([
        { id: '1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], time: '09:00', duration: 90, type: 'Deep Work' },
    ]);

    // New App Limit State
    const [newAppLimit, setNewAppLimit] = useState({ app: AVAILABLE_APPS[0], limit: '30' });

    // New Scheduled Session State
    const [newSession, setNewSession] = useState({
        days: [] as string[],
        time: '09:00',
        duration: '25',
        type: 'pomodoro',
    });

    useEffect(() => {
        settings.loadSettings();
    }, []);

    const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    const SettingRow = ({
        label,
        value,
        onPress,
        subtitle
    }: {
        label: string;
        value?: string;
        onPress?: () => void;
        subtitle?: string;
    }) => (
        <TouchableOpacity
            style={styles.settingRow}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.settingLabel}>
                <Text style={styles.labelText}>{label}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            {value && <Text style={styles.valueText}>{value}</Text>}
        </TouchableOpacity>
    );

    const ToggleRow = ({
        label,
        value,
        onValueChange,
        subtitle
    }: {
        label: string;
        value: boolean;
        onValueChange: (value: boolean) => void;
        subtitle?: string;
    }) => (
        <View style={styles.toggleRow}>
            <View style={styles.settingLabel}>
                <Text style={styles.labelText}>{label}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: Colors.border, true: Colors.primary + '40' }}
                thumbColor={value ? Colors.primary : Colors.surface}
            />
        </View>
    );

    const BottomSheet = ({
        visible,
        onClose,
        title,
        children
    }: {
        visible: boolean;
        onClose: () => void;
        title: string;
        children: React.ReactNode;
    }) => (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.bottomSheetOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.bottomSheet}>
                    <View style={styles.bottomSheetHandle} />
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.bottomSheetTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={Colors.text.secondary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {children}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const OptionButton = ({
        label,
        selected,
        onPress
    }: {
        label: string;
        selected: boolean;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            style={[styles.optionButton, selected && styles.optionButtonSelected]}
            onPress={onPress}
        >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const formatSessionType = (type: string) => {
        const map: Record<string, string> = {
            pomodoro: 'Pomodoro (25 min)',
            deepwork: 'Deep Work (90 min)',
            quick: 'Quick Focus (15 min)',
            custom: `Custom (${settings.customDuration} min)`,
        };
        return map[type] || type;
    };

    const formatSensitivity = (sensitivity: string) => {
        return sensitivity.charAt(0).toUpperCase() + sensitivity.slice(1);
    };

    const handleAddAppLimit = () => {
        const newLimit: AppLimit = {
            id: Date.now().toString(),
            appName: newAppLimit.app.name,
            appIcon: newAppLimit.app.icon,
            dailyLimit: parseInt(newAppLimit.limit),
        };
        setAppLimits([...appLimits, newLimit]);
        setActiveSheet('appLimits');
    };

    const handleDeleteAppLimit = (id: string) => {
        setAppLimits(appLimits.filter(limit => limit.id !== id));
    };

    const handleAddScheduledSession = () => {
        const newSchedule: ScheduledSession = {
            id: Date.now().toString(),
            days: newSession.days,
            time: newSession.time,
            duration: parseInt(newSession.duration),
            type: newSession.type,
        };
        setScheduledSessions([...scheduledSessions, newSchedule]);
        setActiveSheet('scheduledSessions');
    };

    const handleDeleteScheduledSession = (id: string) => {
        setScheduledSessions(scheduledSessions.filter(session => session.id !== id));
    };

    const toggleDay = (day: string) => {
        setNewSession(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day],
        }));
    };

    const minutesData = Array.from({ length: 240 }, (_, i) => (i + 1).toString());
    const hoursData = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutesTimeData = ['00', '15', '30', '45'];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <Companion mood="calm" size={80} />
                    <TouchableOpacity onPress={() => {
                        setTempValue(settings.companionName);
                        setActiveSheet('companionName');
                    }}>
                        <Text style={styles.companionName}>{settings.companionName}</Text>
                    </TouchableOpacity>
                </View>

                {/* Companion */}
                <SettingSection title="Companion">
                    <View style={styles.card}>
                        <SettingRow
                            label="Mood Sensitivity"
                            value={formatSensitivity(settings.moodSensitivity)}
                            onPress={() => setActiveSheet('moodSensitivity')}
                            subtitle="How quickly companion reacts to your habits"
                        />
                        <ToggleRow
                            label="Faith-Based Mode"
                            value={settings.faithMode}
                            onValueChange={settings.setFaithMode}
                            subtitle="Include spiritual encouragement"
                        />
                    </View>
                </SettingSection>

                {/* App Management */}
                <SettingSection title="App Management">
                    <View style={styles.card}>
                        <SettingRow
                            label="App Limits"
                            value={`${appLimits.length} apps`}
                            onPress={() => setActiveSheet('appLimits')}
                            subtitle="Set time limits for specific apps"
                        />
                        <SettingRow
                            label="Monitored Apps"
                            value={`${monitoredApps.length} apps`}
                            onPress={() => setActiveSheet('monitoredApps')}
                            subtitle="Choose which apps to track"
                        />
                    </View>
                </SettingSection>

                {/* Focus Sessions */}
                <SettingSection title="Focus Sessions">
                    <View style={styles.card}>
                        <SettingRow
                            label="Default Session"
                            value={formatSessionType(settings.defaultSessionType)}
                            onPress={() => setActiveSheet('sessionType')}
                        />
                        <SettingRow
                            label="Block Enforcement"
                            value={formatSensitivity(settings.blockEnforcement)}
                            onPress={() => setActiveSheet('blockEnforcement')}
                            subtitle="How strictly to enforce app blocks"
                        />
                        <SettingRow
                            label="Scheduled Sessions"
                            value={`${scheduledSessions.length} scheduled`}
                            onPress={() => setActiveSheet('scheduledSessions')}
                            subtitle="Recurring focus sessions"
                        />
                    </View>
                </SettingSection>

                {/* Doomscroll Detection */}
                <SettingSection title="Doomscroll Detection">
                    <View style={styles.card}>
                        <ToggleRow
                            label="Enable Detection"
                            value={settings.doomscrollEnabled}
                            onValueChange={settings.setDoomscrollEnabled}
                            subtitle="Monitor scrolling and intervene"
                        />
                        {settings.doomscrollEnabled && (
                            <>
                                <SettingRow
                                    label="Sensitivity"
                                    value={formatSensitivity(settings.doomscrollSensitivity)}
                                    onPress={() => setActiveSheet('doomscrollSensitivity')}
                                />
                                <SettingRow
                                    label="Intervention Style"
                                    value={formatSensitivity(settings.interventionStyle)}
                                    onPress={() => setActiveSheet('interventionStyle')}
                                />
                                <ToggleRow
                                    label="Late Night Protection"
                                    value={settings.lateNightProtection}
                                    onValueChange={settings.setLateNightProtection}
                                    subtitle="Stricter after 11 PM"
                                />
                            </>
                        )}
                    </View>
                </SettingSection>

                {/* Notifications */}
                <SettingSection title="Notifications">
                    <View style={styles.card}>
                        <ToggleRow
                            label="Focus Notifications"
                            value={settings.focusNotifications}
                            onValueChange={settings.setFocusNotifications}
                        />
                        <ToggleRow
                            label="Doomscroll Alerts"
                            value={settings.doomscrollAlerts}
                            onValueChange={settings.setDoomscrollAlerts}
                        />
                        <ToggleRow
                            label="Daily Check-ins"
                            value={settings.dailyCheckins}
                            onValueChange={settings.setDailyCheckins}
                        />
                    </View>
                </SettingSection>

                {/* About */}
                <SettingSection title="About">
                    <View style={styles.card}>
                        <SettingRow
                            label="App Version"
                            value="1.0.0"
                        />
                    </View>
                </SettingSection>

            </ScrollView>

            {/* Companion Name Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'companionName'}
                onClose={() => setActiveSheet(null)}
                title="Companion Name"
            >
                <TextInput
                    style={styles.textInput}
                    value={tempValue}
                    onChangeText={setTempValue}
                    maxLength={15}
                    placeholder="Enter name"
                    placeholderTextColor={Colors.text.tertiary}
                    autoFocus
                />
                <TouchableOpacity
                    style={styles.sheetButton}
                    onPress={() => {
                        settings.setCompanionName(tempValue);
                        setActiveSheet(null);
                    }}
                >
                    <Text style={styles.sheetButtonText}>Save</Text>
                </TouchableOpacity>
            </BottomSheet>

            {/* Mood Sensitivity Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'moodSensitivity'}
                onClose={() => setActiveSheet(null)}
                title="Mood Sensitivity"
            >
                <OptionButton
                    label="Chill"
                    selected={settings.moodSensitivity === 'chill'}
                    onPress={() => {
                        settings.setMoodSensitivity('chill');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Balanced"
                    selected={settings.moodSensitivity === 'balanced'}
                    onPress={() => {
                        settings.setMoodSensitivity('balanced');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Responsive"
                    selected={settings.moodSensitivity === 'responsive'}
                    onPress={() => {
                        settings.setMoodSensitivity('responsive');
                        setActiveSheet(null);
                    }}
                />
            </BottomSheet>

            {/* App Limits Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'appLimits'}
                onClose={() => setActiveSheet(null)}
                title="App Limits"
            >
                {appLimits.map((limit) => (
                    <View key={limit.id} style={styles.listItem}>
                        <Text style={styles.listItemIcon}>{limit.appIcon}</Text>
                        <View style={styles.listItemContent}>
                            <Text style={styles.listItemTitle}>{limit.appName}</Text>
                            <Text style={styles.listItemSubtitle}>{limit.dailyLimit} min/day</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteAppLimit(limit.id)}>
                            <Trash2 size={20} color={Colors.danger} />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setActiveSheet('addAppLimit')}
                >
                    <Plus size={20} color={Colors.primary} />
                    <Text style={styles.addButtonText}>Add App Limit</Text>
                </TouchableOpacity>
            </BottomSheet>

            {/* Add App Limit Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'addAppLimit'}
                onClose={() => setActiveSheet('appLimits')}
                title="Add App Limit"
            >
                <Text style={styles.inputLabel}>Select App</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.appSelector}>
                    {AVAILABLE_APPS.map((app) => (
                        <TouchableOpacity
                            key={app.name}
                            style={[
                                styles.appOption,
                                newAppLimit.app.name === app.name && styles.appOptionSelected,
                            ]}
                            onPress={() => setNewAppLimit({ ...newAppLimit, app })}
                        >
                            <Text style={styles.appOptionIcon}>{app.icon}</Text>
                            <Text style={styles.appOptionText}>{app.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.inputLabel}>Daily Limit (minutes)</Text>
                <View style={styles.pickerContainer}>
                    <WheelPicker
                        items={minutesData}
                        initialValue={newAppLimit.limit}
                        onValueChange={(value) => setNewAppLimit({ ...newAppLimit, limit: value })}
                        width={120}
                        label="MINUTES"
                    />
                </View>

                <TouchableOpacity
                    style={styles.sheetButton}
                    onPress={handleAddAppLimit}
                >
                    <Text style={styles.sheetButtonText}>Add Limit</Text>
                </TouchableOpacity>
            </BottomSheet>

            {/* Monitored Apps Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'monitoredApps'}
                onClose={() => setActiveSheet(null)}
                title="Monitored Apps"
            >
                {AVAILABLE_APPS.map((app) => (
                    <View key={app.name} style={styles.listItem}>
                        <Text style={styles.listItemIcon}>{app.icon}</Text>
                        <Text style={styles.listItemTitle}>{app.name}</Text>
                        <Switch
                            value={monitoredApps.includes(app.name)}
                            onValueChange={(value) => {
                                if (value) {
                                    setMonitoredApps([...monitoredApps, app.name]);
                                } else {
                                    setMonitoredApps(monitoredApps.filter(name => name !== app.name));
                                }
                            }}
                            trackColor={{ false: Colors.border, true: Colors.primary + '40' }}
                            thumbColor={monitoredApps.includes(app.name) ? Colors.primary : Colors.surface}
                        />
                    </View>
                ))}
            </BottomSheet>

            {/* Scheduled Sessions Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'scheduledSessions'}
                onClose={() => setActiveSheet(null)}
                title="Scheduled Sessions"
            >
                {scheduledSessions.map((session) => (
                    <View key={session.id} style={styles.listItem}>
                        <Clock size={20} color={Colors.primary} />
                        <View style={styles.listItemContent}>
                            <Text style={styles.listItemTitle}>
                                {session.type} - {session.duration} min
                            </Text>
                            <Text style={styles.listItemSubtitle}>
                                {session.days.join(', ')} at {session.time}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteScheduledSession(session.id)}>
                            <Trash2 size={20} color={Colors.danger} />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setNewSession({ days: [], time: '09:00', duration: '25', type: 'pomodoro' });
                        setActiveSheet('addScheduledSession');
                    }}
                >
                    <Plus size={20} color={Colors.primary} />
                    <Text style={styles.addButtonText}>Add Scheduled Session</Text>
                </TouchableOpacity>
            </BottomSheet>

            {/* Add Scheduled Session Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'addScheduledSession'}
                onClose={() => setActiveSheet('scheduledSessions')}
                title="Add Scheduled Session"
            >
                <Text style={styles.inputLabel}>Days</Text>
                <View style={styles.daysSelector}>
                    {DAYS_OF_WEEK.map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.dayButton,
                                newSession.days.includes(day) && styles.dayButtonSelected,
                            ]}
                            onPress={() => toggleDay(day)}
                        >
                            <Text style={[
                                styles.dayButtonText,
                                newSession.days.includes(day) && styles.dayButtonTextSelected,
                            ]}>
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.inputLabel}>Time</Text>
                <View style={styles.timePickerContainer}>
                    <WheelPicker
                        items={hoursData}
                        initialValue={newSession.time.split(':')[0]}
                        onValueChange={(value) => setNewSession({ ...newSession, time: `${value}:${newSession.time.split(':')[1]}` })}
                        width={80}
                        label="HH"
                    />
                    <Text style={styles.timeSeparator}>:</Text>
                    <WheelPicker
                        items={minutesTimeData}
                        initialValue={newSession.time.split(':')[1]}
                        onValueChange={(value) => setNewSession({ ...newSession, time: `${newSession.time.split(':')[0]}:${value}` })}
                        width={80}
                        label="MM"
                    />
                </View>

                <Text style={styles.inputLabel}>Duration (minutes)</Text>
                <View style={styles.pickerContainer}>
                    <WheelPicker
                        items={minutesData}
                        initialValue={newSession.duration}
                        onValueChange={(value) => setNewSession({ ...newSession, duration: value })}
                        width={120}
                        label="MINUTES"
                    />
                </View>

                <TouchableOpacity
                    style={styles.sheetButton}
                    onPress={handleAddScheduledSession}
                    disabled={newSession.days.length === 0}
                >
                    <Text style={styles.sheetButtonText}>Add Session</Text>
                </TouchableOpacity>
            </BottomSheet>

            {/* Session Type Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'sessionType'}
                onClose={() => setActiveSheet(null)}
                title="Default Session"
            >
                <OptionButton
                    label="Pomodoro (25 min)"
                    selected={settings.defaultSessionType === 'pomodoro'}
                    onPress={() => {
                        settings.setDefaultSessionType('pomodoro');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Deep Work (90 min)"
                    selected={settings.defaultSessionType === 'deepwork'}
                    onPress={() => {
                        settings.setDefaultSessionType('deepwork');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Quick Focus (15 min)"
                    selected={settings.defaultSessionType === 'quick'}
                    onPress={() => {
                        settings.setDefaultSessionType('quick');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label={`Custom (${settings.customDuration} min)`}
                    selected={settings.defaultSessionType === 'custom'}
                    onPress={() => {
                        settings.setDefaultSessionType('custom');
                        setActiveSheet(null);
                    }}
                />
            </BottomSheet>

            {/* Block Enforcement Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'blockEnforcement'}
                onClose={() => setActiveSheet(null)}
                title="Block Enforcement"
            >
                <OptionButton
                    label="Friendly Reminder"
                    selected={settings.blockEnforcement === 'friendly'}
                    onPress={() => {
                        settings.setBlockEnforcement('friendly');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Timed Delay"
                    selected={settings.blockEnforcement === 'timed'}
                    onPress={() => {
                        settings.setBlockEnforcement('timed');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Hard Block"
                    selected={settings.blockEnforcement === 'hard'}
                    onPress={() => {
                        settings.setBlockEnforcement('hard');
                        setActiveSheet(null);
                    }}
                />
            </BottomSheet>

            {/* Doomscroll Sensitivity Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'doomscrollSensitivity'}
                onClose={() => setActiveSheet(null)}
                title="Doomscroll Sensitivity"
            >
                <OptionButton
                    label="Lenient"
                    selected={settings.doomscrollSensitivity === 'lenient'}
                    onPress={() => {
                        settings.setDoomscrollSensitivity('lenient');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Balanced"
                    selected={settings.doomscrollSensitivity === 'balanced'}
                    onPress={() => {
                        settings.setDoomscrollSensitivity('balanced');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Strict"
                    selected={settings.doomscrollSensitivity === 'strict'}
                    onPress={() => {
                        settings.setDoomscrollSensitivity('strict');
                        setActiveSheet(null);
                    }}
                />
            </BottomSheet>

            {/* Intervention Style Bottom Sheet */}
            <BottomSheet
                visible={activeSheet === 'interventionStyle'}
                onClose={() => setActiveSheet(null)}
                title="Intervention Style"
            >
                <OptionButton
                    label="Gentle"
                    selected={settings.interventionStyle === 'gentle'}
                    onPress={() => {
                        settings.setInterventionStyle('gentle');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Progressive"
                    selected={settings.interventionStyle === 'progressive'}
                    onPress={() => {
                        settings.setInterventionStyle('progressive');
                        setActiveSheet(null);
                    }}
                />
                <OptionButton
                    label="Aggressive"
                    selected={settings.interventionStyle === 'aggressive'}
                    onPress={() => {
                        settings.setInterventionStyle('aggressive');
                        setActiveSheet(null);
                    }}
                />
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: Spacing.l,
        paddingBottom: 100,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        marginBottom: Spacing.l,
    },
    companionName: {
        ...Typography.h3,
        color: Colors.text.primary,
        marginTop: Spacing.m,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.m,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.l,
        padding: Spacing.m,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    settingLabel: {
        flex: 1,
        marginRight: Spacing.m,
    },
    labelText: {
        fontSize: 15,
        color: Colors.text.primary,
    },
    valueText: {
        fontSize: 14,
        color: Colors.text.tertiary,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.text.tertiary,
        marginTop: 2,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
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
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    bottomSheetTitle: {
        ...Typography.h3,
        color: Colors.text.primary,
    },
    textInput: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.l,
        padding: Spacing.m,
        fontSize: 16,
        color: Colors.text.primary,
        marginBottom: Spacing.l,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    optionButton: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.l,
        padding: Spacing.m,
        marginBottom: Spacing.s,
        borderWidth: 2,
        borderColor: Colors.border,
    },
    optionButtonSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10',
    },
    optionText: {
        fontSize: 16,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    optionTextSelected: {
        color: Colors.primary,
        fontWeight: '600',
    },
    sheetButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: BorderRadius.l,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.l,
    },
    sheetButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // List Items
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.m,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.l,
        marginBottom: Spacing.s,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    listItemIcon: {
        fontSize: 24,
        marginRight: Spacing.m,
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 15,
        color: Colors.text.primary,
        fontWeight: '500',
    },
    listItemSubtitle: {
        fontSize: 13,
        color: Colors.text.tertiary,
        marginTop: 2,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.m,
        backgroundColor: Colors.primary + '10',
        borderRadius: BorderRadius.l,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        marginTop: Spacing.s,
    },
    addButtonText: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: '600',
        marginLeft: Spacing.xs,
    },
    // App Selector
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: Spacing.m,
        marginTop: Spacing.l,
    },
    appSelector: {
        marginBottom: Spacing.l,
    },
    appOption: {
        alignItems: 'center',
        padding: Spacing.m,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.l,
        marginRight: Spacing.s,
        borderWidth: 2,
        borderColor: Colors.border,
        minWidth: 80,
    },
    appOptionSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10',
    },
    appOptionIcon: {
        fontSize: 32,
        marginBottom: Spacing.xs,
    },
    appOptionText: {
        fontSize: 12,
        color: Colors.text.secondary,
    },
    pickerContainer: {
        alignItems: 'center',
        marginBottom: Spacing.l,
    },
    // Days Selector
    daysSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.s,
        marginBottom: Spacing.l,
    },
    dayButton: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.m,
        borderWidth: 2,
        borderColor: Colors.border,
    },
    dayButtonSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10',
    },
    dayButtonText: {
        fontSize: 14,
        color: Colors.text.secondary,
        fontWeight: '500',
    },
    dayButtonTextSelected: {
        color: Colors.primary,
        fontWeight: '600',
    },
    // Time Picker
    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.l,
    },
    timeSeparator: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginHorizontal: Spacing.s,
    },
});

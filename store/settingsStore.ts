import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type MoodSensitivity = 'chill' | 'balanced' | 'responsive';
export type SessionType = 'pomodoro' | 'deepwork' | 'quick' | 'custom';
export type BlockEnforcement = 'friendly' | 'timed' | 'hard';
export type DoomscrollSensitivity = 'lenient' | 'balanced' | 'strict';
export type InterventionStyle = 'gentle' | 'progressive' | 'aggressive';

interface SettingsState {
    // Companion
    companionName: string;
    moodSensitivity: MoodSensitivity;
    faithMode: boolean;

    // Focus
    defaultSessionType: SessionType;
    blockEnforcement: BlockEnforcement;
    customDuration: number; // minutes

    // Doomscroll
    doomscrollEnabled: boolean;
    doomscrollSensitivity: DoomscrollSensitivity;
    interventionStyle: InterventionStyle;
    lateNightProtection: boolean;
    lateNightThreshold: string; // HH:MM format

    // Notifications
    focusNotifications: boolean;
    doomscrollAlerts: boolean;
    dailyCheckins: boolean;

    // Actions
    setCompanionName: (name: string) => void;
    setMoodSensitivity: (sensitivity: MoodSensitivity) => void;
    setFaithMode: (enabled: boolean) => void;
    setDefaultSessionType: (type: SessionType) => void;
    setBlockEnforcement: (enforcement: BlockEnforcement) => void;
    setCustomDuration: (duration: number) => void;
    setDoomscrollEnabled: (enabled: boolean) => void;
    setDoomscrollSensitivity: (sensitivity: DoomscrollSensitivity) => void;
    setInterventionStyle: (style: InterventionStyle) => void;
    setLateNightProtection: (enabled: boolean) => void;
    setLateNightThreshold: (time: string) => void;
    setFocusNotifications: (enabled: boolean) => void;
    setDoomscrollAlerts: (enabled: boolean) => void;
    setDailyCheckins: (enabled: boolean) => void;
    loadSettings: () => Promise<void>;
    saveSettings: () => Promise<void>;
}

const SETTINGS_STORAGE_KEY = '@breathe_settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
    // Default values
    companionName: 'Companion',
    moodSensitivity: 'balanced',
    faithMode: false,
    defaultSessionType: 'pomodoro',
    blockEnforcement: 'timed',
    customDuration: 30,
    doomscrollEnabled: true,
    doomscrollSensitivity: 'balanced',
    interventionStyle: 'progressive',
    lateNightProtection: false,
    lateNightThreshold: '23:00',
    focusNotifications: true,
    doomscrollAlerts: true,
    dailyCheckins: true,

    // Actions
    setCompanionName: (name) => {
        set({ companionName: name });
        get().saveSettings();
    },
    setMoodSensitivity: (sensitivity) => {
        set({ moodSensitivity: sensitivity });
        get().saveSettings();
    },
    setFaithMode: (enabled) => {
        set({ faithMode: enabled });
        get().saveSettings();
    },
    setDefaultSessionType: (type) => {
        set({ defaultSessionType: type });
        get().saveSettings();
    },
    setBlockEnforcement: (enforcement) => {
        set({ blockEnforcement: enforcement });
        get().saveSettings();
    },
    setCustomDuration: (duration) => {
        set({ customDuration: duration });
        get().saveSettings();
    },
    setDoomscrollEnabled: (enabled) => {
        set({ doomscrollEnabled: enabled });
        get().saveSettings();
    },
    setDoomscrollSensitivity: (sensitivity) => {
        set({ doomscrollSensitivity: sensitivity });
        get().saveSettings();
    },
    setInterventionStyle: (style) => {
        set({ interventionStyle: style });
        get().saveSettings();
    },
    setLateNightProtection: (enabled) => {
        set({ lateNightProtection: enabled });
        get().saveSettings();
    },
    setLateNightThreshold: (time) => {
        set({ lateNightThreshold: time });
        get().saveSettings();
    },
    setFocusNotifications: (enabled) => {
        set({ focusNotifications: enabled });
        get().saveSettings();
    },
    setDoomscrollAlerts: (enabled) => {
        set({ doomscrollAlerts: enabled });
        get().saveSettings();
    },
    setDailyCheckins: (enabled) => {
        set({ dailyCheckins: enabled });
        get().saveSettings();
    },

    loadSettings: async () => {
        try {
            const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
            if (stored) {
                const settings = JSON.parse(stored);
                set(settings);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    },

    saveSettings: async () => {
        try {
            const state = get();
            const settings = {
                companionName: state.companionName,
                moodSensitivity: state.moodSensitivity,
                faithMode: state.faithMode,
                defaultSessionType: state.defaultSessionType,
                blockEnforcement: state.blockEnforcement,
                customDuration: state.customDuration,
                doomscrollEnabled: state.doomscrollEnabled,
                doomscrollSensitivity: state.doomscrollSensitivity,
                interventionStyle: state.interventionStyle,
                lateNightProtection: state.lateNightProtection,
                lateNightThreshold: state.lateNightThreshold,
                focusNotifications: state.focusNotifications,
                doomscrollAlerts: state.doomscrollAlerts,
                dailyCheckins: state.dailyCheckins,
            };
            await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    },
}));

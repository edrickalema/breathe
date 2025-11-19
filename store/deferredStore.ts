import { cancelNotification, scheduleReturnNotification } from '@/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type DeferredType = 'app' | 'link' | 'task' | 'notification';

export interface DeferredItem {
    id: string;
    type: DeferredType;
    title: string;
    icon: string; // emoji or icon name
    content?: string; // url or package name
    snoozeTime: number; // timestamp
    returnTime: number; // timestamp
    reason?: string;
    status: 'waiting' | 'ready' | 'completed';
    notificationId?: string;
}

interface DeferredState {
    items: DeferredItem[];
    history: DeferredItem[];
    addItem: (item: Omit<DeferredItem, 'id' | 'status' | 'snoozeTime'>) => Promise<void>;
    updateItem: (id: string, updates: Partial<DeferredItem>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    completeItem: (id: string) => Promise<void>;
    checkReadyItems: () => void;
}

export const useDeferredStore = create<DeferredState>()(
    persist(
        (set, get) => ({
            items: [],
            history: [],

            addItem: async (newItem) => {
                const id = Math.random().toString(36).substring(7);
                const snoozeTime = Date.now();
                const secondsUntilReturn = Math.max(0, (newItem.returnTime - Date.now()) / 1000);

                let notificationId;
                if (secondsUntilReturn > 0) {
                    notificationId = await scheduleReturnNotification(
                        id,
                        "It's time for " + newItem.title,
                        newItem.reason ? `You snoozed this because: "${newItem.reason}"` : "Ready to revisit?",
                        secondsUntilReturn
                    );
                }

                const item: DeferredItem = {
                    ...newItem,
                    id,
                    snoozeTime,
                    status: secondsUntilReturn <= 0 ? 'ready' : 'waiting',
                    notificationId,
                };

                set((state) => ({
                    items: [...state.items, item].sort((a, b) => a.returnTime - b.returnTime),
                }));
            },

            updateItem: async (id, updates) => {
                const state = get();
                const item = state.items.find((i) => i.id === id);
                if (!item) return;

                // If return time changed, reschedule notification
                let notificationId = item.notificationId;
                if (updates.returnTime && updates.returnTime !== item.returnTime) {
                    if (notificationId) {
                        await cancelNotification(notificationId);
                    }
                    const secondsUntilReturn = Math.max(0, (updates.returnTime - Date.now()) / 1000);
                    if (secondsUntilReturn > 0) {
                        notificationId = await scheduleReturnNotification(
                            id,
                            "It's time for " + (updates.title || item.title),
                            (updates.reason || item.reason) ? `You snoozed this because: "${updates.reason || item.reason}"` : "Ready to revisit?",
                            secondsUntilReturn
                        );
                    } else {
                        notificationId = undefined;
                    }
                }

                set((state) => ({
                    items: state.items
                        .map((i) => (i.id === id ? { ...i, ...updates, notificationId } : i))
                        .sort((a, b) => a.returnTime - b.returnTime),
                }));
            },

            deleteItem: async (id) => {
                const state = get();
                const item = state.items.find((i) => i.id === id);
                if (item?.notificationId) {
                    await cancelNotification(item.notificationId);
                }
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }));
            },

            completeItem: async (id) => {
                const state = get();
                const item = state.items.find((i) => i.id === id);
                if (!item) return;

                if (item.notificationId) {
                    await cancelNotification(item.notificationId);
                }

                const completedItem: DeferredItem = { ...item, status: 'completed' };

                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                    history: [completedItem, ...state.history].slice(0, 50), // Keep last 50
                }));
            },

            checkReadyItems: () => {
                const now = Date.now();
                set((state) => {
                    let hasChanges = false;
                    const newItems = state.items.map((item) => {
                        if (item.status === 'waiting' && item.returnTime <= now) {
                            hasChanges = true;
                            return { ...item, status: 'ready' as const };
                        }
                        return item;
                    });
                    return hasChanges ? { items: newItems } : {};
                });
            },
        }),
        {
            name: 'deferred-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

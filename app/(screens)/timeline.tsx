import { InterventionOverlay } from '@/components/deferred/InterventionOverlay';
import { SnoozeModal } from '@/components/deferred/SnoozeModal';
import { NowMarker } from '@/components/timeline/NowMarker';
import { TimelineCard } from '@/components/timeline/TimelineCard';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useDeferredLifecycle } from '@/hooks/useDeferredLifecycle';
import { useDeferredStore } from '@/store/deferredStore';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TimelineScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [isSnoozeModalVisible, setSnoozeModalVisible] = useState(false);
    const [interventionItem, setInterventionItem] = useState<string | null>(null);

    // Use the store
    const { items, history, deleteItem, completeItem, updateItem, checkReadyItems } = useDeferredStore();

    // Activate lifecycle hook
    useDeferredLifecycle();

    const upcomingItems = items.filter(i => i.status === 'waiting' || i.status === 'ready');
    const completedItems = history;

    const onRefresh = () => {
        setRefreshing(true);
        checkReadyItems();
        setTimeout(() => setRefreshing(false), 500);
    };

    const handleEdit = (id: string) => {
        console.log('Edit item:', id);
        // TODO: Implement edit modal if needed, or reuse SnoozeModal
    };

    const handleDelete = async (id: string) => {
        await deleteItem(id);
    };

    const handleComplete = async (id: string) => {
        await completeItem(id);
    };

    const handleItemPress = (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        if (item.status === 'ready') {
            // If ready, just complete it or open it (simulated)
            // For now, let's just complete it to show flow
            // In real app, this might open the deep link
            console.log('Opening ready item:', item.title);
        } else {
            // If not ready, show intervention
            setInterventionItem(id);
        }
    };

    const handleInterventionOpen = async () => {
        if (interventionItem) {
            // Log early access (TODO in store)
            console.log('Early access for:', interventionItem);
            setInterventionItem(null);
        }
    };

    const handleInterventionExtend = async () => {
        if (interventionItem) {
            const item = items.find(i => i.id === interventionItem);
            if (item) {
                await updateItem(interventionItem, {
                    returnTime: item.returnTime + 15 * 60 * 1000 // +15 mins
                });
            }
            setInterventionItem(null);
        }
    };

    const getCountdownString = (returnTime: number, status: string) => {
        if (status === 'ready') return 'Ready now!';
        const diff = Math.max(0, returnTime - Date.now());
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        if (hours > 0) return `Returns in ${hours}h ${minutes}m`;
        return `Returns in ${minutes}m`;
    };

    const isEmpty = upcomingItems.length === 0 && completedItems.length === 0;
    const activeInterventionItem = items.find(i => i.id === interventionItem);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Timeline</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                    />
                }
            >
                {isEmpty ? (
                    // Empty State
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📅</Text>
                        <Text style={styles.emptyTitle}>No snoozed items yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Snooze apps and notifications to focus on what matters
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => setSnoozeModalVisible(true)}
                        >
                            <Text style={styles.emptyButtonText}>Snooze Something</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Upcoming Section */}
                        {upcomingItems.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Returning Soon</Text>
                                {upcomingItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => handleItemPress(item.id)}
                                        activeOpacity={0.9}
                                    >
                                        <TimelineCard
                                            icon={item.icon}
                                            title={item.title}
                                            returnTime={new Date(item.returnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            reason={item.reason}
                                            countdown={getCountdownString(item.returnTime, item.status)}
                                            onEdit={() => handleEdit(item.id)}
                                            onDelete={() => handleDelete(item.id)}
                                            onComplete={() => handleComplete(item.id)}
                                            index={index}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* NOW Marker */}
                        {upcomingItems.length > 0 && completedItems.length > 0 && (
                            <NowMarker />
                        )}

                        {/* Completed Section */}
                        {completedItems.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Completed</Text>
                                {completedItems.map((item, index) => (
                                    <TimelineCard
                                        key={item.id}
                                        icon={item.icon}
                                        title={item.title}
                                        returnTime={new Date(item.returnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        reason={item.reason}
                                        countdown="Completed"
                                        index={index}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setSnoozeModalVisible(true)}
            >
                <Calendar size={24} color="#FFF" />
            </TouchableOpacity>

            {/* Modals */}
            <SnoozeModal
                visible={isSnoozeModalVisible}
                onClose={() => setSnoozeModalVisible(false)}
            />

            {activeInterventionItem && (
                <InterventionOverlay
                    visible={!!interventionItem}
                    itemName={activeInterventionItem.title}
                    returnTime={activeInterventionItem.returnTime}
                    reason={activeInterventionItem.reason}
                    onOpenAnyway={handleInterventionOpen}
                    onExtendSnooze={handleInterventionExtend}
                    onCancel={() => setInterventionItem(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: Spacing.l,
        paddingVertical: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.m,
    },
    headerTitle: {
        ...Typography.h2,
        color: Colors.text.primary,
    },
    scrollContent: {
        padding: Spacing.l,
        paddingBottom: 100,
    },
    section: {
        marginBottom: Spacing.l,
    },
    sectionTitle: {
        ...Typography.h4,
        color: Colors.text.secondary,
        marginBottom: Spacing.m,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 12,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: Spacing.l,
    },
    emptyTitle: {
        ...Typography.h3,
        color: Colors.text.primary,
        marginBottom: Spacing.s,
    },
    emptySubtitle: {
        ...Typography.bodyRegular,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.xl,
    },
    emptyButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.m,
        borderRadius: BorderRadius.l,
    },
    emptyButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: Spacing.l,
        bottom: Spacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});

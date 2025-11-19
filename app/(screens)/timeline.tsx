import { NowMarker } from '@/components/timeline/NowMarker';
import { TimelineCard } from '@/components/timeline/TimelineCard';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TimelineScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    // Mock data - will be replaced with store data
    const upcomingItems = [
        {
            id: '1',
            icon: '📷',
            title: 'Instagram',
            returnTime: 'Today at 8:00 PM',
            reason: 'Want evening relaxation not afternoon distraction',
            countdown: 'Returns in 3h 24m',
        },
        {
            id: '2',
            icon: '🐦',
            title: 'Twitter',
            returnTime: 'Tomorrow at 9:00 AM',
            reason: 'Check news in the morning only',
            countdown: 'Returns in 18h 45m',
        },
    ];

    const completedItems = [
        {
            id: '3',
            icon: '📧',
            title: 'Email',
            returnTime: 'Today at 2:00 PM',
            reason: 'Focus on deep work first',
            countdown: 'Completed',
        },
    ];

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleEdit = (id: string) => {
        console.log('Edit item:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete item:', id);
    };

    const isEmpty = upcomingItems.length === 0 && completedItems.length === 0;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} />
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
                            onPress={() => console.log('Snooze something')}
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
                                    <TimelineCard
                                        key={item.id}
                                        icon={item.icon}
                                        title={item.title}
                                        returnTime={item.returnTime}
                                        reason={item.reason}
                                        countdown={item.countdown}
                                        onEdit={() => handleEdit(item.id)}
                                        onDelete={() => handleDelete(item.id)}
                                        index={index}
                                    />
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
                                        returnTime={item.returnTime}
                                        reason={item.reason}
                                        countdown={item.countdown}
                                        index={index}
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
                onPress={() => console.log('Add new snooze')}
            >
                <Calendar size={24} color="#FFF" />
            </TouchableOpacity>
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
        justifyContent: 'space-between',
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

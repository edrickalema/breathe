import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Clock, Moon, Target, TrendingDown, TrendingUp, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type Period = 'week' | '7days' | '30days';

interface AppUsage {
    name: string;
    time: string;
    percentage: number;
    opens: number;
    dailyAverage: string;
    history: { time: string; duration: string }[];
}

export default function InsightsScreen() {
    const insets = useSafeAreaInsets();
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
    const [selectedApp, setSelectedApp] = useState<AppUsage | null>(null);

    // Mock data
    const metrics = [
        { id: 'screen', label: 'Screen Time', value: '4h 32m', trend: -12, icon: <Clock size={20} color={Colors.secondary} /> },
        { id: 'focus', label: 'Focus Time', value: '2h 15m', trend: 23, icon: <Zap size={20} color={Colors.primary} /> },
        { id: 'doomscroll', label: 'Doomscrolls', value: '3', trend: -40, icon: <Moon size={20} color={Colors.warning} /> },
        { id: 'adherence', label: 'Adherence', value: '85%', trend: 5, icon: <Target size={20} color={Colors.success} /> },
    ];

    const moodData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            data: [65, 72, 68, 80, 75, 70, 78],
        }],
    };

    const topApps: AppUsage[] = [
        {
            name: '📷 Instagram',
            time: '1h 45m',
            percentage: 38,
            opens: 12,
            dailyAverage: '25m',
            history: [
                { time: '10:30 AM', duration: '15m' },
                { time: '1:15 PM', duration: '45m' },
                { time: '8:00 PM', duration: '30m' },
            ]
        },
        {
            name: '🐦 Twitter',
            time: '52m',
            percentage: 19,
            opens: 8,
            dailyAverage: '15m',
            history: [
                { time: '9:00 AM', duration: '10m' },
                { time: '12:30 PM', duration: '20m' },
                { time: '6:45 PM', duration: '22m' },
            ]
        },
        {
            name: '📧 Email',
            time: '38m',
            percentage: 14,
            opens: 5,
            dailyAverage: '10m',
            history: [
                { time: '8:30 AM', duration: '15m' },
                { time: '2:00 PM', duration: '10m' },
                { time: '5:00 PM', duration: '13m' },
            ]
        },
        {
            name: '💬 Messages',
            time: '25m',
            percentage: 9,
            opens: 20,
            dailyAverage: '8m',
            history: [
                { time: '10:00 AM', duration: '5m' },
                { time: '11:30 AM', duration: '2m' },
                { time: '3:00 PM', duration: '10m' },
            ]
        },
        {
            name: '🎵 Spotify',
            time: '18m',
            percentage: 7,
            opens: 3,
            dailyAverage: '45m',
            history: [
                { time: '9:30 AM', duration: '18m' },
            ]
        },
    ];

    const insights = [
        { emoji: '🌙', text: 'You doomscroll most on Sunday evenings' },
        { emoji: '📈', text: 'Focus sessions are 40% longer this month' },
        { emoji: '⏰', text: 'You open Twitter within 10 min of waking up' },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <Text style={styles.header}>Insights</Text>

                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    {[
                        { id: 'week' as Period, label: 'This Week' },
                        { id: '7days' as Period, label: 'Last 7 Days' },
                        { id: '30days' as Period, label: 'Last 30 Days' },
                    ].map((period) => (
                        <TouchableOpacity
                            key={period.id}
                            style={[
                                styles.periodTab,
                                selectedPeriod === period.id && styles.periodTabActive,
                            ]}
                            onPress={() => setSelectedPeriod(period.id)}
                        >
                            <Text style={[
                                styles.periodText,
                                selectedPeriod === period.id && styles.periodTextActive,
                            ]}>
                                {period.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Metrics Grid */}
                <View style={styles.metricsGrid}>
                    {metrics.map((metric) => (
                        <View key={metric.id} style={styles.metricCard}>
                            <View style={styles.metricHeader}>
                                {metric.icon}
                                <View style={[
                                    styles.trendBadge,
                                    { backgroundColor: metric.trend > 0 ? Colors.success + '20' : Colors.danger + '20' }
                                ]}>
                                    {metric.trend > 0 ? (
                                        <TrendingUp size={12} color={Colors.success} />
                                    ) : (
                                        <TrendingDown size={12} color={Colors.danger} />
                                    )}
                                    <Text style={[
                                        styles.trendText,
                                        { color: metric.trend > 0 ? Colors.success : Colors.danger }
                                    ]}>
                                        {Math.abs(metric.trend)}%
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.metricValue}>{metric.value}</Text>
                            <Text style={styles.metricLabel}>{metric.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Mood Chart */}
                <View style={styles.chartSection}>
                    <Text style={styles.sectionTitle}>Mood Journey</Text>
                    <LineChart
                        data={moodData}
                        width={width - Spacing.l * 2}
                        height={200}
                        chartConfig={{
                            backgroundColor: Colors.surface,
                            backgroundGradientFrom: Colors.surface,
                            backgroundGradientTo: Colors.surface,
                            decimalPlaces: 0,
                            color: (opacity = 1) => Colors.primary,
                            labelColor: (opacity = 1) => Colors.text.tertiary,
                            style: {
                                borderRadius: BorderRadius.l,
                            },
                            propsForDots: {
                                r: '4',
                                strokeWidth: '2',
                                stroke: Colors.primary,
                            },
                        }}
                        bezier
                        style={styles.chart}
                        withInnerLines={false}
                        withOuterLines={false}
                    />
                </View>

                {/* Top Apps */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Top Distractions</Text>
                    {topApps.map((app, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.appCard}
                            onPress={() => setSelectedApp(app)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.appInfo}>
                                <Text style={styles.appName}>{app.name}</Text>
                                <Text style={styles.appTime}>{app.time}</Text>
                            </View>
                            <View style={styles.barContainer}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            width: `${app.percentage}%`,
                                            backgroundColor: Colors.primary + '40'
                                        }
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Pattern Insights */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Patterns</Text>
                    {insights.map((insight, index) => (
                        <View key={index} style={styles.insightCard}>
                            <Text style={styles.insightEmoji}>{insight.emoji}</Text>
                            <Text style={styles.insightText}>{insight.text}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>

            {/* App Detail Modal */}
            <Modal
                visible={!!selectedApp}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedApp(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedApp && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{selectedApp.name}</Text>
                                    <TouchableOpacity onPress={() => setSelectedApp(null)}>
                                        <X size={24} color={Colors.text.primary} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.modalStatsRow}>
                                    <View style={styles.modalStatItem}>
                                        <Text style={styles.modalStatValue}>{selectedApp.time}</Text>
                                        <Text style={styles.modalStatLabel}>Total Time</Text>
                                    </View>
                                    <View style={styles.modalStatItem}>
                                        <Text style={styles.modalStatValue}>{selectedApp.opens}</Text>
                                        <Text style={styles.modalStatLabel}>Opens</Text>
                                    </View>
                                    <View style={styles.modalStatItem}>
                                        <Text style={styles.modalStatValue}>{selectedApp.dailyAverage}</Text>
                                        <Text style={styles.modalStatLabel}>Daily Avg</Text>
                                    </View>
                                </View>

                                <Text style={styles.modalSectionTitle}>Usage History</Text>
                                <ScrollView style={styles.historyList}>
                                    {selectedApp.history.map((item, index) => (
                                        <View key={index} style={styles.historyItem}>
                                            <Text style={styles.historyTime}>{item.time}</Text>
                                            <Text style={styles.historyDuration}>{item.duration}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </>
                        )}
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
    scrollContent: {
        padding: Spacing.l,
        paddingBottom: 100,
    },
    header: {
        ...Typography.h1,
        color: Colors.text.primary,
        marginBottom: Spacing.xl,
    },
    // Period Selector
    periodSelector: {
        flexDirection: 'row',
        gap: Spacing.s,
        marginBottom: Spacing.xl,
    },
    periodTab: {
        flex: 1,
        paddingVertical: Spacing.s,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    periodTabActive: {
        borderBottomColor: Colors.primary,
    },
    periodText: {
        fontSize: 13,
        color: Colors.text.tertiary,
        fontWeight: '500',
    },
    periodTextActive: {
        color: Colors.text.primary,
        fontWeight: '600',
    },
    // Metrics Grid
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.m,
        marginBottom: Spacing.xl,
    },
    metricCard: {
        width: (width - Spacing.l * 2 - Spacing.m) / 2,
        backgroundColor: Colors.surface,
        padding: Spacing.m,
        borderRadius: BorderRadius.l,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.s,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    trendText: {
        fontSize: 10,
        fontWeight: '600',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    metricLabel: {
        fontSize: 12,
        color: Colors.text.tertiary,
    },
    // Chart
    chartSection: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginBottom: Spacing.m,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chart: {
        borderRadius: BorderRadius.l,
    },
    // Top Apps
    section: {
        marginBottom: Spacing.xl,
    },
    appCard: {
        backgroundColor: Colors.surface,
        padding: Spacing.m,
        borderRadius: BorderRadius.l,
        marginBottom: Spacing.m,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    appInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    appName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    appTime: {
        fontSize: 14,
        color: Colors.text.secondary,
        fontWeight: '500',
    },
    barContainer: {
        height: 8,
        backgroundColor: Colors.surfaceHighlight,
        borderRadius: 4,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 4,
    },
    // Insights
    insightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.m,
        borderRadius: BorderRadius.l,
        marginBottom: Spacing.s,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    insightEmoji: {
        fontSize: 24,
        marginRight: Spacing.m,
    },
    insightText: {
        flex: 1,
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.xl,
        maxHeight: height * 0.8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    modalTitle: {
        ...Typography.h2,
        color: Colors.text.primary,
    },
    modalStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
        backgroundColor: Colors.background,
        padding: Spacing.m,
        borderRadius: BorderRadius.l,
    },
    modalStatItem: {
        alignItems: 'center',
    },
    modalStatValue: {
        ...Typography.h3,
        color: Colors.text.primary,
        marginBottom: 4,
    },
    modalStatLabel: {
        fontSize: 12,
        color: Colors.text.tertiary,
    },
    modalSectionTitle: {
        ...Typography.h4,
        color: Colors.text.secondary,
        marginBottom: Spacing.m,
    },
    historyList: {
        maxHeight: 300,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    historyTime: {
        fontSize: 16,
        color: Colors.text.primary,
    },
    historyDuration: {
        fontSize: 16,
        color: Colors.text.secondary,
        fontWeight: '500',
    },
});

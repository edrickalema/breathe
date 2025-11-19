import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Clock, Moon, Target, TrendingDown, TrendingUp, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type Period = 'week' | '7days' | '30days';

export default function InsightsScreen() {
    const insets = useSafeAreaInsets();
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');

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

    const topApps = [
        { name: '📷 Instagram', time: '1h 45m', percentage: 38 },
        { name: '🐦 Twitter', time: '52m', percentage: 19 },
        { name: '📧 Email', time: '38m', percentage: 14 },
        { name: '💬 Messages', time: '25m', percentage: 9 },
        { name: '🎵 Spotify', time: '18m', percentage: 7 },
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
                        <View key={index} style={styles.appItem}>
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
                        </View>
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
    appItem: {
        marginBottom: Spacing.m,
    },
    appInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    appName: {
        fontSize: 15,
        color: Colors.text.primary,
    },
    appTime: {
        fontSize: 14,
        color: Colors.text.tertiary,
    },
    barContainer: {
        height: 6,
        backgroundColor: Colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 3,
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
});

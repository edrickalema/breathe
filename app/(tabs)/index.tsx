import { Companion } from '@/components/Companion';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { Clock, Moon, Zap } from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Mock Data (Will be replaced with Store data later)
    const stats = [
        {
            id: 'focus',
            label: "Focus Time",
            value: "45m",
            icon: <Zap size={20} color={Colors.primary} />,
            trend: "+12%"
        },
        {
            id: 'screen',
            label: "Screen Time",
            value: "2h 10m",
            icon: <Clock size={20} color={Colors.secondary} />,
            trend: "-5%"
        },
        {
            id: 'adherence',
            label: "Snooze Success",
            value: "85%",
            icon: <Moon size={20} color={Colors.mood.proud} />,
            trend: "+2%"
        },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Top Section: Companion */}
                <View style={styles.topSection}>
                    <View style={styles.companionWrapper}>
                        <Companion mood="calm" size={width * 0.6} />
                    </View>
                    <Text style={styles.greeting}>Welcome back</Text>
                    <Text style={styles.subGreeting}>Take a moment to breathe</Text>
                </View>

                {/* Middle Section: Actions */}
                <View style={styles.actionSection}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: Colors.primary }]}
                        onPress={() => router.push('/(screens)/focus')}
                        activeOpacity={0.9}
                    >
                        <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Start Focus Session</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: Colors.secondary }]}
                        onPress={() => router.push('/(screens)/timeline')}
                        activeOpacity={0.9}
                    >
                        <Text style={[styles.actionButtonText, { color: '#000' }]}>Snooze Something</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Section: Stats */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Today's Overview</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statsScroll}
                    >
                        {stats.map((stat) => (
                            <View key={stat.id} style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <View style={styles.iconContainer}>
                                        {stat.icon}
                                    </View>
                                    <Text style={[
                                        styles.trendText,
                                        { color: stat.trend.startsWith('+') ? Colors.success : Colors.warning }
                                    ]}>
                                        {stat.trend}
                                    </Text>
                                </View>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </ScrollView>
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
        paddingBottom: Spacing.xl,
    },
    topSection: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        minHeight: 400,
        justifyContent: 'center',
    },
    companionWrapper: {
        marginBottom: Spacing.l,
    },
    greeting: {
        ...Typography.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    subGreeting: {
        ...Typography.bodyRegular,
        color: Colors.text.tertiary,
    },
    actionSection: {
        paddingHorizontal: Spacing.l,
        gap: Spacing.m,
        marginBottom: Spacing.xl,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",

    },
    actionButton: {
        height: 56,
        borderRadius: BorderRadius.l,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        padding: Spacing.m,


    },
    actionButtonText: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    statsSection: {
        paddingLeft: Spacing.l,
    },
    sectionTitle: {
        ...Typography.h4,
        color: Colors.text.secondary,
        marginBottom: Spacing.m,
    },
    statsScroll: {
        paddingRight: Spacing.l,
        gap: Spacing.m,
    },
    statCard: {
        width: 150,
        padding: Spacing.m,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.l,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.m,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statValue: {
        ...Typography.h3,
        color: Colors.text.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: Colors.text.secondary,
    },
});

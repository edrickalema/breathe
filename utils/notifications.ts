import * as Notifications from 'expo-notifications';

// Configure notifications to show even when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

export async function scheduleReturnNotification(
    id: string,
    title: string,
    body: string,
    seconds: number
) {
    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
            data: { type: 'deferred_return', itemId: id },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: seconds,
            repeats: false,
        },
    });
    return identifier;
}

export async function cancelNotification(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function requestNotificationPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

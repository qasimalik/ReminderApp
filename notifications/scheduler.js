import * as Notifications from 'expo-notifications';

export async function scheduleNotification(seconds=10) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Reminder',
      body: 'This is your scheduled notification.',
      sound: 'default',
    },
    trigger: {
      seconds,
    },
  });
}

export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

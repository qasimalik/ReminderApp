import * as Notifications from 'expo-notifications';

export function setupNotificationListeners() {
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification tapped:', response);
    // Add your navigation or logic here
  });

  return () => {
    responseListener.remove();
  };
}

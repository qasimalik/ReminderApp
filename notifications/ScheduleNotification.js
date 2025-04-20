import * as Notifications from "expo-notifications";

export async function scheduleNotification({ title, body, triggerInSeconds }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: { seconds: triggerInSeconds },
  });
}

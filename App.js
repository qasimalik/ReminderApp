import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SQLiteProvider } from "expo-sqlite";
import { Text, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import AddReminderScreen from "./screens/AddReminderScreen";
import ReminderScreen from "./screens/ReminderScreen";
import DetailsScreen from "./components/DetailScreen";
import NewListScreen from "./screens/NewListScreen";
import ScheduledScreen from "./screens/ScheduledScreen";
import TodayScreen from "./screens/TodayScreen";
import ReminderCard from "./screens/ReminderCard";
import CompletedReminderScreen from "./screens/CompletedReminderScreen";
import AllRemindersScreen from "./screens/AllRemindersScreen";
import FlaggedRemindersScreen from "./screens/FlaggedRemindersScreen";
import * as Notifications from "expo-notifications";
import { useSchemaReady } from "./db/useSchemaReady";
import SubtaskScreen from "./screens/SubtaskScreen";

const Stack = createStackNavigator();

// Set up notification handler globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function MainNavigator({ reminders, setReminders }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Add Reminder">
          {(props) => (
            <AddReminderScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Reminders">
          {(props) => (
            <ReminderScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Details">
          {(props) => (
            <DetailsScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="New List">
          {(props) => (
            <NewListScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Scheduled">
          {(props) => (
            <ScheduledScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Today">
          {(props) => (
            <TodayScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ReminderCard">
          {(props) => (
            <ReminderCard
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Completed">
          {(props) => (
            <CompletedReminderScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="All">
          {(props) => (
            <AllRemindersScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Flagged">
          {(props) => (
            <FlaggedRemindersScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Subtask">
          {(props) => (
            <SubtaskScreen
              {...props}
              reminders={reminders}
              setReminders={setReminders}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AppContent() {
  const [reminders, setReminders] = useState([]);
  const isSchemaReady = useSchemaReady(); // 👈 call schema initializer

  if (!isSchemaReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Setting up database...</Text>
      </View>
    );
  }

  return <MainNavigator reminders={reminders} setReminders={setReminders} />;
}

export default function App() {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received: ", notification);
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <SQLiteProvider databaseName="reminders.db">
          <AppContent />
        </SQLiteProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

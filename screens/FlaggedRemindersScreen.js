import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useReminderDAO } from "../db/reminderDAO";
import { useSchemaReady } from "../db/useSchemaReady";
import { useSubReminderDAO } from "../db/subReminderDAO";

const FlaggedReminderScreen = ({ route }) => {
  const navigation = useNavigation();
  const isSchemaReady = useSchemaReady();
  const { getFlaggedReminders} = useReminderDAO();
  const { getSubReminders } = useSubReminderDAO();

  const [reminders, setReminders] = useState([]);
  const [expandedReminderId, setExpandedReminderId] = useState(null);
  const [subReminders, setSubReminders] = useState({}); // { [reminderId]: [subtasks] }

  const { id } = route.params || { id: null };

  const showToast = (message) => {
    Platform.OS === "android"
      ? ToastAndroid.show(message, ToastAndroid.SHORT)
      : Alert.alert(message);
  };

  useEffect(() => {
    if (!isSchemaReady) return;

    const loadReminders = async () => {
      try {
        const fetchedReminders = await getFlaggedReminders(id);
        setReminders(fetchedReminders);
      } catch (error) {
        console.error("Error loading reminders:", error);
        showToast("Failed to load reminders.");
      }
    };

    const unsubscribe = navigation.addListener("focus", loadReminders);
    loadReminders();
    return unsubscribe;
  }, [navigation, isSchemaReady, getFlaggedReminders, id]);

  const toggleSubReminders = async (reminderId) => {
    if (expandedReminderId === reminderId) {
      setExpandedReminderId(null);
    } else {
      if (!subReminders[reminderId]) {
        try {
          const subs = await getSubReminders(reminderId);
          setSubReminders((prev) => ({ ...prev, [reminderId]: subs }));
        } catch (error) {
          console.error("Error fetching sub-reminders:", error);
        }
      }
      setExpandedReminderId(reminderId);
    }
  };

  const renderItem = ({ item }) => {
    const subs = subReminders[item.id] || [];
    const hasSubs = subs.length > 0;
    const isExpanded = expandedReminderId === item.id;

    return (
      <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate("ReminderCard", { reminderId: item.id })}
    >
      <View style={styles.reminderItem}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.circle} />
            <View style={{ flex: 1 }}>
              <Text style={styles.reminderText}>{item.title}</Text>
              <Text style={styles.note}>{item.note}</Text>
              {item.date && (
                <Text style={styles.meta}>
                  📅 {new Date(item.date).toLocaleDateString()}
                </Text>
              )}

              {item.time && (
                <Text style={styles.meta}>
                  ⏰{" "}            
                  {item.time}
                </Text>
              )}

              {item.tag && <Text style={styles.meta}>🏷️ Tag: {item.tag}</Text>}
            </View>
            {hasSubs && (
              <TouchableOpacity onPress={() => toggleSubReminders(item.id)}>
                <FontAwesome6
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="orange"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            )}
          </View>

          {isExpanded && hasSubs && (
            <FlatList
              data={subs}
              keyExtractor={(sub) => sub.id.toString()}
              renderItem={({ item: sub }) => (
                <View style={styles.subReminderItem}>
                  <View style={styles.subDot} />
                  <Text style={styles.subReminderText}>{sub.title}</Text>
                </View>
              )}
              style={{ marginTop: 10 }}
            />
          )}
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome6 name="chevron-left" size={18} color="#4da6ff" />
            <Text style={styles.backText}>Lists</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Flagged</Text>
          <FontAwesome6 name="ellipsis" size={18} color="#4da6ff" />
        </View>

        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          style={styles.subreminderList}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#aaa" }}>
              No reminders in this list.
            </Text>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 5,
    color: "#4da6ff",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reminderItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "orange",
    marginRight: 10,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  note: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  meta: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  subReminderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginLeft: 20,
  },
  subDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#999",
    marginRight: 8,
  },
  subReminderText: {
    fontSize: 14,
    color: "#555",
  },
  subreminderList: {
    marginTop: 10,
  },
};

export default FlaggedReminderScreen;

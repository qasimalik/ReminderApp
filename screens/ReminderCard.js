import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome6 } from "@expo/vector-icons";
import { useReminderDAO } from "../db/reminderDAO";
import { useSubReminderDAO } from "../db/subReminderDAO";

export default function ReminderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { reminderId } = route.params;
  const { getReminderById, deleteReminderById, markReminderAsDone } =
    useReminderDAO();
  const { getSubReminders } = useSubReminderDAO();
  const [reminder, setReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subReminders, setSubReminders] = useState([]);

  const showToast = (msg) => {
    Platform.OS === "android"
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : Alert.alert(msg);
  };

  useEffect(() => {
    const loadReminder = async () => {
      try {
        const result = await getReminderById(reminderId);
        if (result) {
          setReminder(result);
          const subtasks = await getSubReminders(reminderId);
          setSubReminders(subtasks);
          console.log("Subtasks:", subtasks);
        } else {
          showToast("Reminder not found");
        }
      } catch (e) {
        console.error("Error loading reminder", e);
        showToast("Failed to load reminder");
      } finally {
        setLoading(false);
      }
    };
    loadReminder();
  }, [reminderId]);

  const handleDelete = async () => {
    try {
      await deleteReminderById(reminderId);
      showToast("Reminder deleted successfully!");
      navigation.goBack();
    } catch (e) {
      console.error("Error deleting reminder", e);
      showToast("Failed to delete reminder");
    }
  };

  const handleEdit = () => {
    navigation.navigate("EditReminder", { reminderId });
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubReminderById(subtaskId); // you need to create this in your subReminderDAO
      setSubReminders((prev) => prev.filter((s) => s.id !== subtaskId));
      showToast("Subtask deleted!");
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      showToast("Failed to delete subtask.");
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await markReminderAsDone(reminderId);
      showToast("Reminder marked as done!");

      setReminder((prev) => ({
        ...prev,
        isCompleted: 1,
      }));
      navigation.goBack();
    } catch (e) {
      console.error("Error marking reminder as done", e);
      showToast("Failed to mark reminder as done");
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "green";
      case "medium":
        return "#ffd700";
      case "high":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome6 name="chevron-left" size={18} color="#007AFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminder</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Reminder Card */}
      <ScrollView contentContainerStyle={styles.card}>
        <Text style={styles.title}>{reminder.title}</Text>

        {reminder.note ? (
          <Text style={styles.note}>{reminder.note}</Text>
        ) : null}

        <View style={styles.section}>
          {reminder.date && (
            <Text style={styles.meta}>
              📅 <Text style={styles.metaLabel}>Date:</Text>{" "}
              {new Date(reminder.date).toDateString()}
            </Text>
          )}
          {reminder.time && (
            <Text style={styles.meta}>
              ⏰ <Text style={styles.metaLabel}>Time:</Text> {reminder.time}
            </Text>
          )}
          {reminder.location && (
            <Text style={styles.meta}>
              📍 <Text style={styles.metaLabel}>Location:</Text>{" "}
              {reminder.location}
            </Text>
          )}
          {reminder.priority && reminder.priority !== "None" && (
            <Text style={styles.meta}>
              ❗ <Text style={styles.metaLabel}>Priority:</Text>{" "}
              <Text
                style={{
                  color: getPriorityColor(reminder.priority?.toLowerCase()),
                  fontWeight: "bold",
                }}
              >
                {reminder.priority}{" "}
              </Text>
            </Text>
          )}
          {reminder.flag ? <Text style={styles.flag}>🚩 Flagged</Text> : null}
          {reminder.tag && (
            <Text style={styles.meta}>
              🏷️ <Text style={styles.metaLabel}>Tag:</Text> {reminder.tag}
            </Text>
          )}
        </View>

        {subReminders.length > 0 && (
          <View style={styles.subtaskSection}>
            <Text style={styles.subtaskHeader}>Subtasks</Text>
            {subReminders.map((sub) => (
              <Swipeable
                key={sub.id}
                renderRightActions={() => (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSubtask(sub.id)}
                  >
                    <FontAwesome6 name="trash" size={18} color="#fff" />
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                )}
              >
                <View style={styles.subtaskItem}>
                  <View
                    style={[
                      styles.subtaskDot,
                      { backgroundColor: sub.isDone ? "green" : "#ccc" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.subtaskText,
                      sub.isDone && {
                        textDecorationLine: "line-through",
                        color: "#888",
                      },
                    ]}
                  >
                    {sub.title}
                  </Text>
                </View>
              </Swipeable>
            ))}
          </View>
        )}

        <View style={styles.createdAtBox}>
          <Text style={styles.createdAt}>
            Created At: {new Date(reminder.createdAt).toLocaleString()}
          </Text>
        </View>

        {/* Footer Action Buttons */}
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.actionButtonBlue}
            onPress={handleEdit}
          >
            <FontAwesome6 name="pen" size={16} color="#fff" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonRed}
            onPress={handleDelete}
          >
            <FontAwesome6 name="trash" size={16} color="#fff" />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>

          {reminder.isCompleted ? (
            <View style={[styles.actionButtonGreen, { opacity: 0.6 }]}>
              <FontAwesome6 name="check" size={16} color="#fff" />
              <Text style={styles.actionText}>Completed</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.actionButtonGreen}
              onPress={handleMarkAsDone}
            >
              <FontAwesome6 name="check" size={16} color="#fff" />
              <Text style={styles.actionText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "ios" ? 44 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  note: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    lineHeight: 22,
  },
  section: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  meta: {
    fontSize: 15,
    color: "#333",
    marginVertical: 6,
  },
  flag: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
    marginVertical: 6,
  },
  metaLabel: {
    fontWeight: "600",
    color: "#000",
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  subtaskSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },

  subtaskHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#222",
  },

  subtaskItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  subtaskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },

  subtaskText: {
    fontSize: 15,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 2,
    borderRadius: 10,
    flexDirection: "row",
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  createdAtBox: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  createdAt: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
  timestamp: {
    fontSize: 13,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  actionButtonBlue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  actionButtonRed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  actionButtonGreen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});

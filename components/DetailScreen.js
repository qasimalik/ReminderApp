import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import CustomToggleSwitch from "./CustomToggleSwitch";

import { useReminderDAO } from "../db/reminderDAO";

export default function DetailsScreen({ navigation, route }) {
  const { reminderDraft, reminderTitle = "Reminder" } = route?.params || {};
  const { title = "", note = "", id } = reminderDraft || {};

  const [dateEnabled, setDateEnabled] = useState(false);
  const [timeEnabled, setTimeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [flagEnabled, setFlagEnabled] = useState(false);
  const [priority, setPriority] = useState("None");

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { addReminder } = useReminderDAO();

  const showToast = (message) => {
    Platform.OS === "android"
      ? ToastAndroid.show(message, ToastAndroid.SHORT)
      : Alert.alert(message);
  };

  const handleAddReminder = async () => {
    try {
      const newId = await addReminder({
        list_id: id,
        title,
        note,
        // date: dateEnabled ? date.toISOString() : ,
        // save the date as a string but by default save today's date
        date: dateEnabled ? date.toISOString() : new Date().toISOString(),
        time: timeEnabled
          ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        location: locationEnabled ? "User selected" : null,
        tag: "general", // Placeholder for now
        priority,
        flag: flagEnabled,
        whenMessaging: false,
        imageUri: null,
        url: null,
      });
      console.log("Saved reminder:", newId);
      navigation.goBack();
      showToast("Reminder saved successfully!");
    } catch (err) {
      console.error("Error saving reminder", err);
      showToast("Error saving reminder");
    }
  };

  const SettingRow = ({ label, value, onValueChange, icon }) => (
    <View style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <CustomToggleSwitch
        value={value}
        onToggle={() => onValueChange(!value)}
      />
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome6 name="chevron-left" size={18} color="#4da6ff" />
            <Text style={styles.reminderTitle}>{reminderTitle}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <TouchableOpacity onPress={handleAddReminder}>
            <Text style={styles.add}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* Date Picker */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.row}
          >
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.valueText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          {/* Time Picker */}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.row}
          >
            <Text style={styles.icon}>🕒</Text>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.valueText}>
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}

          {/* Tags navigation */}
          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate("Tags")}
          >
            <Text style={styles.icon}>#️⃣</Text>
            <Text style={styles.label}>Tags</Text>
          </TouchableOpacity>

          {/* Toggles */}
          <SettingRow
            label="Location"
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            icon="📍"
          />
          <SettingRow
            label="Flag"
            value={flagEnabled}
            onValueChange={setFlagEnabled}
            icon="🚩"
          />

          {/* Priority Picker */}
          <View style={styles.dropdownRow}>
            <Text style={styles.icon}>❗</Text>
            <Text style={styles.label}>Priority</Text>
            <Picker
              selectedValue={priority}
              onValueChange={setPriority}
              style={styles.picker}
            >
              <Picker.Item label="None" value="None" />
              <Picker.Item label="Low" value="Low" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="High" value="High" />
            </Picker>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reminderTitle: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  add: {
    color: "#007AFF",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  label: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    fontSize: 20,
    width: 30,
    textAlign: "center",
  },
  valueText: {
    fontSize: 15,
    color: "#888",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  picker: {
    flex: 1,
    ...Platform.select({
      android: {
        marginLeft: 10,
      },
    }),
  },
});

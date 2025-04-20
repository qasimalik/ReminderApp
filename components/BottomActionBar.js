// components/BottomActionBar.js
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const BottomActionBar = ({
  onNewReminderPress,
  onNewListPress,
  showNewList = false,
}) => {
  return (
    <View style={styles.container}>
      {showNewList && (
        <TouchableOpacity style={styles.smallButton} onPress={onNewListPress}>
          <Text style={styles.smallButtonText}>New List</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.mainButton} onPress={onNewReminderPress}>
        <FontAwesome
          name="plus-circle"
          size={24}
          color="#007AFF"
          style={styles.icon}
        />
        <Text style={styles.mainButtonText}>New Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingHorizontal: 10,  
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  smallButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  smallButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    marginLeft: "auto", // push to right
  },
  mainButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "700",
  },
  icon: {
    marginRight: 8,
  },
});

export default BottomActionBar;

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useReminderDAO } from "../db/reminderDAO";

const TileView = () => {
  const navigation = useNavigation();
  const {
    countCompletedReminders,
    countFlaggedReminders,
    countAllIncompleteReminders,
  } = useReminderDAO();

  const [counts, setCounts] = useState({
    completed: 0,
    flagged: 0,
    all: 0,
  });

  const [loading, setLoading] = useState(true); // ✅ Add this

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true); // ✅ Properly declared now

        const completed = await countCompletedReminders();
        const flagged = await countFlaggedReminders();
        const all = await countAllIncompleteReminders();

        console.log("Tile counts fetched:", { completed, flagged, all });

        setCounts({ completed, flagged, all });
      } catch (error) {
        console.error("Error fetching tile counts:", error);
      } finally {
        setLoading(false); // ✅ Done loading
      }
    };

    fetchCounts();
  }, []);

  const tiles = [
    { icon: "calendar-day", label: "Today", count: 0, color: "#007AFF" },
    { icon: "calendar-week", label: "Scheduled", count: 0, color: "red" },
    { icon: "clipboard-list", label: "All", count: counts.all, color: "black" },
    { icon: "flag", label: "Flagged", count: counts.flagged, color: "grey" },
    { icon: "check-circle", label: "Completed", count: counts.completed, color: "green" },
  ];

  const handleTilePress = (label) => {
    navigation.navigate(label); // Simple and dynamic
  };

  return (
    <>
      {tiles.map(({ icon, label, count, color }, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tile}
          onPress={() => handleTilePress(label)}
        >
          <FontAwesome6 name={icon} size={30} color={color} />
          <Text style={styles.count}>
            {loading ? "..." : count}
          </Text>
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexBasis: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  count: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TileView;

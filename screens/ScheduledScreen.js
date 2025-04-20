import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ScheduledScreen = () => {
  const navigation = useNavigation();
  const [scheduledDates, setScheduledDates] = useState([]);

  useEffect(() => {
    // Generate an array of dates.
    const getDates = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const nextDates = [];
      for (let i = 0; i < 5; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i + 2); // Start from +2 to skip Today and Tomorrow
        nextDates.push(nextDate);
      }

      const restOfApril = new Date(today);
      restOfApril.setDate(today.getDate() + 7);

      setScheduledDates([
        { label: "Today", date: today },
        { label: "Tomorrow", date: tomorrow },
        ...nextDates.map((date) => ({
          label: date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
          date,
        })),
        { label: "Rest of April", date: restOfApril },
        {
          label: "May",
          date: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        },
        {
          label: "June",
          date: new Date(today.getFullYear(), today.getMonth() + 2, 1),
        },
        {
          label: "July",
          date: new Date(today.getFullYear(), today.getMonth() + 3, 1),
        },
        {
          label: "August",
          date: new Date(today.getFullYear(), today.getMonth() + 4, 1),
        },
        {
          label: "September",
          date: new Date(today.getFullYear(), today.getMonth() + 5, 1),
        },
        {
          label: "October",
          date: new Date(today.getFullYear(), today.getMonth() + 6, 1),
        },
      ]);
    };

    getDates();
  }, []);

  const renderItem = ({ item }) => {
    let displayDate = "";
    if (item.date) {
      const today = new Date();
      if (item.label === "Today") {
        displayDate = today.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
      } else if (item.label === "Tomorrow") {
        displayDate = today.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
      } else {
        displayDate = item.date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
      }
    }

    return (
      <TouchableOpacity style={styles.item}>
        <View style={styles.circle} />
        <Text style={styles.itemText}>
          {item.label} {displayDate ? `(${displayDate})` : ""}
        </Text>
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
          <Text style={styles.headerTitle}>Scheduled</Text>
          <FontAwesome6 name="ellipsis" size={18} color="#4da6ff" />
        </View>

        <FlatList
          data={scheduledDates}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={styles.list}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
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
  list: {
    marginTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "orange", // Or any color you prefer
    marginRight: 15,
  },
});

export default ScheduledScreen;

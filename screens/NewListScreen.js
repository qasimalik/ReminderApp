import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useListDAO } from "../db/listDAO"; // Import the hook

const NewListScreen = ({ navigation }) => {
  const [listName, setListName] = useState("");
  const [listType, setListType] = useState("Standard");
  const [selectedColor, setSelectedColor] = useState("#007AFF");
  const [selectedIcon, setSelectedIcon] = useState("list-ul");
  const { addList } = useListDAO(); // Use the addList function from the hook

  const showToast = (message) => {
      Platform.OS === "android"
        ? ToastAndroid.show(message, ToastAndroid.SHORT)
        : Alert.alert(message);
    }

  const handleDone = async () => {
    if (!listName.trim()) {
      alert("Please enter a list name."); // Basic validation
      return;
    }

    try {
      // Use the addList function to save to the database
      const newListId = await addList({
        name: listName,
        color: selectedColor,
        icon: selectedIcon,
      });
      if (newListId) {
        console.log("List saved successfully with ID:", newListId);
        navigation.goBack(); // Go back after successful save
        showToast("List saved successfully!");
      } else {
        console.error("Failed to save the list.");
        showToast("Failed to save list. Please try again.");

      }
    } catch (error) {
      console.error("Error saving list:", error);
      showToast("An error occurred while saving the list.");
    }
  };

  const handleListTypePress = () => {
    console.log("List Type Pressed");
  };

  const handleColorPress = (color) => {
    setSelectedColor(color);
  };

  const handleIconPress = (iconName) => {
    setSelectedIcon(iconName);
  };

  const colors = [
    "#FF3B30",
    "#FF9500",
    "#FFCC00",
    "#4CD964",
    "#5AC8FA",
    "#007AFF",
    "#5856D6",
    "#AF52DE",
    "#FF2D55",
    "#C69B7B",
    "#8E8E93",
    "#FFD700",
  ];

    const icons = [
        "face-smile", "list-ul", "bookmark", "thumbtack", "lightbulb", "gift", "cake-candles",
        "graduation-cap", "briefcase", "ruler-vertical", "file-lines", "book", "wallet",
        "credit-card", "money-bill-transfer", "mosque", "person-running", "utensils", "wine-glass",
        "pills", "stethoscope", "chair", "house", "building", "code",
    ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New List</Text>
          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.headerButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.centralIconContainer}>
            <View
              style={[
                styles.iconPlaceholder,
                { backgroundColor: selectedColor },
                styles.iconShadow,
              ]}
            >
              <FontAwesome6 name={selectedIcon} size={60} color="white" />
            </View>
            <TextInput
              style={styles.listNameInput}
              placeholder="List Name"
              value={listName}
              onChangeText={setListName}
            />
          </View>

          <TouchableOpacity
            style={styles.listTypeRow}
            onPress={handleListTypePress}
          >
            <FontAwesome6 name={selectedIcon} size={24} color={selectedColor} />
            <Text style={styles.listTypeText}>List Type</Text>
            <View style={styles.rightContent}>
              <Text style={styles.listTypeValue}>{listType}</Text>
              <FontAwesome6
                name="chevron-right"
                size={20}
                color="#C7C7CC"
              />
            </View>
          </TouchableOpacity>

          <View style={styles.colorPalette}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: color,
                    borderWidth: selectedColor === color ? 3 : 0,
                    borderColor: "#000",
                  },
                ]}
                onPress={() => handleColorPress(color)}
              />
            ))}
          </View>

          <View style={styles.iconsGrid}>
            {icons.map((icon, index) => (
              <TouchableOpacity
                key={index}
                style={styles.iconGridItem}
                onPress={() => handleIconPress(icon)}
              >
                <FontAwesome6 name={icon} size={28} color="#8E8E93" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "#F2F2F7",
    borderBottomWidth: 0.5,
    borderBottomColor: "#D1D1D6",
  },
  headerButton: {
    fontSize: 17,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  centralIconContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  iconPlaceholder: {
        width: 110,
        height: 110,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
  },
  iconShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  listNameInput: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
  listTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  listTypeText: {
    fontSize: 17,
    marginLeft: 10,
    color: "#000",
    flex: 1,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  listTypeValue: {
    fontSize: 17,
    color: "#8E8E93",
    marginRight: 5,
  },
  colorPalette: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    justifyContent: "space-around",
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
  },
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    justifyContent: "space-around",
  },
  iconGridItem: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
});

export default NewListScreen;


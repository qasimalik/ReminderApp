import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  ToastAndroid,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useListDAO } from "../db/listDAO";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AddReminderScreen() {
  const db = useSQLiteContext();
  const { getLists } = useListDAO();
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [listIcon, setListIcon] = useState("list-ul");
  const [listColor, setListColor] = useState("");

  // Toast for Android & Alert for iOS
  const showToast = (message) => {
    Platform.OS === "android"
      ? ToastAndroid.show(message, ToastAndroid.SHORT)
      : Alert.alert(message);
  };

  // Fetch all lists when screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchLists = async () => {
        try {
          const fetchedLists = await getLists();
          setLists(fetchedLists);
          if (fetchedLists.length > 0 && !selectedListId) {
            setSelectedListId(fetchedLists[0].id);
          }
        } catch (error) {
          console.error("Error fetching lists:", error);
        }
      };

      fetchLists();
    }, [getLists])
  );

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDropdownVisible(!isDropdownVisible);
  };

  const handleNavigateToDetails = () => {
    if (!title) {
      showToast("Please enter a title first");
      return;
    }
  
    const reminderDraft = {
      title,
      note,
      id: selectedListId, // Ensure this comes from your selected list
    };
  
    console.log("Navigating to Details with reminderDraft:", reminderDraft);
  
    navigation.navigate("Details", { reminderDraft, reminderTitle: title });
  };

  const selectedList = lists.find((list) => list.id === selectedListId);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Reminder</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Input Fields */}
        <View style={styles.inputBox}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          <TextInput
            style={styles.noteInput}
            placeholder="Notes"
            placeholderTextColor="#888"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Navigate to Details */}
        <TouchableOpacity style={styles.optionRow} onPress={handleNavigateToDetails}>
          <Text style={styles.optionLabel}>Details</Text>
          <View style={{ marginLeft: "auto" }}>
            <FontAwesome6 name="chevron-right" color="#888" />
          </View>
        </TouchableOpacity>

        {/* List Dropdown */}
        <TouchableOpacity style={styles.optionRow} onPress={toggleDropdown}>
          <View style={styles.listIconContainer}>
            <FontAwesome6 name={listIcon} size={16} color={listColor} />
          </View>
          <Text style={styles.optionLabel}>List</Text>
          <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.selectedList}>
              {selectedList?.name || "Select"}
            </Text>
            <FontAwesome6
              name={isDropdownVisible ? "chevron-up" : "chevron-down"}
              color="orange"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        {/* Dropdown Items */}
        {isDropdownVisible && (
          <View style={styles.dropdown}>
            {lists.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSelectedListId(item.id);
                  setDropdownVisible(false);
                  setListColor(item.color);
                  setListIcon(item.icon);
                  console.log("Selected List ID:", item.id);
                  console.log("Selected List Name:", item.name);
                  console.log("Selected List Color:", item.color);
                  console.log("Selected List Icon Name:", listColor);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>{item.name}</Text>
              </TouchableOpacity>
              
            ))}

          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f9",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cancel: {
    color: "#007AFF",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  inputBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  noteInput: {
    fontSize: 15,
    color: "#333",
  },
  optionRow: {
    backgroundColor: "white",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 10,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 10,
  },
  listIconContainer: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
    padding: 6,
    marginRight: 10,
  },
  selectedList: {
    fontSize: 16,
    color: "#666",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 5,
    paddingVertical: 5,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 15,
    color: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

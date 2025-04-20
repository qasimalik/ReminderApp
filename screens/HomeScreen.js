import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import TileView from "../components/TileView";
import BottomActionBar from "../components/BottomActionBar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { useListDAO } from "../db/listDAO";
import { FontAwesome6 } from "@expo/vector-icons";
import ReminderListItem from "../components/RenderItem";
import { registerForPushNotificationsAsync, scheduleNotification } from "../notifications";

export default function HomeScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = useSQLiteContext();
  const { getLists, deleteListById } = useListDAO(); // Make sure deleteListById is exposed

  useFocusEffect(
    useCallback(() => {
      const fetchLists = async () => {
        setLoading(true);
        try {
          if (!db) {
            console.error("Database not initialized");
            return;
          }
          const fetchedLists = await getLists();
          console.log("Fetched lists:", fetchedLists);
          setLists(fetchedLists || []);
        } catch (error) {
          console.error("Failed to fetch lists:", error);
          setLists([]);
        } finally {
          setLoading(false);
        }
      };

      fetchLists();
      registerForPushNotificationsAsync();
    }, [getLists, db])
  );

  const handleSearch = (text) => {
    console.log("Search:", text);
  };

  const handleNewReminder = () => navigation.navigate("Add Reminder");
  const handleNewList = () => navigation.navigate("New List");

  const handleDeleteList = async (id) => {
    try {
      await deleteListById(id);
      setLists((prevLists) => prevLists.filter((list) => list.id !== id));
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteList(id)}
    >
      <FontAwesome6 name="trash" size={18} color="#fff" />
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );
  const renderItem = ({ item }) => (
    <ReminderListItem
      item={item}
      navigation={navigation}
      renderRightActions={renderRightActions}
    />
  );
  const renderHeader = () => (
    <View>
      <SearchBar onChangeText={handleSearch} placeholder="Search" />
      <View style={styles.tileContainer}>
        <TileView />
      </View>
      <Text style={styles.sectionTitle}>My Lists</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="orange"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <Text style={styles.empty}>No lists available.</Text>
            }
            contentContainerStyle={styles.container}
          />
        )}

        <BottomActionBar
          onNewReminderPress={handleNewReminder}
          onNewListPress={handleNewList}
          showNewList={true}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 100,
    backgroundColor: "#fff",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  empty: {
    textAlign: "center",
    marginVertical: 20,
    color: "#888",
    fontStyle: "italic",
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
  tileContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 60,
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    alignSelf: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
});

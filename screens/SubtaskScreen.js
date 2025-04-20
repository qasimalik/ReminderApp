import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

export default function SubtaskScreen({ navigation }) {

  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const inputRef = useRef(null);

  const route = useRoute();
  const { onSaveSubtasks, initialSubtasks =[] } = route.params || {};

  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const handleAddSubtask = () => {
    const newId = Date.now().toString();
    const newSubtask = {
      id: newId,
      title: "",
      isCompleted: false,
      isNew: true,
    };
    setSubtasks([...subtasks, newSubtask]);
    setEditingSubtaskId(newId);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSave = () => {
    if (!editingSubtaskId) return;
    const updated = subtasks
      .map((task) => {
        if (task.id === editingSubtaskId) {
          if (!task.title.trim()) {
            // remove if empty
            return null;
          }
          return { ...task, isNew: false };
        }
        return task;
      })
      .filter(Boolean);
    setSubtasks(updated);
    setEditingSubtaskId(null);
  };

  const toggleComplete = (id) => {
    setSubtasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteSubtask = (id) => {
    setSubtasks((prev) => prev.filter((task) => task.id !== id));
  };

  const renderSubtask = ({ item }) => {
    const isEditing = editingSubtaskId === item.id;

    return (
      <View style={styles.subtaskRow}>
        <TouchableOpacity onPress={() => toggleComplete(item.id)}>
          {item.isCompleted ? (
            <Ionicons name="checkmark-circle" size={24} color="#50C878" />
          ) : (
            <Ionicons name="ellipse-outline" size={24} color="#ccc" />
          )}
        </TouchableOpacity>

        {isEditing ? (
          <TextInput
            ref={inputRef}
            value={item.title}
            onChangeText={(text) =>
              setSubtasks((prev) =>
                prev.map((task) =>
                  task.id === item.id ? { ...task, title: text } : task
                )
              )
            }
            onBlur={handleSave}
            onSubmitEditing={handleSave}
            placeholder="Subtask title"
            style={styles.editInput}
            autoFocus
          />
        ) : (
          <TouchableOpacity
            style={styles.subtaskContent}
            onPress={() => {
              setEditingSubtaskId(item.id);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            <Text
              style={[
                styles.subtaskText,
                item.isCompleted && styles.subtaskCompleted,
              ]}
            >
              {item.title || "Untitled Subtask"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => deleteSubtask(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#aaa" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6 name="chevron-left" size={18} color="#4da6ff" />
        </TouchableOpacity>
        <Text style={styles.title}>Subtasks</Text>

        <TouchableOpacity
          onPress={() => {
            if (onSaveSubtasks) {
              const filtered = subtasks.filter((t) => t.title.trim() !== "");
              onSaveSubtasks(filtered);
            }
            navigation.goBack();
          }}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={subtasks}
        keyExtractor={(item) => item.id}
        renderItem={renderSubtask}
        contentContainerStyle={{ padding: 16 }}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddSubtask}>
        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.addButtonText}>Add Subtask</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  saveText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },  
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  subtaskContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  subtaskText: {
    fontSize: 16,
    color: "#333",
  },
  subtaskCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  editInput: {
    flex: 1,
    marginHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    paddingVertical: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  addButtonText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 8,
  },
});

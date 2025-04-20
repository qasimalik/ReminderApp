import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TodayView({ navigation }) {
  const [sections, setSections] = useState([
    { 
      id: '1', 
      title: 'Morning', 
      defaultTime: '06:00',
      reminders: []
    },
    { 
      id: '2', 
      title: 'Afternoon', 
      defaultTime: '12:00',
      reminders: []
    },
    { 
      id: '3', 
      title: 'Tonight', 
      defaultTime: '20:00',
      reminders: []
    },
  ]);
  
  const [activeSection, setActiveSection] = useState(null);
  const [editingReminder, setEditingReminder] = useState(null);
  const [newReminderText, setNewReminderText] = useState('');
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  
  // Navigate to details screen for a specific reminder
  const navigateToDetails = (reminder, sectionTitle) => {
    // This would be replaced with your actual navigation
    console.log(`Navigate to details for reminder: ${reminder.title} in ${sectionTitle}`);
    // Example navigation call:
    navigation.navigate('Details', { reminder, sectionTitle });
  };
  
  // Add a new blank reminder to a section
  const handleAddReminder = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const newReminder = {
      id: Date.now().toString(),
      title: '',
      time: section.defaultTime,
      note: '',
      isCompleted: false,
      isNew: true
    };
    
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          reminders: [...s.reminders, newReminder]
        };
      }
      return s;
    }));
    
    // Set this as the editing reminder
    setEditingReminder({
      sectionId,
      reminderId: newReminder.id
    });
    
    // Focus on the input after a short delay (after render)
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 100);
  };
  
  // Handle changes to reminder title
  const handleReminderTitleChange = (text) => {
    if (!editingReminder) return;
    
    setSections(sections.map(section => {
      if (section.id === editingReminder.sectionId) {
        return {
          ...section,
          reminders: section.reminders.map(reminder => {
            if (reminder.id === editingReminder.reminderId) {
              return { ...reminder, title: text };
            }
            return reminder;
          })
        };
      }
      return section;
    }));
  };
  
  // Save the edited reminder
  const saveReminderTitle = () => {
    if (!editingReminder) return;
    
    // Find the current reminder
    let currentReminder = null;
    let currentSection = null;
    
    sections.forEach(section => {
      if (section.id === editingReminder.sectionId) {
        currentSection = section;
        section.reminders.forEach(reminder => {
          if (reminder.id === editingReminder.reminderId) {
            currentReminder = reminder;
          }
        });
      }
    });
    
    // If reminder title is empty, remove it
    if (currentReminder && !currentReminder.title.trim()) {
      setSections(sections.map(section => {
        if (section.id === editingReminder.sectionId) {
          return {
            ...section,
            reminders: section.reminders.filter(reminder => 
              reminder.id !== editingReminder.reminderId
            )
          };
        }
        return section;
      }));
    } else if (currentReminder) {
      // Update the reminder to no longer be new
      setSections(sections.map(section => {
        if (section.id === editingReminder.sectionId) {
          return {
            ...section,
            reminders: section.reminders.map(reminder => {
              if (reminder.id === editingReminder.reminderId) {
                return { ...reminder, isNew: false };
              }
              return reminder;
            })
          };
        }
        return section;
      }));
    }
    
    setEditingReminder(null);
  };
  
  // Toggle reminder completion
  const toggleComplete = (sectionId, reminderId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          reminders: section.reminders.map(reminder => {
            if (reminder.id === reminderId) {
              return { ...reminder, isCompleted: !reminder.isCompleted };
            }
            return reminder;
          })
        };
      }
      return section;
    }));
  };
  
  // Render an editable reminder
  const renderEditableReminder = (section, reminder) => {
    const isEditing = editingReminder && 
                     editingReminder.sectionId === section.id && 
                     editingReminder.reminderId === reminder.id;
    
    if (isEditing) {
      return (
        <View style={styles.reminderItem}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => toggleComplete(section.id, reminder.id)}
          >
            {reminder.isCompleted ? (
              <View style={styles.checkedCircle} />
            ) : (
              <View style={styles.circleOutline}>
                <View style={styles.innerCircle} />
              </View>
            )}
          </TouchableOpacity>
          
          <TextInput
            ref={editInputRef}
            style={styles.editReminderInput}
            value={reminder.title}
            onChangeText={handleReminderTitleChange}
            placeholder="Reminder title"
            placeholderTextColor="#666"
            onBlur={saveReminderTitle}
            onSubmitEditing={saveReminderTitle}
            autoFocus
          />
          
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => {
              saveReminderTitle();
              navigateToDetails(reminder, section.title);
            }}
          >
            <Ionicons name="chevron-forward-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.reminderItem}>
        <TouchableOpacity 
          style={styles.checkbox}
          onPress={() => toggleComplete(section.id, reminder.id)}
        >
          {reminder.isCompleted ? (
            <View style={styles.checkedCircle} />
          ) : (
            <View style={styles.circleOutline}>
              <View style={styles.innerCircle} />
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.reminderContent}
          onPress={() => {
            setEditingReminder({
              sectionId: section.id,
              reminderId: reminder.id
            });
            setTimeout(() => {
              editInputRef.current?.focus();
            }, 100);
          }}
        >
          <Text style={[
            styles.reminderText,
            reminder.isCompleted && styles.completedText
          ]}>
            {reminder.title || "Untitled Reminder"}
          </Text>
          
          <Text style={styles.timeText}>{reminder.time}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => navigateToDetails(reminder, section.title)}
        >
          <Ionicons name="chevron-forward-circle" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
            <Text style={styles.backText}>Lists</Text>
          </TouchableOpacity>
          
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.optionsButton}>
              <Ionicons name="ellipsis-horizontal-circle" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>Today</Text>
        
        <ScrollView style={styles.scrollView}>
          {sections.map(section => (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              {section.reminders.map(reminder => (
                <View key={reminder.id}>
                  {renderEditableReminder(section, reminder)}
                </View>
              ))}
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleAddReminder(section.id)}
              >
                <View style={styles.circleOutline}>
                  <View style={styles.innerCircle} />
                </View>
                <Text style={styles.addText}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
    padding: 10,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '400',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsButton: {
    marginRight: 15,
  },
  doneButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  doneText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#888',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  checkbox: {
    marginRight: 10,
  },
  circleOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#555',
  },
  checkedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#007AFF',
  },
  reminderContent: {
    flex: 1,
    paddingLeft: 10,
  },
  reminderText: {
    fontSize: 17,
    color: 'black',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  timeText: {
    fontSize: 15,
    color: '#FF3B30',
    marginTop: 2,
  },
  detailsButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addText: {
    fontSize: 17,
    color: '#777',
    marginLeft: 10,
  },
  editReminderInput: {
    flex: 1,
    fontSize: 17,
    color: 'black',
    marginLeft: 10,
    padding: 0,
  },
});
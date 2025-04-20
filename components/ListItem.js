import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const ListItem = ({ title, icon, color, count, onPressReminders }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPressReminders}>
      <View style={[styles.iconWrapper, { backgroundColor: color }]}>
        <FontAwesome6 name={icon} size={18} color="#fff" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  count: {
    fontWeight: '600',
    fontSize: 14,
    color: '#888',
  },
});

export default ListItem;

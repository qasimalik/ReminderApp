import React, { useEffect, useRef } from 'react';
import { Animated, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';

const CustomToggleSwitch = ({ value, onToggle }) => {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 18], // Adjusted so thumb stays inside track
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#d1d1d6', '#4da6ff'], // iOS style off/on colors
  });

  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 30,
    borderRadius: 30,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
});

export default CustomToggleSwitch;

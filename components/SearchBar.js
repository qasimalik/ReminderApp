import React, {useState} from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const SearchBar = ({ placeholder, onChangeText }) => {

  const [text, setText] = useState('');
  const handleChange = (input) => {
    setText(input);
    onChangeText(input);
  }

  const handleClear = () => {
    setText('');
    onChangeText('');
  }

  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color="#999" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        value={text}
        onChangeText={handleChange}
      />
      {text.length > 0 ? (
        <TouchableOpacity onPress={handleClear}>
          <Icon name='close' size={20} color="#999" />
        </TouchableOpacity>
      ) : (<Icon name="mic" size={20} color="#999" />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f7',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    margin: 10,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    fontSize: 16,
    height: 40,
  }
});

export default SearchBar;

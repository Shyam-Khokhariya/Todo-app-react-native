import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from 'src/TypesAndInterfaces/AddTypes';
import Header from '../components/Header';

type addScreenProp = StackNavigationProp<RootStackParamList, 'Add'>;

function AddScreen() {
  const navigation = useNavigation<addScreenProp>();
  const [value, setValue] = useState<string>('');

  const addTodo = async () => {
    Keyboard.dismiss();
    if (value) {
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({title: value, userId: 1, completed: false}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => {
          console.log('response----', response);
          ToastAndroid.show('Successfully added todo', ToastAndroid.SHORT);
          navigation.navigate('Todo');
        })
        .catch(error => {
          console.error('error', JSON.stringify(error));
        });
    } else {
      ToastAndroid.show(
        'Please enter some text to add in todo list.',
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header title={'Add New Todo'} backIcon={true} />
      <View style={styles.body}>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textinput}
            placeholder="Add new Todo"
            value={value}
            onChangeText={value => setValue(value)}
            onSubmitEditing={addTodo}
          />
        </View>
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.addButton}>
          <Text style={styles.addText}>Back to Todo List</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

export default AddScreen;

const styles = StyleSheet.create({
  body: {
    marginTop: 50,
  },
  inputBox: {
    margin: 10,
  },
  textinput: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  addButton: {
    margin: 15,
    borderRadius: 10,
    backgroundColor: '#254177',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 14,
    color: '#fff',
  },
  loaderStyle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#efefef11',
  },
});

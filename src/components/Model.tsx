import React from 'react';
import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
interface Props {
  modalVisible: boolean;
  closeModel: () => void;
  modalItem: import('src/screens/Todo').ToDoList;
  setModelItem: (modalItem: import('src/screens/Todo').ToDoList | null) => void;
  loadTodos: () => void;
}

const Model: React.FC<Props> = ({
  modalVisible,
  closeModel,
  modalItem,
  setModelItem,
  loadTodos,
}) => {
  const saveChanges = () => {
    if (modalItem?.title) {
      Keyboard.dismiss();
      fetch(`https://jsonplaceholder.typicode.com/todos/${modalItem.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: modalItem.title,
          userId: modalItem.userId,
          completed: modalItem.completed,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => {
          // const json = await JSON.parseresponse;
          console.log('response----', response);
          //   navigation.navigate('Todo');

          closeModel();
          ToastAndroid.show('Successfully updated todo', ToastAndroid.SHORT);
          loadTodos();
        })
        .catch(error => {
          console.error('error', JSON.stringify(error));
        });
    } else {
      ToastAndroid.show(
        'Please enter some text to update in todo list.',
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModel}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modelHeader}>
            <Text style={styles.modelHeaderText}>Edit</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.modalTitleText}>TItle</Text>
            <TextInput
              style={styles.modalText}
              value={modalItem?.title}
              onChangeText={value => setModelItem({...modalItem, title: value})}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={saveChanges}>
              <Text style={styles.textStyle}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModel}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Model;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 6,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#123144',
    // borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  modelHeader: {
    width: '100%',
    height: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#a9c3e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20212466',
    // marginTop: 22,
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
  },
  editDeleteButtons: {
    flex: 2,
    marginHorizontal: 2,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 8,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleText: {
    flex: 3,
    font: 18,
    textAlign: 'center',
  },
  modalText: {
    flex: 7,
    font: 18,
    borderBottomWidth: 0.5,
    padding: 10,
  },
  itemTitle: {
    margin: 5,
  },
  titleText: {
    color: '#fff',
    textTransform: 'capitalize',
  },
  body: {
    marginTop: 50,
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  buttons: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
});

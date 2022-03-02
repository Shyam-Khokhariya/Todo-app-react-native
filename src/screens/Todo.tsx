import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
  ToastAndroid,
  RefreshControl,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../TypesAndInterfaces/AddTypes';
import Header from '../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {todoAction} from '../store/actions';
import {State} from '../store/reducers';
import Model from '../components/Model';
import Icon from 'react-native-vector-icons/FontAwesome';
export type todoScreenProp = StackNavigationProp<RootStackParamList, 'Todo'>;
export interface ToDoList {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const COMPLETED = 'completed';
const INCOMPLETE = 'incomplete';
const ALL = 'all';

function TodoScreen() {
  const navigation = useNavigation<todoScreenProp>();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<string>(ALL);
  const [filterTodo, setFilterTodo] = useState<ToDoList[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalItem, setModelItem] = useState<ToDoList | null>();

  const loadTodos = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        'http://jsonplaceholder.typicode.com/todos/',
      );
      const json = await response.json();
      dispatch(todoAction.setUserTodo(json));
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      console.error('error', JSON.stringify(error));
    }
  };

  React.useEffect(() => {
    loadTodos();
  }, []);

  const {userTodo} = useSelector((state: State) => state.todo);

  React.useEffect(() => {
    if (selected == ALL) {
      setFilterTodo(userTodo);
    } else if (selected == COMPLETED) {
      let data = userTodo.filter((element: ToDoList) => element.completed);
      setFilterTodo(data);
    } else if (selected == INCOMPLETE) {
      let data = userTodo.filter((element: ToDoList) => !element.completed);
      setFilterTodo(data);
    }
  }, [userTodo, selected]);

  const openModel = (item: ToDoList) => {
    setModalVisible(true);
    setModelItem(item);
  };

  const closeModel = () => {
    setModalVisible(!modalVisible);
    setModelItem(null);
  };

  const deleteItem = async (item: ToDoList) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete',
      [
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(
                `http://jsonplaceholder.typicode.com/todos/${item.id}`,
                {
                  method: 'DELETE',
                },
              );
              const json = await response.json();
              console.log('response', json);
              ToastAndroid.show(
                'Successfully deleted Todo',
                ToastAndroid.SHORT,
              );
              loadTodos();
            } catch (error) {
              ToastAndroid.show('Error deleted Todo', ToastAndroid.SHORT);
              console.error('error', JSON.stringify(error));
            }
          },
          style: 'default',
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
  };

  const toggleComplete = (item: ToDoList) => {
    Alert.alert(
      `Mark as ${item.completed ? 'incomplete' : 'complete'}`,
      `Are you sure you want to change it to ${
        item.completed ? 'incomplete' : 'complete'
      }?`,
      [
        {
          text: `${item.completed ? 'Incomplete' : 'Complete'}`,
          onPress: async () => {
            fetch(`https://jsonplaceholder.typicode.com/todos/${item.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                title: item.title,
                userId: item.userId,
                completed: !item.completed,
              }),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
              .then(response => {
                console.log('response----', response);
                setModalVisible(!modalVisible);
                setModelItem(null);
                ToastAndroid.show(
                  `${item.completed ? 'Changed to Incomplete' : 'Completed'}`,
                  ToastAndroid.SHORT,
                );
                loadTodos();
              })
              .catch(error => {
                console.error('error', JSON.stringify(error));
              });
          },
          style: 'default',
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
  };

  const rendertodoList: ListRenderItem<ToDoList> = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => toggleComplete(item)}
        style={[
          styles.itemContainer,
          {backgroundColor: item.completed ? '#feefee' : '#fff'},
        ]}>
        <View style={styles.itemTitle}>
          <Text
            style={[
              styles.titleText,
              item.completed
                ? {
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                  }
                : {},
            ]}>
            {item.title}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => openModel(item)}
          style={styles.editDeleteButtons}>
          <Icon name="edit" size={25} color={'#000'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteItem(item)}
          style={[styles.editDeleteButtons, {marginRight: 15}]}>
          <Icon name="trash" size={25} color={'#f66'} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header title={'Todo List'} backIcon={false} />
      <View style={styles.body}>
        <View style={styles.filterButton}>
          <TouchableOpacity
            onPress={() => setSelected(COMPLETED)}
            style={[
              styles.buttons,
              {backgroundColor: selected === COMPLETED ? '#fefe' : '#fff'},
              {borderWidth: selected === COMPLETED ? 1 : 0.5},
            ]}>
            <Text
              style={
                selected == COMPLETED
                  ? styles.selectedButtonText
                  : styles.buttonText
              }>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected(INCOMPLETE)}
            style={[
              styles.buttons,
              {backgroundColor: selected === INCOMPLETE ? '#fefe' : '#fff'},
              {borderWidth: selected === INCOMPLETE ? 1 : 0.5},
            ]}>
            <Text
              style={
                selected == INCOMPLETE
                  ? styles.selectedButtonText
                  : styles.buttonText
              }>
              Incomplete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected(ALL)}
            style={[
              styles.buttons,
              {backgroundColor: selected === ALL ? '#fefe' : '#fff'},
              {borderWidth: selected === ALL ? 1 : 0.5},
            ]}>
            <Text
              style={
                selected == ALL ? styles.selectedButtonText : styles.buttonText
              }>
              All
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadTodos} />
          }
          data={filterTodo}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No data Found</Text>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          renderItem={rendertodoList}
        />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Add');
          }}
          style={styles.addButton}>
          <Icon name="plus" size={20} color={'#000'} />
        </TouchableOpacity>
      </View>

      {modalItem ? (
        <Model
          modalVisible={modalVisible}
          closeModel={closeModel}
          setModelItem={modalItem => setModelItem(modalItem)}
          modalItem={modalItem}
          loadTodos={loadTodos}
        />
      ) : null}
    </View>
  );
}

export default TodoScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  modelHeader: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  modelHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
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
    flex: 1,
    marginHorizontal: 2,
    // height: 50,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  itemTitle: {
    flex: 10,
    margin: 15,
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    textTransform: 'capitalize',
  },
  body: {
    marginTop: 50,
    flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  buttons: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#123123',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#caacdb',
    // padding: 20,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from 'src/TypesAndInterfaces/AddTypes';
import AddScreen from '../screens/Add';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store from '../store';
import TodoScreen from '../screens/Todo';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Todo" component={TodoScreen} />
          <Stack.Screen name="Add" component={AddScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

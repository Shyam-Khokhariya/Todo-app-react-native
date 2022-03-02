import {USER_TODO} from '../types';

const setUserTodo = (payload: number) => ({
  type: USER_TODO,
  payload,
});

export default {
  setUserTodo,
};

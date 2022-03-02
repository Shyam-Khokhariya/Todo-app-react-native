import {USER_TODO} from '../types';

const initialstate = {
  userTodo: [],
};

type Action = {
  type: string;
  payload?: any;
};

export default (state: any = initialstate, action: Action) => {
  switch (action.type) {
    case USER_TODO:
      return Object.assign({}, state, {
        userTodo: action.payload,
      });
    default:
      return state;
  }
};

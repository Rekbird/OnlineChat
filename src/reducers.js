import { socket } from './index.js';

const reducer = (
  state = {
    Name: null,
    PopUpOpen: true
  },
  action
) => {
  switch (action.type) {
    case 'ASSIGNED_USERNAME':
      state = { ...state, Name: action.Name };
      socket && socket.emit('NEW_USER', state.Name)
      break;
    case 'OPEN_NAMEPOPUP':
      state = { ...state, PopUpOpen: action.PopUpOpen };
      break;
    default:
      break;
  }

  return state;
};

export default reducer;
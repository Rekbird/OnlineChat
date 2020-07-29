import { socket } from './index.js'

const reducer = (
  state = {
    Name: null,
    PopUpOpen: true,
    Error: null,
    User: null,
    Rooms: [],
    Room: null
  },
  action
) => {
  switch (action.type) {
    case 'USER_CREATED':
      state = { ...state, 
        User: action.user, 
        Name: action.user.Name,
        Rooms: action.rooms,
        PopUpOpen: false
      }
      break
    case 'USERNAME_REJECTED': 
      state = { ...state, Error: action.error}
      break
    case 'OPEN_NAMEPOPUP':
      state = { ...state, PopUpOpen: action.PopUpOpen }
      break
    default:
      break
  }

  return state
};

export default reducer
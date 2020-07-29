import { socket } from './index.js'

const reducer = (
  state = {
    Name: null,
    PopUpVisible: false,
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
        Rooms: action.rooms
      }
      break
    
    case 'USER_CREATED_FROM_LINK':
      state = { ...state, 
        User: action.user, 
        Name: action.user.Name,
        Rooms: action.rooms,
        Room: action.room
      }
      break

    case 'ROOM_CREATED':
      state = { ...state, 
        Room: action.room,
        Rooms: action.rooms,
        PopUpVisible: false
      }
      break

    case 'ROOM_UPDATE':
      state = { ...state, 
        Room: action.room,
        PopUpVisible: false
      }
      break
    
    case 'ALL_ROOMS_UPDATE':
      state = { ...state, Rooms: action.rooms}
      break
    
    case 'USERNAME_REJECTED': 
    case 'ROOM_REJECTED': 
      state = { ...state, Error: action.error}
      break

    case 'VISIBLE_NAMEPOPUP':
      state = { ...state, PopUpVisible: action.PopUpVisible }
      break

    default:
      break
  }

  return state
};

export default reducer
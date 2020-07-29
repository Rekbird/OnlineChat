import io from 'socket.io-client'

const socket = io('http://localhost:8080')

const configureSocket = dispatch => {
  socket.on('connect', () => {
    console.log('connected')
  })
  //Incoming messages from server
  socket.on('USER_CREATED', (user, rooms) => {
    dispatch({type: 'USER_CREATED', user: user, rooms: rooms})
  })

  socket.on('USERNAME_REJECTED', error => {
    dispatch({type: 'USERNAME_REJECTED', error: error})
  })

  socket.on('USER_CREATED_FROM_LINK', (user, room) => {
    dispatch({type: 'USER_CREATED_FROM_LINK', user: user, room: room})
  })

  socket.on('ROOM_CREATED', room => {
    dispatch({type: 'ROOM_UPDATE', room: room})
  })

  socket.on('ROOM_REJECTED', error => {
    dispatch({type: 'ROOM_REJECTED', error: error})
  })

  socket.on('NEW_USER_IN_ROOM', room => {
    dispatch({type: 'ROOM_UPDATE', room: room})
  })

  socket.on('USER_JOINED_ROOM', rooms => {
    dispatch({type: 'ALL_ROOMS_UPDATE', rooms: rooms})
  })

  socket.on('USER_ENTERED_ROOM', room => {
    dispatch({type: 'ROOM_UPDATE', room: room})
  })

  socket.on('USER_LEFT_ROOM', room => {
    dispatch({type: 'ROOM_UPDATE', room: room})
  })

  socket.on('USER_LEFT_SERVER', rooms => {
    dispatch({type: 'ALL_ROOMS_UPDATE', rooms: rooms})
  })

  return socket;
}

//Functions for generating messages to server to use it via interface

export const CreateUser = (name) => socket.emit('CREATING_USER', name)

export const CreateUserInRoom = (name, roomName) => socket.emit('USER_FOLLOWING_LINK', name, roomName)

export const CreateRoom = (roomName) => socket.emit('CREATING_ROOM', roomName)

export const EnterRoom = (user, roomName) => socket.emit('USER_ENTERING_ROOM', user, roomName)

export const LeaveRoom = (user, roomName) => socket.emit('USER_LEAVING_ROOM', user, roomName)

export const SendMessage = (user, room, message) => socket.emit('USER_SENDING_MESSAGE', user, room, message)


export default configureSocket
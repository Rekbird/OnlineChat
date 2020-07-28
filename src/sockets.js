import io from 'socket.io-client';

const socket = io('http://localhost:8000');

const configureSocket = dispatch => {
  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('connect', () => {
    console.log('connected');
  });

  return socket;
};

export const getCurrentPot = () => socket.emit('GET_CURRENT_POT');

export const sendNameToServer = name =>
  socket.emit('SEND_NAME_TO_SERVER', name);

export const sendPitchInToServer = name =>
  socket.emit('SOMEONE_PITCHED_IN', name);

export const sendGetOneToServer = name => socket.emit('SOMEONE_GOT_ONE', name);

export default configureSocket;
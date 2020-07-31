const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const _ = require('lodash');

// we will use port 8000 for our app
server.listen(8080, () => console.log('connected to port 8080!'));

//Init
let users = [];
let rooms = [];
let lobby = [];

CheckForUniqueness = (type, name, users, rooms) => {
  switch(type) {
    case 'user': 
      if (_.isEmpty(users)) return true;
      else return _.findIndex(users, (item) => item.Name == name) == -1;
    case 'room':
      if (_.isEmpty(rooms)) return true;
      else return _.findIndex(rooms, (item) => item.Name == name) == -1;
    default:
      break
  };
};

RoomsLightInfo = (rooms) => {
  roomsLight = [];
  rooms.forEach(item => roomsLight.push({ Name: item.Name, Members: item.Members.length }));
  return roomsLight;
}

CreateNewUser = (name, room, id) => {
  return {
    Name: name,
    Location: !room ? 'lobby' : room.Name,
    SocketId: id
  };
};

CreateNewRoom = (name, user) => {  
  return {
    Name: name,
    Members: [user],
    Messages: []
  };
};

ParseDate = (date) => {
  return (
    date.getDate() + '.' + 
    (date.getMonth()+1) + ' ' + 
    date.getHours() + ':' + 
    date.getMinutes()
  )
}


io.on('connection', socket => {

  // Check if username is not taken and create new user
  // Returns User object with starting location lobby
  // If name is already in use returns error
  socket.on('CREATING_USER', name => {
    if (CheckForUniqueness('user', name, users)) {
      let newUser = CreateNewUser(name, null, socket.id);
      users.push(newUser);
      lobby.push(newUser);
      socket.join('lobby')

      socket.emit('USER_CREATED', newUser, RoomsLightInfo(rooms));
    } else {
      socket.emit('USERNAME_REJECTED', 'This name is already in use');
    } 
  });

  //If user follows link to the room, he will be created and pushed to that room, all members will be notified
  socket.on('USER_FOLLOWING_LINK', (name, roomName) => {
    if (CheckForUniqueness('user', name, users)) {
      let targetRoom = _.find(rooms, item => item.Name == roomName);

      socket.to('lobby').emit('USER_JIONED_ROOM', RoomsLightInfo(rooms));
      socket.emit('USER_CREATED_FROM_LINK', CreateNewUser(name, targetRoom, socket.id), targetRoom);
    } else {
      socket.emit('USERNAME_REJECTED', 'This name is already in use');
    }
  });

  //Room creation same as User creation, if user creates room he automatically enters it
  socket.on('CREATING_ROOM', (roomName, user) => {
    if (CheckForUniqueness('room', roomName, null, rooms)) {
      let newRoom = CreateNewRoom(roomName, user);
      rooms.push(newRoom);
      _.remove(lobby, item => item.SocketId === user.SocketId);
      _.find(users, item => item.Name == user.Name).Location = newRoom.Name;
      socket.leave('lobby');
      socket.join(roomName);

      socket.emit('ROOM_CREATED', newRoom, RoomsLightInfo(rooms));
      socket.to('lobby').emit('ROOMS_CHANGED', RoomsLightInfo(rooms));
    } else {
      socket.emit('ROOM_REJECTED', 'This name is already in use');
    }
  });

  //User enters room, returns room with updated list of users, updates list for all members of that room
  socket.on('USER_ENTERING_ROOM', (user, roomName) => {
    let userRoom =_.find(rooms, item => item.Name == roomName);
    _.remove(lobby, item => item.SocketId === user.SocketId);
    userRoom.Members.push(user);
    _.find(users, item => item.Name == user.Name).Location = userRoom.Name;
    socket.leave('lobby');
    socket.join(roomName);


    if (!_.isEmpty(userRoom.Members)) socket.to(roomName).emit('SOMEONE_ENTERED_ROOM', userRoom);
    socket.to('lobby').emit('ROOMS_CHANGED', RoomsLightInfo(rooms));
    socket.emit('USER_ENTERED_ROOM', userRoom);
  });

  //Same as entering room
  socket.on('USER_LEAVING_ROOM', (user, roomName) => {
    let userRoom =_.find(rooms, item => item.Name == roomName);
    _.remove(userRoom.Members, item => item.SocketId === user.SocketId);
    lobby.push(user);
    _.find(users, item => item.Name == user.Name).Location = 'lobby';
    socket.leave(roomName);
    socket.join('lobby');

    if (!_.isEmpty(userRoom.Members)) socket.to(roomName).emit('SOMEONE_LEFT_ROOM', userRoom);
    socket.to('lobby').emit('ROOMS_CHANGED', RoomsLightInfo(rooms));
    socket.emit('USER_LEFT_ROOM', RoomsLightInfo(rooms));
  });

  //Sending message in the room
  socket.on('USER_SENDING_MESSAGE', (user, roomName, messageText) => {
    let userRoom =_.find(rooms, item => item.Name == roomName);
    userRoom.Messages.push({
      SentBy: user.Name,
      TimeStamp: ParseDate(new Date()),
      Text: messageText
    });
    io.in(roomName).emit('USER_SENT_MESSAGE', userRoom);
  });

  //When disconnected the client's name will be removed from server's list of users and from room he left
  // then broadcast that to everybody connected so their room will be updated
  socket.on('disconnect', () => {
    let userToRemove = _.find(users, item => item.SocketId === socket.id);
    if (!!userToRemove) {
      if (userToRemove.Location != 'lobby') {
        let userRoom = _.find(rooms, item => item.Name == userToRemove.Location);
        _.remove(userRoom.Members, item => item.SocketId === userToRemove.SocketId);

        !_.isEmpty(userRoom.Members) && socket.to(userRoom.Name).emit('SOMEONE_LEFT_ROOM', userRoom);
        socket.to('lobby').emit('ROOMS_CHANGED', RoomsLightInfo(rooms));

      } else {
        _.remove(lobby, item => item.SocketId === userToRemove.SocketId);
      }

      _.remove(users, item => item.SocketId === socket.id);
    }
  });
});

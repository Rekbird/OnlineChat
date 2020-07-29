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
      else return _.findIndex(Users, (item) => {item.Name == name}) == -1;
    case 'room':
      if (_.isEmpty(rooms)) return true;
      else return _.findIndex(rooms, (item) => {item.Name == name}) == -1;
    default:
      break
  };
};

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


io.on('connection', socket => {

  // Check if username is not taken and create new user
  // Returns User object with starting location lobby
  // If name is already in use returns error
  socket.on('CREATING_USER', name => {
    if (CheckForUniqueness('user', name, users)) {
      let newUser = CreateNewUser(name, null, socket.id);
      users.push(newUser);
      (newUser.Location == 'lobby') ? lobby.push(newUser) : room.Members.push(newUser);

      socket.emit('USER_CREATED', newUser, rooms);
    }
    socket.emit('USERNAME_REJECTED', 'This name is already in use');
  });

  //If user follows link to the room, he will be created and pushed to that room, all members will be notified
  socket.on('USER_FOLLOWING_LINK', (name, roomName) => {
    if (CheckForUniqueness('user', name, users)) {
      let targetRoom = _.find(rooms, item => item.Name == roomName);
      !_.isEmpty(lobby) && socket.broadcast.to(_.map(lobby, item => item.SocketId)).emit('USER_JIONED_ROOM', rooms);
      socket.emit('USER_CREATED_FROM_LINK', CreateNewUser(name, targetRoom, socket.id), targetRoom);
    }
    socket.emit('USERNAME_REJECTED', 'This name is already in use');
  });

  //Room creation same as User creation, if user creates room he automatically enters it
  socket.on('CREATING_ROOM', name => {
    if (CheckForUniqueness('room', name, null, rooms)) {
      let newRoom = CreateNewRoom(name);
      rooms.push(newRoom);
      socket.emit('ROOM_CREATED', newRoom);
      !_.isEmpty(lobby) && socket.broadcast.to(_.map(lobby, item => item.SocketId)).emit('NEW_ROOM', rooms);
    }
    socket.emit('ROOM_REJECTED', 'This name is already in use');
  });

  //User enters room, returns room with updated list of users, updates list for all members of that room
  socket.on('USER_ENTERING_ROOM', (user, roomName) => {
    let targetRoom =_.find(rooms, item => item.Name === roomName);
    _.remove(lobby, item => item.SocketId === user.SocketId);
    targetRoom.Members.push(user);
    socket.broadcast.to(_.map(targetRoom.Members, item => item.SocketId)).emit('NEW_USER_IN_ROOM', targetRoom);
    !_.isEmpty(lobby) && socket.broadcast.to(_.map(lobby, item => item.SocketId)).emit('USER_JOINED_ROOM', rooms);
    socket.emit('USER_ENTERED_ROOM', targetRoom);
  });

  //Same as entering room
  socket.on('USER_LEAVING_ROOM', (user, roomName) => {
    let userRoom =_.find(rooms, item => item.Name === roomName);
    _.remove(userRoom.Members, item => item.SocketId === user.SocketId);
    lobby.push(user);
    !_.isEmpty(userRoom.Members) && socket.broadcast.to(_.map(userRoom.Members, item => item.SocketId)).emit('USER_LEFT_ROOM', userRoom);
    !_.isEmpty(lobby) && socket.broadcast.to(_.map(lobby, item => item.SocketId)).emit('USER_LEFT_SERVER', rooms);
    socket.emit('USER_LEFT_ROOM', userRoom);
  });

  //Sending message in the room
  socket.on('USER_SENDING_MESSAGE', (user, room, message) => {
    let userRoom =_.find(rooms, item => item.Name === room.Name);
    userRoom.Messages.push({
      SentBy: user.Name,
      TimeStamp: new Date(),
      Text: message
    });
    socket.broadcast.to(_.map(userRoom.Members, item => item.SocketId)).emit('USER_SENT_MESSAGE', userRoom);
    socket.emit('USER_SENT_MESSAGE', userRoom);
  })

  //When disconnected the client's name will be removed from server's list of users and from room he left
  // then broadcast that to everybody connected so their room will be updated
  socket.on('disconnect', () => {
    let userToRemove = _.find(users, item => item.SocketId === socket.id);

    if (userToRemove.Location != 'lobby') {
      let userRoom = _.find(rooms, item => item.Name == userToRemove.Location);
      _.remove(userRoom.Members, item => item.SocketId === userToRemove.SocketId);
      !_.isEmpty(userRoom.Members) && socket.broadcast.to(_.map(userRoom.Members, item => item.SocketId)).emit('USER_LEFT_ROOM', userRoom);
      !_.isEmpty(lobby) && socket.broadcast.to(_.map(lobby, item => item.SocketId)).emit('USER_LEFT_SERVER', rooms);
    } else {
      _.remove(lobby, item => item.SocketId === userToRemove.SocketId);
    }

    _.remove(users, item => item.SocketId === socket.id);
    socket.emit('USER_LEFT_SERVER', rooms);
  });
});

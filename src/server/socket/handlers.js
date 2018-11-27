
const RoomManager = require('./RoomManager')
const Rooms = require('./models/rooms');
const roomManager = RoomManager()

function ensureValidRoom(roomName) {
  const room = roomManager.getRoomByName(roomName);
  return room;
}

function makeHandleEvent() {
  function handleEvent(roomName, createEntry) {
    const user = 'test user'
    const room = ensureValidRoom(roomName)
    const entry = { user, ...createEntry() };
    room.addEntry(entry)
    room.broadcastMessage({ chat: roomName, ...entry })
    return room;
  }
  return handleEvent;
}

module.exports = (client, clientManager, roomManager) => {
  const handleEvent = makeHandleEvent(client, clientManager, roomManager);

  
  function handleJoin(roomName) {
    const createEntry = () => ({ event: `joined ${roomName}` });
    const room = handleEvent(roomName, createEntry)
    room.addUser(client);
  }

  function handleLeave(roomName, callback) {
    const createEntry = () => ({ event: `left ${roomName}` });
    const room = handleEvent(roomName, createEntry)
    room.removeUser(client.id);
    callback(null);
  }

  function handleMessage({ roomName, message } = {}, callback) {
    const createEntry = () => ({ message });
    handleEvent(roomName, createEntry)
  }

  function handleGetRooms(_, callback) {
    return callback(null, roomManager.serializeRooms());
  }

  function handleDisconnect() {
    clientManager.removeClient(client);
    roomManager.removeClient(client);
  }

  function handleReady(roomName) {
    const room = ensureValidRoom(roomName);
    room.broadcastSong();
  }

  function handleQueueUpdate({ roomName, queue } = {}) {
    const room = ensureValidRoom(roomName);
    const ParsedQueueArray = JSON.parse(queue);
    room.queue(ParsedQueueArray);
  }

  function handleCreateRoom(roomName, user){
    console.log('will add this to rooms:',roomName);
    const roomData = {
      name: roomName,
      user: user
    }
    console.log(roomData);
    roomManager.roomAdd(roomData);
  }

  return {
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetRooms,
    handleDisconnect,
    handleReady,
    handleQueueUpdate,
    handleCreateRoom
  };
};

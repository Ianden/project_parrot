const io = require('socket.io-client')

export default function () {

  const socket = io.connect('http://localhost:3000')

  function messageHandler(onMessageReceived) {
    socket.on('message', onMessageReceived)
  }

  function playHandler(play_Song) {
    socket.on('PLAY_SONG', play_Song)
  }

  function unregisterHandler() {
    socket.off('message')
  }

  socket.on('error', function (err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    socket.emit('register', name, cb)
  }

  function join(roomName, cb) {
    socket.emit('join', roomName, cb)
    console.log("emit join to", roomName)
  }

  function leave(roomName, cb) {
    console.log("emit leave from", roomName)
    socket.emit('leave', roomName, cb)
  }

  function message(roomName, msg, cb) {
    console.log("emit message:", msg, "in room", roomName)
    socket.emit('message', { roomName, message: msg }, cb)
  }

  function getRooms(cb) {
    console.log("emitting getrooms to server")
    socket.emit('rooms', null, cb)
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  function queueUpdate(queueArr) {
    console.log("emitting queue", queueArr);
    socket.emit('QUEUE_UPDATE', JSON.stringify(queueArr));
  }

  return {
    messageHandler,
    getRooms,
    register,
    join,
    leave,
    message,
    getAvailableUsers,
    playHandler,
    unregisterHandler,
    queueUpdate
  }
}
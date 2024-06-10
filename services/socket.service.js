const { Server } = require("socket.io");

const rooms = {};

function generateUniqueRoomName(length = 6) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function findOrCreateRoom() {
  for (const [roomName, occupants] of Object.entries(rooms)) {
    if (occupants.length < 2) {
      return roomName;
    }
  }

  const newRoomName = generateUniqueRoomName();
  rooms[newRoomName] = [];
  return newRoomName;
}

function initializeSocket(server) {
  const io = new Server(server);
  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);
    const room = findOrCreateRoom();
    rooms[room].push(socket.id);
    socket.join(room);
    socket.room = room;
    console.log(`User ${socket.id} joined room ${room}`);

    socket.on("send_message", ({ message }) => {
      socket.to(room).emit("message_received", { message });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      if (rooms[room].length === 0) {
        delete rooms[room];
      }
    });
  });
  return io;
}

module.exports = initializeSocket;

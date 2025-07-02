//(backend) që pranon lidhje dhe shpërndan përdoruesit online,
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173", // front-end URL
  },
});

let onlineUsers = [];

const addUser = ({ userId, username, socketId }) => {
  if (!onlineUsers.find(u => u.userId === userId)) {
    onlineUsers.push({ userId, username, socketId });
  }
  io.emit("onlineUsers", onlineUsers);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter(u => u.socketId !== socketId);
  io.emit("onlineUsers", onlineUsers);
};

io.on("connection", (socket) => {
  console.log("🔌 New connection:", socket.id);

  socket.on("newUser", ({ userId, username }) => {
    addUser({ userId, username, socketId: socket.id });
    console.log("User added:", userId, username);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

io.listen(4000);
console.log("🚀 Socket server running on port 4000");

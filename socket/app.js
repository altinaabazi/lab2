// // // import { Server } from "socket.io";

// // // const io = new Server({
// // //   cors: {
// // //     origin: "http://localhost:5173", // ndrysho nëse frontend-i yt është diku tjetër
// // //   },
// // // });

// // // let onlineUser = [];

// // // const addUser = (userId, socketId) => {
// // //   const userExists = onlineUser.find((user) => user.userId === userId);
// // //   if (!userExists) {
// // //     onlineUser.push({ userId, socketId });
// // //     console.log(`✅ User added: ${userId}`);
// // //   }
// // // };

// // // const removeUser = (socketId) => {
// // //   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// // //   console.log(`❌ User disconnected: ${socketId}`);
// // // };

// // // const getUser = (userId) => {
// // //   return onlineUser.find((user) => user.userId === userId);
// // // };

// // // io.on("connection", (socket) => {
// // //   console.log(`🔌 New client connected: ${socket.id}`);

// // //   socket.on("newUser", (userId) => {
// // //     addUser(userId, socket.id);
// // //   });

// // //   socket.on("sendMessage", ({ receiverId, data }) => {
// // //     const receiver = getUser(receiverId);
// // //     if (receiver) {
// // //       io.to(receiver.socketId).emit("getMessage", data);
// // //       console.log(`📨 Message sent from ${socket.id} to ${receiver.socketId}`);
// // //     } else {
// // //       console.log(`⚠️ Receiver with ID ${receiverId} not found`);
// // //     }
// // //   });

// // //   socket.on("disconnect", () => {
// // //     removeUser(socket.id);
// // //   });
// // // });

// // // io.listen(4000);
// // // console.log("🚀 Socket server is running on port 4000");
// import { Server } from "socket.io";

// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173", // Ndrysho këtë sipas URL-së së front-end-it tënd
//   },
// });

// let onlineUsers = [];

// // Shto përdorues në listë vetëm nëse nuk ekziston
// const addUser = ({ userId, username, socketId }) => {
//   const userExists = onlineUsers.find((user) => user.userId === userId);
//   if (!userExists) {
//     onlineUsers.push({ userId, username, socketId });
//     console.log(`✅ User added: ${userId} (${username})`);
//     sendOnlineUsers();
//   }
// };

// // Hiq përdorues nga lista kur del
// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
//   console.log(`❌ User disconnected: ${socketId}`);
//   sendOnlineUsers();
// };

// // Dërgo listën e përdoruesve te të gjithë klientët
// const sendOnlineUsers = () => {
//   console.log("👥 Sending online users:", onlineUsers);
//   io.emit("onlineUsers", onlineUsers);
// };

// io.on("connection", (socket) => {
//   console.log(`🔌 New client connected: ${socket.id}`);

//   // Kur përdoruesi lidhet për herë të parë
//   socket.on("newUser", ({ userId, username }) => {
//     addUser({ userId, username, socketId: socket.id });
//   });

//   // Kur dërgohet një mesazh
//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = onlineUsers.find((user) => user.userId === receiverId);
//     if (receiver) {
//       io.to(receiver.socketId).emit("getMessage", data);
//       console.log(`📨 Message from ${socket.id} to ${receiver.socketId}`);
//     } else {
//       console.log(`⚠️ Receiver not found: ${receiverId}`);
//     }
//   });

//   // Kur kërkohet lista e përdoruesve online
//   socket.on("getOnlineUsers", () => {
//     socket.emit("onlineUsers", onlineUsers);
//   });

//   // Kur përdoruesi shkëputet
//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// // Startimi i serverit
// io.listen(4000);
// console.log("🚀 Socket server running on port 4000");
// server.js
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

const socketIO = require("socket.io");

const initSocket = (server) => {
  const io = socketIO(server); // Move this line after defining the server variable

  // io.on("connection", (socket) => {
  //   console.log("A user connected");
  //   const userId = socket.handshake.query.userId;

  //   socket.on("message", (data) => {
  //     // io.emit("message", data); // Broadcast the message to all connected clients

  //     io.to(data.receiverId).emit("message", {
  //       senderId: userId,
  //       message: data.message,
  //     }); // Emit the message to the intended receiver
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("A user disconnected");
  //   });
  // });
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (userId) => {
      socket.join(userId); // Join a room based on the user's ID
      console.log(`User ${userId} joined the room`);
    });

    socket.on("message", (data) => {
      console.log(data);
      const { userId, receiverId, message } = data;
      io.to(receiverId).emit("privateMessage", { senderId: userId, message });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = {
  initSocket,
};

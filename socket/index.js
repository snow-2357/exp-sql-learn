const socketIO = require("socket.io");
const connection = require("../mysql");

const initSocket = (server) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (userId) => {
      socket.join(userId); // Join a room based on the user's ID
      console.log(`User ${userId} joined the room`);
    });

    socket.on("message", async (data) => {
      const { userId, receiverId, message, attachment } = data;

      // sqlquery change the name blob_id
      const insertMessageQuery = `
        INSERT INTO messages (sender_id, receiver_id, message_text, timestamp,blob_id)
        VALUES (?, ?, ?, NOW(),?)
      `;
      connection.query(
        insertMessageQuery,
        [userId, receiverId, message, attachment.split(".")[0]],
        (error, result) => {
          if (error) {
            console.error("Error inserting message into database:", error);
          } else {
            console.log("Message inserted into database");
          }
        }
      );

      io.to(receiverId).emit("privateMessage", {
        senderId: userId,
        message,
        attachment,
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = {
  initSocket,
};

const http = require("http");
const express = require("express");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const messagesRouter = require("./routes/message");
require("dotenv").config();
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(express.json());

app.use("/api/user", userRouter);

app.use("/api/messages", messagesRouter);

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3000;

// test soket
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/receive", (req, res) => {
  res.sendFile(__dirname + "/receive.html"); // Serve the receive page
});

server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

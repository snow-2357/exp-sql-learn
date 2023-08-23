const http = require("http");
const express = require("express");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const messagesRouter = require("./routes/message");
const upload = require("./routes/uplaodFile");
const fileUpload = require("express-fileupload");
const cors = require("cors");

require("dotenv").config();
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/api/user", userRouter);

app.use("/api/messages", messagesRouter);

app.use("/api/auth", authRouter);

app.use("/api/upload", upload);

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

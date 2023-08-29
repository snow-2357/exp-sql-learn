const http = require("http");
const express = require("express");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const messagesRouter = require("./routes/message");
const upload = require("./routes/uplaodFile");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);
initSocket(server);

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
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

app.use("/images", express.static(path.join(__dirname, "Images")));

server.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});

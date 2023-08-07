const express = require("express");
const userRouter = require("./routes/user");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

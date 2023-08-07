const express = require("express");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

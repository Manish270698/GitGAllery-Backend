const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");

connectDB()
  .then(() => {
    console.log("Databse connected successfully!");
    app.listen(7777, () => {
      console.log("Server listenin on port 7777");
    });
  })
  .catch((err) => {
    console.error("Error while connecting to database with message: ", err);
  });

app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);

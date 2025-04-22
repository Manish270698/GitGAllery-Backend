const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const { config } = require("dotenv");
config();

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(port, () => {
      console.log("Server listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Error while connecting to database with message: ", err);
  });

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
//   })
// );
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gitgallery-frontend.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);

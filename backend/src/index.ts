import express from "express";
import dotenv from "dotenv";
import {
  authRouter,
  requestRouter,
  meetingRouter,
  userRouter
} from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json()); 

// Routes
app.use(authRouter);
app.use(userRouter);
app.use("/request", requestRouter);
app.use("/meeting", meetingRouter);
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


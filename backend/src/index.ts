import express from "express";
import dotenv from "dotenv";
import {
  authRouter,
  requestRouter,
  meetingRouter,
  userRouter,
  pollRouter,
} from "./routes";
import { connectToDatabase } from "./utils/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3007;

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.use(express.json()); 

// Routes
app.use(authRouter);
app.use(userRouter);
app.use("/poll",pollRouter);
app.use("/request", requestRouter);
app.use("/meeting", meetingRouter);
  
app.listen(port, async () => {
  if (process.env.DEV_MODE) {
    await connectToDatabase();
  }
  console.log(`Server is running on port ${port}`);
});

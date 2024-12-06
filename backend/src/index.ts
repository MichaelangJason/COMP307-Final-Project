import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import requestRoutes from "./routes/requestRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json()); 

// Routes
// app.use("userRoutes");
app.use("/request", requestRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


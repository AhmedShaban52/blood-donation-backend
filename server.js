import express from "express";
import connectDB from "./configs/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";

const app = express();

app.use(express.json());

await connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API Working"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

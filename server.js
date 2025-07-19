import express from "express";
import connectDB from "./configs/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import "dotenv/config";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

app.use(express.json());

// Connect to database
await connectDB();
await connectCloudinary();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("API Working"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

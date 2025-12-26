import "dotenv/config";   // 👈 THIS loads env FIRST (no dotenv.config needed)

import express from "express";
import connectDB from "./config/db.js";
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import note from "./routes/note.js";

const app = express();
const PORT = process.env.PORT || 5000;

// DB
connectDB();

// middleware
app.use(express.json());

// routes
app.use("/api/notes", note);
app.use("/api/auth", auth);
app.use("/api/users", user);

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

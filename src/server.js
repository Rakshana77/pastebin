import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db.js";
import health from "./routes/health.js";
import pastes from "./routes/pastes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));

//  API routes
app.use("/api", health);
app.use("/api", pastes);

//  HTML view for pastes
app.use("/", pastes);

//  HOME PAGE 
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

await connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port", port);
});

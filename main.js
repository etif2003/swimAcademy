import express from "express";
import cors from "cors";
import { connectDB } from "./db/db.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

import courseRoutes from "routes/courseRoutes.js";

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const app = express();

app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/courses", courseRoutes);

// -------------------- START SERVER -------------------- //
const startServer = async () => {
  if (!mongoURI) {
    console.error("MONGO_URI is not defined!");
    process.exit(1);
  }
  await connectDB(mongoURI);
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
};

startServer();

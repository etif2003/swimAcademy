import express from "express";
import cors from "cors";
import { connectDB } from "./db/db.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

import courseRoutes from "./routes/course.js";
import userRoutes from "./routes/user.js";
import instructorRoutes from "./routes/instructor.js";
import schoolRoutes from "./routes/school.js";
import registrationRoutes from "./routes/registration.js";
import schoolInstructorRoutes from "./routes/school-instructor.js";
import uploadRoutes from "./routes/upload.js";




const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const app = express();

app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/school-instructors", schoolInstructorRoutes);

app.use("/api/upload", uploadRoutes);


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

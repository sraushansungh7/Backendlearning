import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import healthcheckRoutes from "./routes/heathcheck.routes.js";
import cookieParser from 'cookie-parser';
const app = express();

// ✅ Body parsers (ONLY ONCE)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "13kb" }));

// ✅ Static files
app.use(express.static("public"));


app.use(cookieParser());
// ✅ CORS (CORRECT WAY)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/v1/healthcheck", healthcheckRoutes);
app.use("/api/v1/auth", authRouter);


export default app;

import dotenv from "dotenv";
dotenv.config({path:"./.env"});
import connectDB from "./db/connectDB.js";
import app from "./app.js";

let port=process.env.PORT;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });
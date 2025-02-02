import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/ds.js";
import { fetchAllJobs } from "./services/scrapeJob.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

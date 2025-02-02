import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  source: { type: String, required: true },
});

export const Job = mongoose.model("Job", JobSchema);

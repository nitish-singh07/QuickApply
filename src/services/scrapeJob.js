import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import cheerio from "cheerio"; // For parsing HTML
import connectDB from "../config/ds.js";
import { Job } from "../models/jobslist.models.js";

connectDB();

// Function to fetch job data from Y Combinator (scrape)
const fetchYCombinatorJobs = async () => {
  try {
    const response = await axios.get("https://news.ycombinator.com/jobs");
    const $ = cheerio.load(response.data);
    const jobs = [];

    // Iterate over the job listings on the page
    $(".athing").each((index, element) => {
      const title = $(element).find(".title a").text();
      const link = $(element).find(".title a").attr("href");

      if (title && link) {
        jobs.push({
          title,
          link: `https://news.ycombinator.com/${link}`,
          source: "Y Combinator",
        });
      }
    });

    return jobs;
  } catch (err) {
    console.error("Error fetching Y Combinator jobs:", err);
    return [];
  }
};

// Function to fetch job data from Wellfound (AngelList)
const fetchWellfoundJobs = async () => {
  try {
    const response = await axios.get("https://api.angel.co/1/jobs");
    const jobs = response.data.jobs.map((job) => ({
      title: job.title,
      link: job.company_url,
      source: "Wellfound",
    }));
    return jobs;
  } catch (err) {
    console.error("Error fetching Wellfound jobs:", err);
    return [];
  }
};

// Save job data to MongoDB
const saveJob = async (jobData) => {
  try {
    await Job.create(jobData);
    console.log(`Saved job: ${jobData.title}`);
  } catch (err) {
    console.error("Error saving job:", err);
  }
};

// Fetch and save all jobs
export const fetchAllJobs = async () => {
  const yCombinatorJobs = await fetchYCombinatorJobs();
  const wellfoundJobs = await fetchWellfoundJobs();

  const allJobs = [...yCombinatorJobs, ...wellfoundJobs];

  // Save each job to MongoDB
  for (const job of allJobs) {
    await saveJob(job);
  }
};

fetchAllJobs();

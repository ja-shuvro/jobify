const Job = require("../models/jobModel");

// Create Job
const createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get Jobs with Filtering, Sorting, and Pagination
const getJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;
        const skip = (page - 1) * limit;

        const jobs = await Job.find(filters)
            .sort({ createdAt: -1 }) // Sort by newest
            .skip(skip)
            .limit(parseInt(limit));

        res.json(jobs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update Job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) throw new Error("Job not found");
        res.json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete Job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) throw new Error("Job not found");
        res.json({ message: "Job deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { createJob, getJobs, updateJob, deleteJob };

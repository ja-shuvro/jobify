const Job = require("../models/job");
const { paginate } = require("..//utils/pagination");

// Create Job
const createJob = async (req, res) => {
    try {
        const { name, logo, description, website } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const job = new Job({ name, logo, description, website, createdBy: req.user.id });
        await job.save();

        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get Jobs with Filtering, Sorting, and Pagination
const getJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort } = req.query;
        const filter = {};
        const options = {
            sort: sort ? { createdAt: sort } : { createdAt: -1 },
        };

        const paginatedData = await paginate(Job, filter, parseInt(page), parseInt(limit), options);

        res.status(200).json(paginatedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get a single job by ID with populated relationships
 */
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id)
            .populate("category", "name description")
            .populate("company", "name location")
            .populate("postedBy", "name email");

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
};
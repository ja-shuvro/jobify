const JobType = require("../models/type");
const { paginate } = require("../utils/pagination");

// Create JobType
const createJobType = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const jobType = new JobType({ name, description, createdBy: req.user.id });
        await jobType.save();

        res.status(201).json(jobType);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get JobTypes
const getJobTypes = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort } = req.query;

        const filter = {};
        const options = {
            sort: sort ? { name: sort } : { createdAt: -1 },
        };

        const paginatedData = await paginate(JobType, filter, parseInt(page), parseInt(limit), options);

        res.status(200).json(paginatedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single JobType by ID with populated relationships
const getJobTypeById = async (req, res) => {
    try {
        const { id } = req.params;

        const jobType = await JobType.findById(id)
            .populate("createdBy", "name email")
            .populate({
                path: "jobs",
                select: "title category createdBy",
                populate: [
                    { path: "category", select: "name" },
                    { path: "createdBy", select: "name email" },
                ],
            });

        if (!jobType) {
            return res.status(404).json({ error: "Job Type not found" });
        };

        res.status(200).json(jobType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update JobType
const updateJobType = async (req, res) => {
    try {
        const jobType = await JobType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!jobType) throw new Error("JobType not found");
        res.json(jobType);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete JobType
const deleteJobType = async (req, res) => {
    try {
        const jobType = await JobType.findByIdAndDelete(req.params.id);
        if (!jobType) throw new Error("JobType not found");
        res.json({ message: "JobType deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createJobType,
    getJobTypes,
    getJobTypeById,
    updateJobType,
    deleteJobType,
};

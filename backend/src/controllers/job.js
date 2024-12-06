const Job = require("../models/job");
const Category = require("../models/category");
const Company = require("../models/company");
const Type = require("../models/type");
const { paginate } = require("..//utils/pagination");
const generateDescription = require("../services/aiService");

// Create Job
const createJob = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { title, company, category, createdBy, location, salary, jobType, description } = req.body;

        if (!title || !company || !category || !location || !salary || !jobType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate that salary is a positive number
        if (isNaN(salary) || salary <= 0) {
            return res.status(400).json({ message: "Salary must be a positive number" });
        }

        // Generate job description using AI
        const aiGeneratedDescription = await generateDescription({
            title,
            company,
            category,
            location,
            salary,
            jobType,
            description,
        }, "job");

        const job = new Job({
            title,
            company,
            category,
            createdBy,
            location,
            salary,
            jobType,
            description: aiGeneratedDescription,
        });

        // Save the job document
        await job.save({ session });

        // Update the job count for category, company, and jobType
        const jobCategory = await Category.findById(category).session(session);
        jobCategory.jobCount++;
        await jobCategory.save({ session });

        const jobCompany = await Company.findById(company).session(session);
        jobCompany.jobCount++;
        await jobCompany.save({ session });

        const jobTypes = await Type.findById(jobType).session(session);
        jobTypes.jobCount++;
        await jobTypes.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(job);
    } catch (err) {
        // Abort the transaction in case of error
        await session.abortTransaction();
        session.endSession();
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

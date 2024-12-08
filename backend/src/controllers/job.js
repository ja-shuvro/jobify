const Job = require("../models/job");
const { paginate } = require("..//utils/pagination");

// Create Job
const createJob = async (req, res) => {
    try {
        const { title, company, category, location, salary, jobType, description } = req.body;

        if (!title || !company || !category || !location || !salary || !jobType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate that salary is a positive number
        if (isNaN(salary) || salary <= 0) {
            return res.status(400).json({ message: "Salary must be a positive number" });
        }

        // Create the job document
        const job = new Job({
            title,
            company,
            category,
            location,
            salary,
            jobType,
            description,
            createdBy: req.user.id
        });

        // Save the job document in a transaction
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

        // Define filter criteria (empty for now)
        const filter = {};

        // Define options for sorting
        const options = {
            sort: sort ? { createdAt: sort === "asc" ? 1 : -1 } : { createdAt: -1 },
        };

        // Define projection fields (optional)
        const projection = {
            title: 1,
            category: 1,
            company: 1,
            createdBy: 1,
            description: 1,
            location: 1,
            salary: 1,
            jobType: 1,
            createdAt: 1,
        };

        // Apply populate and pagination logic
        const jobsQuery = Job.find(filter, projection)
            .populate('category')  // Populate the category field
            .populate('company')   // Populate the company field
            .populate('jobType')   // Populate the jobType field
            .sort(options.sort);

        // Count total jobs for pagination info
        const totalCount = await Job.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / parseInt(limit));

        // Determine if there are next or previous pages
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // Paginate the query
        const results = await jobsQuery
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        // Send response with paginated data
        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            totalCount,
            totalPages,
            hasNextPage,
            hasPrevPage,
            results, // The actual job results
        });
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

const JobCategory = require("../models/category");
const { paginate } = require("../utils/pagination");

// Create Job Category
const createJobCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const category = new JobCategory({ name, description, createdBy: req.user.id });
        await category.save();

        res.status(201).json({ message: "Job category created successfully", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Job Categories
const getAllJobCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort } = req.query;

        const filter = {};
        const options = {
            sort: sort ? { name: sort } : { createdAt: -1 },
        };

        const paginatedData = await paginate(JobCategory, filter, parseInt(page), parseInt(limit), options);

        res.status(200).json(paginatedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get a single category by ID with populated relationships
 */
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await JobCategory.findById(id)
            .populate("createdBy", "name email")
            .populate({
                path: "jobs",
                select: "title company createdBy",
                populate: [
                    { path: "company", select: "name" },
                    { path: "createdBy", select: "name email" },
                ],
            });

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Job Category
const updateJobCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await JobCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.name = name || category.name;
        category.description = description || category.description;

        await category.save();

        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Job Category
const deleteJobCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await JobCategory.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJobCategory,
    getAllJobCategories,
    getCategoryById,
    updateJobCategory,
    deleteJobCategory,
};

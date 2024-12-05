const User = require("../models/user");
const { paginate } = require("../utils/pagination");

/**
 * Get all users
 */
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort } = req.query;

        const filter = {};
        const options = {
            sort: sort ? { username: sort } : { createdAt: -1 },
        };

        const paginatedData = await paginate(User, filter, parseInt(page), parseInt(limit), options);

        res.status(200).json(paginatedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get a single user by ID with populated relationships
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .populate("jobs", "title category company") // Populates jobs created by the user
            .populate({
                path: "categories",
                select: "name description", // Populates categories created by the user
            })
            .populate({
                path: "companies",
                select: "name location", // Populates companies owned by the user
            });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update user details
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // User ID
        const updates = req.body; // Updated fields

        const user = await User.findByIdAndUpdate(id, updates, {
            new: true, // Return the updated document
            runValidators: true, // Enforce schema validation
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Soft delete user (mark as inactive)
 */
const terminateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User terminated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    terminateUser
};
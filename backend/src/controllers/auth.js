const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { paginate } = require("../utils/pagination");

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists in this email." });
        }

        // Create new user
        const user = await User.create({ name, email, password, role });

        // Generate token
        const token = generateToken(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRY
        );

        res.status(201).json({ user, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Log in an existing user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) throw new Error("Invalid credentials");

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        // Generate token
        const token = generateToken(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            process.env.JWT_EXPIRY
        );


        res.status(200).json({ user, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


module.exports = { register, login };

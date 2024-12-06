const Company = require("../models/company");
const { paginate } = require("../utils/pagination");
const generateDescription = require("../services/aiService");

// Create Company
const createCompany = async (req, res) => {
    try {
        const { name, logo, description, website } = req.body;

        // If no description is provided, generate one using AI
        const companyDescription = description || await generateDescription(name);

        const company = new Company({
            name,
            logo,
            description: companyDescription,
            website,
            createdBy: req.user.id
        });

        await company.save();

        res.status(201).json(company);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get Companies
const getCompanies = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort } = req.query;

        const filter = {};
        const options = {
            sort: sort ? { name: sort } : { createdAt: -1 },
        };

        const paginatedData = await paginate(Company, filter, parseInt(page), parseInt(limit), options);

        res.status(200).json(paginatedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single company by ID with populated relationships
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;

        const company = await Company.findById(id)
            .populate("createdBy", "name email")
            .populate({
                path: "jobs",
                select: "title category createdBy",
                populate: [
                    { path: "category", select: "name" },
                    { path: "createdBy", select: "name email" },
                ],
            });

        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Company
const updateCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!company) throw new Error("Company not found");
        res.json(company);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete Company
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) throw new Error("Company not found");
        res.json({ message: "Company deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};

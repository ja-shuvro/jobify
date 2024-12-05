const Company = require("../models/companyModel");

// Create Company
const createCompany = async (req, res) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get Companies
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(400).json({ error: err.message });
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

module.exports = { createCompany, getCompanies, updateCompany, deleteCompany };

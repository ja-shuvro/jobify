const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    description: {
        type: String, required: true
    },
    website: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }]
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);

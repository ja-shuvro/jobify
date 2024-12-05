const mongoose = require("mongoose");

const jobTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }]
}, { timestamps: true });

module.exports = mongoose.model("JobType", jobTypeSchema);

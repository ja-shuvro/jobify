const mongoose = require("mongoose");

const jobCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    jobCount: {
        type: Number,
        required: true,
        default: 0
    },
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }]
}, { timestamps: true });

module.exports = mongoose.model("JobCategory", jobCategorySchema);

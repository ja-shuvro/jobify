const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
    {
        original: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        tab: {
            type: String,
            required: true
        },
        desktop: {
            type: String,
            required: true
        },
        type: {
            type: String, enum: ["image", "file"],
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);

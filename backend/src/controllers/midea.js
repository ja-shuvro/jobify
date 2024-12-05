const Media = require("../models/midea");

const { upload, handleFileUpload } = require("../utils/fileUpload");

// Upload Media Controller
const uploadMedia = async (req, res) => {
    try {
        const processedFiles = req.processedFiles;

        if (!processedFiles || processedFiles.length === 0) {
            return res.status(400).json({ error: "No files were processed." });
        }

        // Save each processed file's metadata to the database
        const mediaEntries = await Promise.all(
            processedFiles.map(async (file) => {
                const media = new Media({
                    original: file.original,
                    thumbnail: file.variants.thumbnail,
                    mobile: file.variants.mobile,
                    tab: file.variants.tab,
                    desktop: file.variants.desktop,
                    type: file.original.endsWith(".webp") ? "image" : "file",
                });
                return await media.save();
            })
        );

        res.status(201).json({
            message: "Files uploaded and saved successfully.",
            media: mediaEntries,
        });
    } catch (error) {
        console.error("Error in uploadMedia:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get All Media
const getAllMedia = async (req, res) => {
    try {
        const media = await Media.find().sort({ createdAt: -1 });
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Media by ID
const getMediaById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the media entry by its ID
        const media = await Media.findById(id);

        if (!media) {
            return res.status(404).json({ error: "Media not found." });
        }

        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Media
const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findByIdAndDelete(id);

        if (!media) {
            return res.status(404).json({ error: "Media not found." });
        }

        // Delete files from the filesystem
        const pathsToDelete = [media.original, media.thumbnail, media.mobile, media.tab, media.desktop];
        pathsToDelete.forEach((filePath) => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        res.status(200).json({ message: "Media deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { uploadMedia, getAllMedia, getMediaById, deleteMedia };

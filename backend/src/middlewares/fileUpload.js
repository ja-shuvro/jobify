const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;
const fsExtra = require("fs-extra");

// Configuration Object
const CONFIG = {
    ORIGINAL_DIR: process.env.ORIGINAL_DIR || "uploads/originals",
    VARIANTS_DIR: process.env.VARIANTS_DIR || "uploads/variants",
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_MIME_TYPES: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
    ],
};

// Utility: Create directories if not exist
const ensureDirectory = async (dir) => {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (err) {
        console.error(`Error creating directory ${dir}:`, err);
        throw err;
    }
};

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await ensureDirectory(CONFIG.ORIGINAL_DIR);
            cb(null, CONFIG.ORIGINAL_DIR);
        } catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${path.parse(file.originalname).name}.webp`;
        cb(null, uniqueName);
    },
});

// Multer Upload Middleware
const upload = multer({
    storage,
    limits: { fileSize: CONFIG.MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        if (CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images, PDFs, and document files are allowed."));
        }
    },
});

// Generate Variants
const generateVariants = async (filePath, filename) => {
    try {
        await ensureDirectory(CONFIG.VARIANTS_DIR);

        const sizes = {
            thumbnail: { width: 100, height: 100 },
            mobile: { width: 480 },
            tablet: { width: 768 },
            desktop: { width: 1920 },
        };

        const variants = {};

        for (const [key, size] of Object.entries(sizes)) {
            const outputPath = path.join(`${key}-${filename}`);
            await sharp(filePath)
                .resize(size.width, size.height || null, { fit: "cover" })
                .webp({ quality: key === "desktop" ? 90 : 80 })
                .toFile(outputPath);
            variants[key] = outputPath;
        }

        sharp.cache(false);
        return variants;
    } catch (error) {
        console.error("Error generating variants:", error);
        throw error;
    }
};

// File Deletion with Retry Logic
const deleteFileWithRetry = async (filePath, retries = 5, delay = 1000) => {
    try {
        await fsExtra.remove(filePath);
        console.log(`File deleted successfully: ${filePath}`);
    } catch (err) {
        if (err.code === "EPERM" || err.code === "EBUSY") {
            console.error("Error: File is in use or locked. Attempting to change permissions.");
            try {
                await fs.chmod(filePath, 0o666); // Adjust permissions
            } catch (chmodErr) {
                console.error("Error changing file permissions:", chmodErr);
            }
        }
        if (retries > 0) {
            console.log(`Retrying to delete file: ${filePath}`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return deleteFileWithRetry(filePath, retries - 1, delay * 2);
        } else {
            console.error("Failed to delete file after retries:", err);
        }
    }
};

// File Upload and Processing Middleware
const handleFileUpload = async (req, res, next) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, error: "No file uploaded." });
        }

        const filename = `${Date.now()}-${path.parse(file.originalname).name}.webp`;
        const webpFilePath = path.join(filename);

        try {
            await sharp(file.path).webp({ quality: 80 }).toFile(webpFilePath);
        } catch (err) {
            console.error("Error converting file to WebP:", err);
            return res.status(500).json({ success: false, error: "Error processing file." });
        }

        const variants = await generateVariants(webpFilePath, filename);

        // Delete original file if it's not a WebP
        if (!file.originalname.endsWith(".webp")) {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for safety
                await deleteFileWithRetry(file.path);
            } catch (err) {
                console.error("Error deleting original file:", err);
            }
        }

        // Determine type based on MIME type
        const isImage = file.mimetype.startsWith("image/");
        const type = isImage ? "image" : "file";

        // Populate processed files object
        req.processedFiles = {
            original: webpFilePath,
            thumbnail: variants.thumbnail,
            mobile: variants.mobile,
            tablet: variants.tablet,
            desktop: variants.desktop,
            type,
        };

        console.log("Processed Files:", req.processedFiles);

        next();
    } catch (error) {
        console.error("Error in handleFileUpload:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};



// Graceful Shutdown
const gracefulShutdown = () => {
    console.log("Gracefully shutting down...");
    sharp.cache(false); // Clear sharp cache
    process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

module.exports = { upload, handleFileUpload };

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const multerStorageCloudinary = require("multer-storage-cloudinary").CloudinaryStorage;
const path = require("path");
const fs = require("fs").promises;
const fsExtra = require("fs-extra");

// Configuration Object
const CONFIG = {
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

// Cloudinary Configuration (Add your credentials)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility: Create directories if not exist (not needed for Cloudinary but kept for local fallbacks)
const ensureDirectory = async (dir) => {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (err) {
        console.error(`Error creating directory ${dir}:`, err);
        throw err;
    }
};

// Multer Storage Configuration using Cloudinary
const storage = new multerStorageCloudinary({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",  // Optional: specify a folder in your Cloudinary account
        allowed_formats: ["jpeg", "png", "webp", "pdf", "doc", "docx", "xlsx", "txt"], // Allowed formats
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

// Generate Variants using Cloudinary transformations
const generateVariants = async (file) => {
    const sizes = {
        thumbnail: { width: 100, height: 100 },
        mobile: { width: 480 },
        tablet: { width: 768 },
        desktop: { width: 1920 },
    };

    const variants = {};

    // For each size, generate the variant with the transformation applied
    for (const [key, size] of Object.entries(sizes)) {
        const transformation = {
            width: size.width,
            height: size.height || null,
            crop: "fit",
            quality: key === "desktop" ? 90 : 80,
        };
        variants[key] = cloudinary.url(file.filename, { transformation });
    }

    return variants;
};


// File Upload and Processing Middleware
const handleFileUpload = async (req, res, next) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, error: "No file uploaded." });
        }

        // Cloudinary provides the file URL and public_id
        const fileUrl = file.path;

        // Generate variants (if needed) using Cloudinary URLs
        const variants = await generateVariants(file);

        // Prepare the response data
        req.processedFiles = {
            original: fileUrl,
            ...variants,
            type: file.mimetype.startsWith("image/") ? "image" : "file",
        };

        next();
    } catch (error) {
        console.error("Error in handleFileUpload:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Graceful Shutdown
const gracefulShutdown = () => {
    sharp.cache(false);
    process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

module.exports = { upload, handleFileUpload };

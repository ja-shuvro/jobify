const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const originalDir = "uploads/originals";
        if (!fs.existsSync(originalDir)) fs.mkdirSync(originalDir, { recursive: true });
        cb(null, originalDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${path.parse(file.originalname).name}.webp`;
        cb(null, uniqueName);
    },
});

// Allowed MIME types
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
];

// Multer instance for file upload
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images, PDFs, and document files are allowed."));
        }
    },
});

// Function to convert and store images in WebP format
const convertToWebPAndGenerateVariants = async (filePath, filename) => {
    const variantsDir = "uploads/variants";
    if (!fs.existsSync(variantsDir)) fs.mkdirSync(variantsDir, { recursive: true });

    const sizes = {
        thumbnail: { width: 100, height: 100 },
        mobile: { width: 480 },
        tab: { width: 768 },
        desktop: { width: 1920 },
    };

    const variants = {};
    for (const [key, size] of Object.entries(sizes)) {
        const outputPath = path.join(variantsDir, `${key}-${filename}`);
        await sharp(filePath)
            .resize(size.width, size.height, { fit: "cover" })
            .webp({ quality: 80 }) // Convert to WebP
            .toFile(outputPath);
        variants[key] = outputPath;
    }

    return variants;
};

// Middleware to handle uploads and convert images
const handleFileUpload = async (req, res, next) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded." });
        }

        const processedFiles = [];
        for (const file of files) {
            const filename = `${Date.now()}-${path.parse(file.originalname).name}.webp`;
            const webpFilePath = path.join("uploads/originals", filename);

            // Convert uploaded file to WebP
            await sharp(file.path)
                .webp({ quality: 80 })
                .toFile(webpFilePath);

            // Generate variants
            const variants = await convertToWebPAndGenerateVariants(webpFilePath, filename);

            processedFiles.push({
                original: webpFilePath,
                variants,
            });

            // Remove original file if not in WebP format
            if (!file.filename.endsWith(".webp")) {
                fs.unlinkSync(file.path); // Delete non-WebP uploaded file
            }
        }

        req.processedFiles = processedFiles;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { upload, handleFileUpload };

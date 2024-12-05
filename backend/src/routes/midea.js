const express = require("express");
const router = express.Router();
const { upload, handleFileUpload } = require("../utils/fileUpload");
const { midea } = require("../controllers/");
const { uploadMedia, getAllMedia, getMediaById, deleteMedia } = midea;
const authenticate = require("../middlewares/auth");

// Upload Media Route
router.post("/upload", authenticate(["admin", "super-admin"]), upload.array("files", 10), handleFileUpload, uploadMedia);

router.get("/", getAllMedia);

router.route("/:id")
    .get(getMediaById)
    .delete(authenticate(["admin", "super-admin"]), deleteMedia);

module.exports = router;

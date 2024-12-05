// routes/jobCategoryRoutes.js

const express = require("express");
const { category } = require('../controllers/')
const authenticate = require("../middlewares/auth");
const {
    createJobCategory,
    getAllJobCategories,
    updateJobCategory,
    deleteJobCategory,
    getCategoryById
} = category

const router = express.Router();

router.route("/")
    .post(authenticate(["admin", "super-admin"]), createJobCategory)
    .get(getAllJobCategories);

router.route("/:id")
    .get(getCategoryById)
    .put(authenticate(["admin", "super-admin"]), updateJobCategory)
    .delete(authenticate(["admin", "super-admin"]), deleteJobCategory);

module.exports = router;

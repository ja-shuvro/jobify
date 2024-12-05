const express = require("express");
const { type } = require("../controllers/");
const { createJobType, getJobTypes, getJobTypeById, updateJobType, deleteJobType } = type;
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .get(getJobTypes)
    .post(authenticate(["admin", "super-admin"]), createJobType);

router.route("/:id")
    .get(getJobTypeById)
    .put(authenticate(["admin", "super-admin"]), updateJobType)
    .delete(authenticate(["admin", "super-admin"]), deleteJobType);

module.exports = router;

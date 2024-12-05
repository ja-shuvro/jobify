const express = require("express");
const { createJob, getJobs, updateJob, deleteJob } = require("../controllers/jobController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
    .post(authenticate(["admin", "super-admin"]), createJob)
    .get(getJobs);

router.route("/:id")
    .put(authenticate(["admin", "super-admin"]), updateJob)
    .delete(authenticate(["admin", "super-admin"]), deleteJob);

module.exports = router;

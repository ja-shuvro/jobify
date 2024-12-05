const express = require("express");
const { job } = require("../controllers/");
const authenticate = require("../middlewares/auth");
const { createJob, getJobs, getJobById, updateJob, deleteJob } = job;

const router = express.Router();

router.route("/")
    .post(authenticate(["admin", "super-admin"]), createJob)
    .get(getJobs);

router.route("/:id")
    .get(getJobById)
    .put(authenticate(["admin", "super-admin"]), updateJob)
    .delete(authenticate(["admin", "super-admin"]), deleteJob);

module.exports = router;

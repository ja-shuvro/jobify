const express = require("express");
const { user } = require("../controllers/");
const { getUsers, getUserById, updateUser, terminateUser } = user;
const authenticate = require("../middlewares/auth");

const router = express.Router();

// Get all user
router.get("/", getUsers);

// Get user by id
router.route("/:id")
    .get(getUserById)
    .put(authenticate(["admin", "super-admin"]), updateUser);

router.patch("/:id/terminate", authenticate(["admin", "super-admin"]), terminateUser);

module.exports = router;

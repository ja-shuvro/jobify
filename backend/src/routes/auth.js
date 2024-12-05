const express = require("express");
const { auth } = require("../controllers/");
const { register, login } = auth;

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;

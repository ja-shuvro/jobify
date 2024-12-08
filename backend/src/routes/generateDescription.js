const express = require('express');
const authenticate = require("../middlewares/auth");
const { generateDescription } = require('../controllers/');

const router = express.Router();

// Route for generating description for any entity
router.post('/', authenticate(["admin", "super-admin"]), generateDescription);

module.exports = router;

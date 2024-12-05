const express = require("express");
const { createCompany, getCompanies, updateCompany, deleteCompany } = require("../controllers/companyController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
    .post(authenticate(["admin", "super-admin"]), createCompany)
    .get(getCompanies);

router.route("/:id")
    .put(authenticate(["admin", "super-admin"]), updateCompany)
    .delete(authenticate(["admin", "super-admin"]), deleteCompany);

module.exports = router;

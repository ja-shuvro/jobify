const express = require("express");
const { company } = require("../controllers/");
const { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } = company;
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.route("/")
    .post(authenticate(["admin", "super-admin"]), createCompany)
    .get(getCompanies);

router.route("/:id")
    .get(getCompanyById)
    .put(authenticate(["admin", "super-admin"]), updateCompany)
    .delete(authenticate(["admin", "super-admin"]), deleteCompany);

module.exports = router;

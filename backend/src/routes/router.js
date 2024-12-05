const routes = require("express").Router();
const { companyRoutes, jobRoutes, categoryRoutes, userRoutes, typeRoutes, mideaRoutes } = require("./")

// Define routes
routes.use("/companies", companyRoutes);
routes.use("/jobs", jobRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/users", userRoutes);
routes.use("/types", typeRoutes);
routes.use("/midea", mideaRoutes);

module.exports = routes;

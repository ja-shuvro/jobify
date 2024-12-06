const routes = require("express").Router();
const { companyRoutes, jobRoutes, categoryRoutes, userRoutes, typeRoutes, mideaRoutes, generateDescriptionRoutes } = require("./")

// Define routes
routes.use("/companies", companyRoutes);
routes.use("/jobs", jobRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/users", userRoutes);
routes.use("/types", typeRoutes);
routes.use("/midea", mideaRoutes);
routes.use("/generate-description", generateDescriptionRoutes);

module.exports = routes;

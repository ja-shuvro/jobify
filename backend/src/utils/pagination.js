/**
 * Apply pagination to a Mongoose query with job count
 * @param {Object} model - Mongoose model to query
 * @param {Object} filter - Filter criteria for the query
 * @param {Number} page - Current page number (default: 1)
 * @param {Number} limit - Number of items per page (default: 10)
 * @param {Object} options - Additional options for the query (e.g., projections, sorting)
 * @param {String} lookupField - The field to join on (e.g., "categoryId" in the Job model)
 * @returns {Object} - Pagination metadata and paginated results
 */
const paginate = async (model, filter = {}, page = 1, limit = 10, options = {}, projection = null) => {
    try {
        const skip = (page - 1) * limit;

        // Build the aggregation pipeline
        const pipeline = [
            { $match: filter }, // Apply filter criteria
            {
                $lookup: {
                    from: "jobs", // Replace with the actual Job collection name
                    localField: "_id",
                    foreignField: "categoryId", // Update with the correct lookup field
                    as: "jobs",
                },
            },
            {
                $addFields: {
                    jobCount: { $size: "$jobs" }, // Calculate the job count
                },
            },
        ];

        // Add a $project stage if a projection is provided
        if (projection) {
            pipeline.push({
                $project: projection,
            });
        }

        // Add sorting, skipping, and limiting
        pipeline.push(
            { $sort: options.sort || { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        );

        // Execute the aggregation
        const [results, totalCount] = await Promise.all([
            model.aggregate(pipeline).exec(),
            model.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            page,
            limit,
            totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            results,
        };
    } catch (error) {
        throw new Error(`Pagination error: ${error.message}`);
    }
};



module.exports = { paginate };

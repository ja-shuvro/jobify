/**
 * Apply pagination to a Mongoose query
 * @param {Object} model - Mongoose model to query
 * @param {Object} filter - Filter criteria for the query
 * @param {Number} page - Current page number (default: 1)
 * @param {Number} limit - Number of items per page (default: 10)
 * @param {Object} options - Additional options for the query (e.g., projections, sorting)
 * @returns {Object} - Pagination metadata and paginated results
 */
const paginate = async (model, filter = {}, page = 1, limit = 10, options = {}) => {
    try {
        const skip = (page - 1) * limit;

        const query = model.find(filter, options.projection || null).sort(options.sort || {});

        const [results, totalCount] = await Promise.all([
            query.skip(skip).limit(limit).exec(),
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

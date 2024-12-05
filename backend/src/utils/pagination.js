/**
 * Apply pagination to a Mongoose query
 * @param {Object} query - Mongoose query object
 * @param {Number} page - Current page number (default: 1)
 * @param {Number} limit - Number of items per page (default: 10)
 * @returns {Object} - Pagination metadata and paginated results
 */
const paginate = async (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [results, totalCount] = await Promise.all([
        query.skip(skip).limit(limit).exec(),
        query.model.countDocuments(query.getQuery()),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
        page,
        limit,
        totalCount,
        totalPages,
        results,
    };
};

module.exports = { paginate };

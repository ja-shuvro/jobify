const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 * @param {Object} payload - Data to include in the token
 * @param {String} secret - Secret key for signing
 * @param {String} expiresIn - Expiration time for the token
 * @returns {String} - Signed JWT token
 */
const generateToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT Token
 * @param {String} token - JWT token to verify
 * @param {String} secret - Secret key used for verification
 * @returns {Object} - Decoded token if valid
 */
const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

/**
 * Decode JWT Token (without verification)
 * @param {String} token - JWT token to decode
 * @returns {Object} - Decoded token payload
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
};

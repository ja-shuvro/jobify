const jwt = require("jsonwebtoken");

const authenticate = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized", message: "Sorry! Your token has been expired, Please login again!" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Forbidden", message: "Sorry! This route are protected for Super Admin and Admin!" });
            }
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ error: "Unauthorized", message: 'Login failed. Please check your credentials and try again.' });
        }
    };
};

module.exports = authenticate;

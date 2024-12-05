const jwt = require("jsonwebtoken");

const authenticate = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Forbidden" });
            }
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ error: "Unauthorized" });
        }
    };
};

module.exports = authenticate;

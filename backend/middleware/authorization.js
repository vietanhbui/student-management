const jwt = require('jsonwebtoken');

exports.hasAuthorization = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (decoded._id === req.params.studentId) {
            next();
        } else {
            return res.status(403).json({ error: 'Student is not authorized to perform this action' })
        }
    })
}

exports.isAdmin = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (decoded.role === "admin") {
            next();
        } else {
            return res.status(403).json({ error: 'Student is not authorized to perform this action' })
        }
    })
}
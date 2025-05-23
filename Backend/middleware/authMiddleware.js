// MIDDLEWARE : middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const tryCatch = (param) => async (req, res, next) => {
    try {
        await param(req, res);
    } catch (error) {
        next(error);
    }
};

const authorizationAdmin = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;

        jwt.verify(req.token, process.env.TOKEN_KEY, (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.userId = decoded.id;
            next();
        });
    } else {
        res.sendStatus(403);
    }
};

module.exports = {
    tryCatch,
    authorizationAdmin
};
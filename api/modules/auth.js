const jwt = require('jsonwebtoken');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const secretKey = process.env.SECRET_KEY;

const verifyTokenOwnership = (userIdKey) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).send('Unauthorized: No token provided');
        }

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).send('Forbidden: Invalid token');
            }

            req.user = user;

            if (user[userIdKey] !== req.body[userIdKey]) { 
                return res.status(403).send("Forbidden: You're not authorized to perform this action");
            }
            next();
        });
    };
};

module.exports = { verifyTokenOwnership };
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            if (process.env.DB_CONNECTED === 'false') {
                // Mock User for Offline Mode
                req.user = {
                    id: 'mock_user_id',
                    name: 'Guest User',
                    email: 'guest@example.com'
                };
            } else {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');

                if (!req.user) {
                    return res.status(401).json({ message: 'User not found' });
                }
            }
            next();
        } catch (error) {
            console.error(error);
            // If offline, still allow if token is basically valid structure or we just trust for demo
            if (process.env.DB_CONNECTED === 'false') {
                req.user = { id: 'mock_user_id', name: 'Guest User', email: 'guest@example.com' };
                return next();
            }
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };

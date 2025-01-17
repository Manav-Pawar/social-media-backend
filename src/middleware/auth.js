const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        const admin = await Admin.findById(decoded.id);
        
        if (!admin) {
            throw new Error('Admin not found');
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = authMiddleware;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// / Authorization codes (in practice, store these securely, perhaps in a database)
const VALID_AUTH_CODES = new Set(['ADMIN123', 'SUPER456']); // Example codes

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, authCode } = req.body;

        // Validate authorization code
        if (!VALID_AUTH_CODES.has(authCode)) {
            return res.status(401).json({ error: 'Invalid authorization code' });
        }

        // Check if username or email already exists
        const existingAdmin = await Admin.findOne({
            $or: [{ username }, { email }]
        });

        if (existingAdmin) {
            return res.status(400).json({
                error: 'Username or email already exists'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }

        // Determine admin role based on auth code
        const role = authCode === 'SUPER456' ? 'super_admin' : 'admin';

        // Create new admin
        const admin = new Admin({
            username,
            email,
            password,
            role
        });

        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            'your_jwt_secret_key',
            { expiresIn: '24h' }
        );

        // Return success without sending back sensitive info
        res.status(201).json({
            message: 'Admin account created successfully',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: 'Error creating admin account'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id },
            'your_jwt_secret_key',
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
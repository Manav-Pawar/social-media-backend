const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');

const createInitialAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await Admin.create({
                username: 'admin',
                email: 'admin@example.com', // Provide a valid email
                password: hashedPassword,
                role: 'super_admin' // Optional, based on your requirements
            });
            console.log('Initial admin account created');
        } else {
            console.log('Admin account already exists');
        }
    } catch (error) {
        console.error('Error creating initial admin:', error);
    }
};

module.exports = { createInitialAdmin };

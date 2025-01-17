const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');

const createInitialAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await Admin.create({
                username: 'admin',
                password: hashedPassword
            });
            console.log('Initial admin account created');
        }
    } catch (error) {
        console.error('Error creating initial admin:', error);
    }
};

module.exports = { createInitialAdmin };
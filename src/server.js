const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const adminRoutes = require('./routes/admin');
const submissionRoutes = require('./routes/submission');
const { createInitialAdmin } = require('./services/admin');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to database
connectDB();

// Initialize admin account
createInitialAdmin();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/submissions', submissionRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
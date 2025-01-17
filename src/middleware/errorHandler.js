const multer = require('multer');

const errorHandler = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size is too large. Max size is 5MB' });
        }
    }
    res.status(500).json({ error: error.message });
};

module.exports = errorHandler;
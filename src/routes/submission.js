const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Submission = require('../models/submission');
const upload = require('../config/multer');
const authMiddleware = require('../middleware/auth');

router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        const { name, handle } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const submission = new Submission({
            name,
            handle,
            images
        });

        await submission.save();
        res.status(201).json(submission);
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: 'Error creating submission' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find().sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching submissions' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        submission.images.forEach(imagePath => {
            const fullPath = path.join(__dirname, '..', imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        });

        await Submission.findByIdAndDelete(req.params.id);
        res.json({ message: 'Submission deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting submission' });
    }
});

module.exports = router;
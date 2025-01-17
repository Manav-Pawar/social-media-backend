const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    handle: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Submission', submissionSchema);
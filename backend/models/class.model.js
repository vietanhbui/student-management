const mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
    class: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
    updated: {
        type: Date,
    }
});

module.exports = mongoose.model('Class', classSchema);
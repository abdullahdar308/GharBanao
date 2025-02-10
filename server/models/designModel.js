const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
    name: { type: String,  default: "Untitled Design" },
    data: { type: Object, default: {} }, // Stores Fabric.js JSON
    user: { 
        type: String,
        // ref: 'user',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Design', DesignSchema);

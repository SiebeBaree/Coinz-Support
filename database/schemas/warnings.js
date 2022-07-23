const mongoose = require('mongoose');

const warningsSchema = new mongoose.Schema({
    id: { type: Number, require: true },
    moderatorId: { type: String, require: true },
    reason: { type: String, default: "No reason was given" },
    timestamp: { type: Number, require: true, default: parseInt(Date.now() / 1000) }
})

module.exports = mongoose.model("warnings", new mongoose.Schema({
    userId: { type: String, required: true },
    warnings: [{ type: warningsSchema }]
}));
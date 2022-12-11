const mongoose = require('mongoose');

module.exports = mongoose.model("modmail", new mongoose.Schema({
    userId: { type: String, require: true },
    channelId: { type: String, require: true }
}));
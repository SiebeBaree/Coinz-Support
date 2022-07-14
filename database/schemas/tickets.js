const mongoose = require('mongoose');

module.exports = mongoose.model("ticket", new mongoose.Schema({
    ticketId: { type: String, require: true },
    channelId: { type: String, require: true },
    ownerId: { type: String, require: true },
    channelType: { type: Number, require: false, default: 0 },
    messageId: { type: String, require: true },
    confirmMessageId: { type: String, require: false, default: "0" }
}));
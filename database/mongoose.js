const ticketSchema = require("./schemas/tickets");
const modmailSchema = require("./schemas/modmail");

// Create/find tickets collection
module.exports.fetchTicket = async function (user) {
    let ticketDoc = await ticketSchema.findOne({ ownerId: user });

    if (ticketDoc) {
        return ticketDoc;
    } else {
        return undefined;
    }
};

module.exports.fetchModmail = async function (id) {
    let doc = await modmailSchema.findOne({ userId: id });

    if (doc) {
        return doc;
    } else {
        doc = await modmailSchema.findOne({ channelId: id });
        if (doc) return doc;
    }

    return undefined;
};
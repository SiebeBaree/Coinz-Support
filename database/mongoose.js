const ticketSchema = require("./schemas/tickets");

// Create/find tickets collection
module.exports.fetchTicket = async function (user) {
    let ticketDoc = await ticketSchema.findOne({ ownerId: user });

    if (ticketDoc) {
        return ticketDoc;
    } else {
        return undefined;
    }
};
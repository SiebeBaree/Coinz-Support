const { closeTicket } = require('../../tools/ticket');

module.exports.execute = async (client, interaction, data) => {
    closeTicket(client, interaction, true);
}

module.exports.help = {
    name: "close",
    description: "Close your ticket.",
    options: [],
    enabled: true,
    memberPermissions: [],
    ownerOnly: false
}
const { createTicket } = require('../../tools/ticket');

module.exports.execute = async (client, interaction, data) => {
    let reason = interaction.options.getString('reason');
    if (!reason) reason = "No reason provided.";
    createTicket(client, interaction, reason);
}

module.exports.help = {
    name: "ticket",
    description: "Create a ticket.",
    options: [
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason of creating this ticket.',
            required: false
        }
    ],
    enabled: true,
    memberPermissions: [],
    ownerOnly: false
}
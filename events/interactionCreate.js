const ticket = require('../tools/ticket');
const role = require('../tools/role');

module.exports = async (client, interaction) => {
    try {
        if (interaction.member.bot) return; // Return if member is bot
        if (!interaction.guild) return; // Return if dms or group chat

        if (interaction.isCommand()) {
            //Checking if the message is a command
            const cmd = client.commands.get(interaction.commandName);

            //If it isn't a command then return
            if (!cmd) return;

            //If command is owner only and author isn't owner return
            if (cmd.help.ownerOnly && interaction.member.id !== client.config.ownerId) return;

            let userPerms = [];
            //Checking for members permission
            cmd.help.memberPermissions.forEach((perm) => {
                if (!interaction.channel.permissionsFor(interaction.member).has(perm)) {
                    userPerms.push(perm);
                }
            });
            //If user permissions arraylist length is more than one return error
            if (userPerms.length > 0) return interaction.reply("You cannot use this command. You need the following permissions: " + userPerms.map((p) => `\`${p}\``).join(", "));

            //Get the user database
            let data = {};
            data.cmd = cmd;
            data.config = client.config;

            //Execute the command
            cmd.execute(client, interaction, data);
        } else if (interaction.isButton()) {
            if (interaction.customId.includes('ticketCreate')) {
                let btnId = interaction.customId.replace('ticketCreate', '');
                let subject = btnId.replace('_', ' ');
                ticket.createTicket(client, interaction, subject);
            } else if (interaction.customId === 'ticketClose') {
                ticket.closeTicket(client, interaction);
            } else if (interaction.customId === 'ticketCloseConfirmYes') {
                ticket.confirmCloseTicket(client, interaction);
            } else if (interaction.customId === 'ticketCloseConfirmNo') {
                ticket.confirmCancelTicket(client, interaction);
            } else if (interaction.customId.includes('roles')) {
                const roleId = interaction.customId.replace('roles', '');
                const userAlreadyHasRole = await role.checkRole(interaction, roleId);

                if (userAlreadyHasRole) role.takeRole(interaction, roleId);
                else role.giveRole(interaction, roleId);
                interaction.deferUpdate();
            }
        }
    } catch (err) {
        console.error(err);
    }
}
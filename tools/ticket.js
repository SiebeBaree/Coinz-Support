const fs = require('fs');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const ticketNumber = require('../data/ticketSettings.json');
const ticketSchema = require("../database/schemas/tickets");

const zeroPad = (num, places) => String(num).padStart(places, '0');

module.exports.createTicket = async (client, interaction, reason = undefined) => {
    // check if member has ticket open
    let ticketData = await client.database.fetchTicket(interaction.member.id);

    if (ticketData) {
        return interaction.reply({ content: `You already have a ticket open.`, ephemeral: true })
    }

    // increment ticket number
    ticketNumber.number++;

    // create channel
    const channel = await interaction.guild.channels.create(`ticket-${zeroPad(ticketNumber.number, 4)}`, {
        type: "GUILD_TEXT",
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                allow: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'EMBED_LINKS', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS'],
                deny: ['VIEW_CHANNEL']
            },
            {
                id: interaction.member.id,
                allow: ['VIEW_CHANNEL']
            },
            {
                id: client.config.ticket.adminRoleId,
                allow: ['VIEW_CHANNEL']
            }
        ],
        parent: client.config.ticket.categoryId
    });

    // save ticketnumber
    fs.writeFile(`${process.cwd()}/data/ticketSettings.json`, JSON.stringify(ticketNumber, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
    });

    // send hidden text to channel
    await interaction.reply({ content: `Visit your ticket here: <#${channel.id}>`, ephemeral: true });

    // send embed in channel
    if (reason === undefined) reason = "No reason was given.";

    const embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor({ name: `Ticket`, iconURL: interaction.guild.iconURL() || client.config.defaultAvatarUrl })
        .setDescription(`Thank you for creating a ticket. We will answer you as soon as possible.\nDon't tag us as this will only slow down our repsonds.\n\n**Ticket Owner:** <@${interaction.member.id}>\n**Reason:** ${reason}`)
        .setThumbnail(interaction.member.user.avatarURL() || interaction.member.user.defaultAvatarURL)
        .setTimestamp()
        .setFooter({ text: client.config.footer })

    const ticketCloseRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketClose")
            .setLabel("Close Ticket")
            .setEmoji('🔒')
            .setStyle("SECONDARY")
    )

    const msg = await channel.send({ embeds: [embed], components: [ticketCloseRow] });

    if (reason === "Staff Application") {
        await channel.send({ content: `Please fill in the staff application form first. If you have filled it in, you can tell us in this channel.\n**Form:** <https://forms.gle/N8drY51c6JJnyMCx8>\n\n*Don't close this ticket! We may have some follow-up questions.*` });
    }

    // add document in database
    ticketDoc = new ticketSchema({
        ticketId: ticketNumber.number,
        channelId: channel.id,
        ownerId: interaction.member.id,
        channelType: 0,
        messageId: msg.id,
        confirmMessageId: "0"
    })
    await ticketDoc.save().catch(err => console.log(err));
};

module.exports.closeTicket = async (client, interaction, cmd = false) => {
    // check if member is ticket owner or ticket staff
    let ticketData = await client.database.fetchTicket(interaction.member.id);
    const ticketRole = interaction.guild.roles.cache.find(role => role.id === client.config.ticket.adminRoleId);

    if (!ticketData) {
        if (interaction.member.roles.cache.has(ticketRole.id)) {
            ticketData = await ticketSchema.findOne({ channelId: interaction.channel.id });
            if (!ticketData) return await interaction.reply({ content: `This is not a ticket channel.`, ephemeral: true });
        } else {
            return await interaction.reply({ content: `You don't have any tickets open.`, ephemeral: true });
        }
    }

    let memberIsAuthorized = false;
    let messageId = ticketData.messageId;
    let alreadyClosing = false;

    if (ticketData.confirmMessageId != '0') {
        alreadyClosing = true;
    }

    if (ticketData.ownerId == interaction.member.id || interaction.member.roles.cache.has(ticketRole.id)) {
        if (interaction.channelId == ticketData.channelId) {
            memberIsAuthorized = true;
        } else {
            return await interaction.reply({ content: `You can only run this command in ticket channels.`, ephemeral: true });
        }
    }

    if (!memberIsAuthorized) return await interaction.reply({ content: `You don't have permission to close this ticket.`, ephemeral: true });
    if (alreadyClosing) return await interaction.reply({ content: `Please use the closing message above.`, ephemeral: true });

    // send embed in channel
    const ticketCloseConfirmRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketCloseConfirmYes")
            .setLabel("Yes")
            .setStyle("SUCCESS"),
        new MessageButton()
            .setCustomId("ticketCloseConfirmNo")
            .setLabel("No")
            .setStyle("DANGER")
    )

    if (cmd) await interaction.reply({ content: `Closing this ticket...`, ephemeral: true });
    else interaction.deferUpdate();

    let message = await interaction.channel.send({ content: `Are you sure you want to close this ticket?`, components: [ticketCloseConfirmRow] });

    // add confirmMessageId to ticketData
    await ticketSchema.updateOne({ ownerId: ticketData.ownerId }, {
        $set: {
            'confirmMessageId': `${message.id}`
        }
    });

    // disable close ticket button
    const ticketCloseDisabledRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketClose")
            .setLabel("Close Ticket")
            .setEmoji('🔒')
            .setStyle("SECONDARY")
            .setDisabled(true)
    )

    const msg = await interaction.channel.messages.fetch(messageId);
    await msg.edit({ components: [ticketCloseDisabledRow] })
};

module.exports.confirmCloseTicket = async (client, interaction) => {
    // check if member is ticket owner or ticket staff
    let memberIsAuthorized = false;

    let ticketData = await client.database.fetchTicket(interaction.member.id);
    const ticketRole = interaction.guild.roles.cache.find(role => role.id === client.config.ticket.adminRoleId);

    if (!ticketData) {
        if (interaction.member.roles.cache.has(ticketRole.id)) {
            ticketData = await ticketSchema.findOne({ channelId: interaction.channel.id });
            if (!ticketData) return await interaction.reply({ content: `This is not a ticket channel.`, ephemeral: true });
        } else {
            return await interaction.reply({ content: `You don't have any tickets open.`, ephemeral: true });
        }
    }

    if (ticketData.ownerId == interaction.member.id || interaction.member.roles.cache.has(ticketRole.id)) {
        if (interaction.channelId == ticketData.channelId) {
            memberIsAuthorized = true;
        } else {
            return await interaction.reply({ content: `You can only run this command in ticket channels.`, ephemeral: true });
        }
    }

    if (!memberIsAuthorized) return interaction.reply({ content: `You don't have permission to close this ticket.`, ephemeral: true });

    // remove ticket from ticketData
    await ticketSchema.deleteOne({ ownerId: ticketData.ownerId });

    // delete channel
    await interaction.channel.delete();
};

module.exports.confirmCancelTicket = async (client, interaction) => {
    // check if member is ticket owner or ticket staff
    let ticketData = await client.database.fetchTicket(interaction.member.id);
    const ticketRole = interaction.guild.roles.cache.find(role => role.id === client.config.ticket.adminRoleId);

    if (!ticketData) {
        if (interaction.member.roles.cache.has(ticketRole.id)) {
            ticketData = await ticketSchema.findOne({ channelId: interaction.channel.id });
            if (!ticketData) return await interaction.reply({ content: `This is not a ticket channel.`, ephemeral: true });
        } else {
            return await interaction.reply({ content: `You don't have any tickets open.`, ephemeral: true });
        }
    }

    let messageId = ticketData.messageId;
    let confirmMessageId = ticketData.confirmMessageId;
    let memberIsAuthorized = false;

    if (ticketData.ownerId == interaction.member.id || interaction.member.roles.cache.has(ticketRole.id)) {
        if (interaction.channelId == ticketData.channelId) {
            memberIsAuthorized = true;
        } else {
            return await interaction.reply({ content: `You can only run this command in ticket channels.`, ephemeral: true });
        }
    }

    if (!memberIsAuthorized) return interaction.reply({ content: `You don't have permission to close this ticket.`, ephemeral: true });

    // check if confirm message exists
    if (confirmMessageId === '0') return interaction.reply({ content: `Oops something went wrong...`, ephemeral: true });

    // delete confirm message
    const confirmMsg = await interaction.channel.messages.fetch(confirmMessageId);
    await confirmMsg.delete();

    // reset confirmMessageId in ticketData
    await ticketSchema.updateOne({ ownerId: ticketData.ownerId }, {
        $set: {
            'confirmMessageId': `0`
        }
    });

    // enable close ticket button
    const ticketCloseEnabledRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketClose")
            .setLabel("Close Ticket")
            .setEmoji('🔒')
            .setStyle("SECONDARY")
            .setDisabled(false)
    )

    const msg = await interaction.channel.messages.fetch(messageId);
    await msg.edit({ components: [ticketCloseEnabledRow] })
};
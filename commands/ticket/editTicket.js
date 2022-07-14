const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs');
const ticketSettings = require('../../data/ticketSettings.json');

module.exports.execute = async (client, interaction, data) => {
    const closeStaffApplication = interaction.options.getBoolean('close-staff') || false;

    const embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle(`:ticket: Create a Ticket`)
        .setDescription(`Need help with something or is there anything you want to tell the staff? **Create your ticket now!**\n\n__Click on any of the buttons to create a ticket:__\n:star: General Ticket\n:warning: Report Something/Someone\n:lock: Staff Application${closeStaffApplication === true ? " (Currently closed)" : ""}\n:coin: Coinz Support\n:alarm_clock: Big Ben Support (Coming soon!)\n\n**Languages:** English :flag_gb:/:flag_us:, Dutch :flag_nl:/:flag_be:\n\n*If you cannot open a ticket, you probably have a ticket open already.*`)
        .setFooter({ text: client.config.footer })
        .setImage("https://cdn.coinzbot.xyz/bot/tickets.png")

    const row1 = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketCreateGeneral")
            .setLabel("General")
            .setStyle("PRIMARY")
            .setEmoji("⭐"),
        new MessageButton()
            .setCustomId("ticketCreateReport")
            .setLabel("Report")
            .setStyle("DANGER")
            .setEmoji("⚠️"),
        new MessageButton()
            .setCustomId("ticketCreateStaff_Application")
            .setLabel("Staff Application")
            .setStyle("SUCCESS")
            .setEmoji("🔒")
            .setDisabled(closeStaffApplication),
    )

    const row2 = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketCreateCoinz")
            .setLabel("Coinz")
            .setStyle("SECONDARY")
            .setEmoji("🪙"),
        new MessageButton()
            .setCustomId("ticketCreateBigBen")
            .setLabel("Big Ben")
            .setStyle("SECONDARY")
            .setEmoji("⏰")
            .setDisabled(true)
    )

    const channel = client.channels.cache.get(client.config.ticket.channelId);
    const message = await channel.messages.fetch(ticketSettings.messageId);
    await message.edit({ embeds: [embed], components: [row1, row2] });
    await interaction.reply({ content: `Edited the ticket message!`, ephemeral: true });
}

module.exports.help = {
    name: "edit-ticket",
    description: "Edit the ticket create message.",
    options: [
        {
            name: 'close-staff',
            type: 'BOOLEAN',
            description: 'Close the staff application button?',
            required: true
        }
    ],
    enabled: true,
    memberPermissions: [],
    ownerOnly: true
}
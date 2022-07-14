const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs');
const ticketSettings = require('../../data/ticketSettings.json');

module.exports.execute = async (client, interaction, data) => {
    const embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle(`:ticket: Create a Ticket`)
        .setDescription(`Need help with something or is there anything you want to tell the staff? **Create your ticket now!**\n\n__Click on any of the buttons to create a ticket:__\n:star: General Ticket\n:warning: Report Something/Someone\n:lock: Staff Application\n:coin: Coinz Support\n:alarm_clock: Big Ben Support\n\n**Languages:** English :flag_gb:/:flag_us:, Dutch :flag_nl:/:flag_be:\n\n*If you cannot open a ticket, you probably have a ticket open already.*`)
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
    )

    const channel = client.channels.cache.get(client.config.ticket.channelId);
    const msg = await channel.send({ embeds: [embed], components: [row1, row2] });

    ticketSettings.messageId = msg.id;

    fs.writeFile(`${process.cwd()}/data/ticketSettings.json`, JSON.stringify(ticketSettings, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
    });

    await interaction.reply({ content: `Successfully setup the ticket module.`, ephemeral: true });
}

module.exports.help = {
    name: "ticket-setup",
    description: "Setup the ticket module.",
    options: [],
    enabled: true,
    memberPermissions: [],
    ownerOnly: true
}
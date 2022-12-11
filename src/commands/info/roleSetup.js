const { MessageActionRow, MessageButton } = require('discord.js');

module.exports.execute = async (client, interaction, data) => {
    const content = `:sparkles: **__Special Roles__**
> <@&939819940796575764> ➼ For people who actively contribute to Coinz or Big Ben in some way or another.
> <@&938732975070248991> ➼ Given to those that boost the server.\n
:lock: **__Staff Roles__**
> <@&939800772227522561> ➼ Given to all staff members that actively advertise for Coinz.
> <@&939800727574949909> ➼ Given to the designers for Coinz.
> <@&939802274115485736> ➼ Be part of the Big Ben staff team.
> <@&939802251822780446> ➼ Be part of the Coinz staff team.
> <@&939800674235990056> ➼ Given to the moderators of the Coinz Support Server.
> <@&939800692971929611> ➼ Given to the developers of Coinz or Big Ben.
> <@&939801563214532638> ➼ Access to all perms.\n
:bell: **__Self Roles__**
> <@&939803406476918814> ➼ Get notifications about smaller general updates.
> <@&939806043389698048> ➼ Get pinged whenever a new giveaway drops.
> <@&939806441353646090> ➼ Get notifications about all Coinz updates.
> <@&939885407842218046> ➼ Get notifications about all Big Ben updates.`

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("roles939803406476918814")
            .setLabel("Announcements")
            .setEmoji('🔔')
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId("roles939806043389698048")
            .setLabel("Giveaways")
            .setEmoji('🎉')
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId("roles939806441353646090")
            .setLabel("Coinz Updates")
            .setEmoji('🪙')
            .setStyle("SECONDARY"),
        new MessageButton()
            .setCustomId("roles939885407842218046")
            .setLabel("Big Ben Updates")
            .setEmoji('⏰')
            .setStyle("SECONDARY")
    )

    await interaction.channel.send({ content: content, components: [row] });
    interaction.reply({ content: `Successfully setup the roles module.`, ephemeral: true });
}

module.exports.help = {
    name: "role-setup",
    description: "Setup all roles.",
    options: [],
    enabled: true,
    memberPermissions: [],
    ownerOnly: true
}
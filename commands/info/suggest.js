const { MessageEmbed } = require("discord.js");

const suggestChannelId = "990617996726788177";

function createEmbed(client, interaction, data) {
    let embed = new MessageEmbed()
        .setAuthor({ name: `Suggestion from ${interaction.member.nickname || interaction.member.user.username}`, iconURL: `${interaction.member.displayAvatarURL() || client.config.defaultAvatarUrl}` })
        .setColor(client.config.embedColor)
        .setFooter({ text: client.config.footer })
        .setDescription(data.suggestion || "No Description.")
    return embed;
};

module.exports.execute = async (client, interaction, data) => {
    data.suggestion = interaction.options.getString('suggestion');
    await interaction.reply({ content: `Thank you for your suggestion. It has been posted in <#990617996726788177>.`, ephemeral: true });

    let channel = interaction.guild.channels.cache.get(suggestChannelId);
    if (channel === undefined) await interaction.guild.channels.fetch(suggestChannelId);
    const message = await channel.send({ embeds: [createEmbed(client, interaction, data)] });
    message.react('<a:thumbs_up:939891348377595985>');
    message.react('<a:thumbs_down:939891365301596200>');
}

module.exports.help = {
    name: "suggest",
    description: "Suggest a feature for Coinz.",
    usage: ["suggest <suggestion>"],
    options: [
        {
            name: 'suggestion',
            type: 'STRING',
            description: 'The thing you want to improve in Coinz.',
            required: true
        }
    ],
    enabled: true,
    memberPermissions: [],
    ownerOnly: false
}
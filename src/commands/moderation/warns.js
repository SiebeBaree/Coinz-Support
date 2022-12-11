const { MessageEmbed } = require("discord.js");
const warnModel = require("../../schemas/warnings");

module.exports.execute = async (client, interaction, data) => {
    const member = interaction.options.getMember("user") || interaction.user;

    const userWarnings = await warnModel.findOne({ userId: member.id });
    if (userWarnings === null || userWarnings.warnings.length <= 0) return await interaction.reply({ content: `${member} doesn't have a warning.`, ephemeral: true });
    await interaction.deferReply();

    const userwarns = userWarnings.warnings
        .map((warn) => {
            return [
                `**Moderator:** <@${warn.moderatorId}>`,
                `**Reason:** \`${warn.reason}\``,
                `**Warn ID:** \`${warn.id}\``,
                `**Timestamp:** <t:${warn.timestamp}:F>`,
            ].join("\n");
        })
        .join("\n\n");

    const embed = new MessageEmbed()
        .setAuthor({ name: `Warnings of ${member.displayName}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
        .setDescription(userwarns || "No warnings found...")
        .setColor(client.config.embedColor)
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: client.config.footer })

    await interaction.editReply({ embeds: [embed] });
};

module.exports.help = {
    name: "warns",
    description: "Warn user for breaking the rules.",
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The amount you want to get rid off.',
            required: false
        }
    ],
    enabled: true,
    memberPermissions: ["MANAGE_MESSAGES"],
    ownerOnly: false
}

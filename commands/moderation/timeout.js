const { Permissions } = require("discord.js");

module.exports.execute = async (client, interaction, data) => {
    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason was given.";
    const time = interaction.options.getInteger("duration");

    if (target.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return await interaction.reply({ content: "You can't timeout an admin!", ephemeral: true, });
    if (target.id === interaction.user.id) return await interaction.reply({ content: "You can't timeout yourself...", ephemeral: true, });
    if (target.user.bot) return await interaction.reply({ content: "You can't timeout a bot.", ephemeral: true, });

    await target.timeout(time * 1000, reason);
    await interaction.reply({ content: `${target} timed out for ${client.tools.msToTime(time * 1000)}`, ephemeral: true });
    await client.tools.sendLog(client, interaction.guild, "User Timeout", interaction.member.id, `**User:** ${target}\n**Duration:** \`${client.tools.msToTime(time * 1000)}\`\n**Reason:** ${reason}`);
};

module.exports.help = {
    name: "timeout",
    description: "Warn user for breaking the rules.",
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to timeout.',
            required: true
        },
        {
            name: 'duration',
            type: 'INTEGER',
            description: 'How long they should be timed out for.',
            required: true,
            choices: [
                {
                    name: "1 Minute",
                    value: 60
                },
                {
                    name: "5 Minutes",
                    value: 300
                },
                {
                    name: "10 Minutes",
                    value: 600
                },
                {
                    name: "30 Minutes",
                    value: 600
                },
                {
                    name: "1 Hour",
                    value: 3600
                },
                {
                    name: "3 Hours",
                    value: 3600
                },
                {
                    name: "1 Day",
                    value: 86400
                },
                {
                    name: "3 Day",
                    value: 259200
                },
                {
                    name: "1 Week",
                    value: 604800
                }
            ]
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for timing them out, if any.',
            required: false
        }
    ],
    enabled: true,
    memberPermissions: ["MANAGE_MESSAGES"],
    ownerOnly: false
}
const warnModel = require("../../database/schemas/warnings");
const { Permissions } = require("discord.js");

module.exports.execute = async (client, interaction, data) => {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No Reason was given";

    if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return await interaction.reply({ content: "You can't warn an admin.", ephemeral: true, });
    if (member.id === interaction.user.id) return await interaction.reply({ content: "You can't warn yourself.", ephemeral: true, });
    if (member.user.bot) return await interaction.reply({ content: "You can't warn a bot.", ephemeral: true, });

    let obj = await warnModel.findOne({ userId: member.id });

    if (obj) {
        await warnModel.updateOne(
            { userId: member.id },
            {
                $push: {
                    warnings: {
                        id: obj.warnings.length + 1 || 1,
                        moderatorId: interaction.member.id,
                        reason: reason,
                        timestamp: parseInt(Date.now() / 1000)
                    }
                }
            }
        );
    } else {
        obj = new warnModel({
            userId: member.id,
            warnings: [{
                id: 1,
                moderatorId: interaction.member.id,
                reason: reason,
                timestamp: parseInt(Date.now() / 1000)
            }]
        });
        await obj.save().catch(err => console.log(err));
    }

    await interaction.reply({ content: `Warned ${member} for ${reason}.`, ephemeral: true });
    await client.tools.sendLog(client, interaction.guild, "Added Warning", interaction.member.id, `**User:** ${member}\n**Reason:** ${reason}`);
};

module.exports.help = {
    name: "warn",
    description: "Warn user for breaking the rules.",
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user you want to warn.',
            required: true
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason you want to give.',
            required: false
        }
    ],
    enabled: true,
    memberPermissions: ["MANAGE_MESSAGES"],
    ownerOnly: false
}

const warnModel = require("../../database/schemas/warnings");

module.exports.execute = async (client, interaction, data) => {
    const user = interaction.options.getUser("user");
    const id = interaction.options.getInteger("warn-id");

    const warn = await warnModel.findOne({ userId: user.id, 'warnings.id': id });
    if (!warn) return await interaction.reply({ content: `Warning with id \`${id}\` doesn't exist.`, ephemeral: true });

    await warnModel.updateOne(
        { userId: user.id },
        { $pull: { warnings: { id: id } } },
    );

    await interaction.reply({ content: `Removed warning from ${user} with ID: \`${id}\`.`, ephemeral: true });
    await client.tools.sendLog(client, interaction.guild, "Removed Warning", interaction.member.id, `**User:** ${user}\n**Warning ID:** \`${id}\``);
};

module.exports.help = {
    name: "remove-warn",
    description: "Remove a warning from the user.",
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user you want to remove a warning from.',
            required: true
        },
        {
            name: 'warn-id',
            type: 'INTEGER',
            description: 'The warning ID you want to remove.',
            required: true
        }
    ],
    enabled: true,
    memberPermissions: ["MANAGE_MESSAGES"],
    ownerOnly: false
}

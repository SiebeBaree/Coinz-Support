module.exports.execute = async (client, interaction, data) => {
    const user = interaction.options.getUser('user');
    await interaction.reply({ content: `**ID:** ${user.id}\n**Joined At:** <t:${parseInt(user.createdTimestamp / 1000)}:D> (${parseInt(user.createdTimestamp / 1000)})`, ephemeral: true })
}

module.exports.help = {
    name: "getinfo",
    description: "Get more information about a user.",
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user you want to get more information on.',
            required: true
        }
    ],
    enabled: true,
    memberPermissions: [],
    ownerOnly: true
}
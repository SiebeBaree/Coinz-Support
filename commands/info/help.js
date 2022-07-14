const { MessageEmbed } = require("discord.js");

function createCommandEmbed(client, data, command) {
    let embed = new MessageEmbed()
        .setAuthor({ name: `Help: ${command.name}`, iconURL: `${client.user.avatarURL() || client.config.defaultAvatarUrl}` })
        .setColor(client.config.embedColor)
        .setFooter({ text: client.config.footer })
        .setDescription(command.description || "No Description.")
        .addField('Command Usage', `\`/${command.usage || command.name}\``, false)

    return embed;
};

module.exports.execute = async (client, interaction, data) => {
    let commandName = interaction.options.getString('command');

    if (commandName != null) {
        const cmd = client.commands.get(commandName);

        if (!cmd) {
            return interaction.reply({ content: `That command doesn't exist.` })
        }

        const helpEmbed = createCommandEmbed(client, data, cmd.help);
        await interaction.reply({ embeds: [helpEmbed] });
    } else {
        let helpEmbed = new MessageEmbed()
            .setAuthor({ name: `Help`, iconURL: `${client.user.avatarURL() || client.config.defaultAvatarUrl}` })
            .setColor(client.config.embedColor)
            .setFooter({ text: client.config.footer })

        if (client.commands) {
            let allCommands = [];
            client.commands.forEach(cmd => allCommands.push(`\`${cmd.help.name}\``));
            if (allCommands.length) helpEmbed.setDescription(`Command Usage: \`/help [command]\`\n\n**Commands:**\n${allCommands.join(", ")}`);
        };

        return await interaction.reply({ embeds: [helpEmbed] });
    }
}

module.exports.help = {
    name: "help",
    description: "Get a list of all command or get more info about a specific command.",
    usage: ["help [command]"],
    options: [
        {
            name: 'command',
            type: 'STRING',
            description: 'Use this if you want to get more info about a command.',
            required: false
        }
    ],
    enabled: true,
    memberPermissions: [],
    ownerOnly: false
}
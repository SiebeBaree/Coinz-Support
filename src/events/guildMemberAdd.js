const { MessageEmbed } = require('discord.js');

const minimumDays = 5; // use 0 to disable

const giveRole = async (member, roldId) => {
    const role = member.guild.roles.cache.get(roldId);
    await member.roles.add(role);
}

module.exports = async (client, member) => {
    // Check for suspicious accounts
    if (member.user.avatarURL() === null) await giveRole(member, '939840999977525248');
    if (member.user.createdTimestamp >= Date.now() - (86400 * minimumDays)) await giveRole(member, '939840999977525248')

    // Send welcome message
    const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: `${member.displayAvatarURL() || client.config.defaultAvatarUrl}` })
        .setDescription(`• Username: <@${member.id}> (${member.id})\n• Account Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:F> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)\n• Date Joined: <t:${parseInt(Date.now() / 1000)}:F> (<t:${parseInt(Date.now() / 1000)}:R>)`)
        .setFooter({ text: client.config.footer })
        .setTimestamp()

    await client.channels.cache.get(client.config.logChannelId).send({ embeds: [embed] });
}
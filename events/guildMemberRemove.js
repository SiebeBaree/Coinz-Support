const { MessageEmbed } = require('discord.js');

module.exports = async (client, member) => {
    const embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: `${member.user.avatarURL() || client.config.defaultAvatarUrl}` })
        .setDescription(`• Username: <@${member.id}> (${member.id})\n• Account Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:F> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)\n• Date Joined: <t:${parseInt(Date.now() / 1000)}:F> (<t:${parseInt(Date.now() / 1000)}:R>)\n• Left On: <t:${parseInt(Date.now() / 1000)}:F> (<t:${parseInt(Date.now() / 1000)}:R>)`)
        .setFooter({ text: client.config.footer })
        .setTimestamp()

    await client.channels.cache.get(client.config.logChannelId).send({ embeds: [embed] });
}
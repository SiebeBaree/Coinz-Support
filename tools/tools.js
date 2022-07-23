const staffLogsChannelId = "939870751744462868";
const { MessageEmbed } = require("discord.js");

// milliseconds to time converter
module.exports.msToTime = ms => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 60));
    const hours = Math.floor(ms / (1000 * 60 * 60) % 60);
    const minutes = Math.floor(ms / (1000 * 60) % 60);
    const seconds = Math.floor(ms / (1000) % 60);

    let str = "";
    if (days) str = str + days + "d ";
    if (hours) str = str + hours + "h ";
    if (minutes) str = str + minutes + "m ";
    if (seconds) str = str + seconds + "s";

    return str || "0s";
};

module.exports.getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
};

module.exports.sendLog = async (client, guild, title, moderator, extra) => {
    const embed = new MessageEmbed()
        .setTitle(title || "Log")
        .setDescription(`**Moderator:** <@${moderator}>\n${extra}`)
        .setColor(client.config.embedColor)
        .setFooter({ text: client.config.footer })
        .setTimestamp()

    const channel = await guild.channels.fetch(staffLogsChannelId);
    await channel.send({ embeds: [embed] });
}
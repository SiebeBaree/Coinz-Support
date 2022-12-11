module.exports.execute = async (client, interaction, data) => {
    await interaction.deferReply();
    const dateNow = Date.now();
    await interaction.editReply({ content: `:ping_pong: **Ping:** ${client.ws.ping} ms\n:speech_balloon: **Responds Time:** ${dateNow - interaction.createdTimestamp} ms\n:white_check_mark: **Uptime:** ${client.tools.msToTime(client.uptime)}` });
}

module.exports.help = {
    name: "ping",
    description: "Get the latency between the bot and discord.",
    options: [],
    enabled: true,
    memberPermissions: [],
    ownerOnly: false
}
module.exports = async (client) => {
    var data = [];

    // Put all commands into an object and push it to an array.
    client.commands.forEach(commands => {
        if (commands.help.enabled) {
            let commandObject = {
                name: commands.help.name,
                description: commands.help.description || "No Description Provided.",
                options: commands.help.options
            };
            data.push(commandObject);
        }
    });

    // Temp code to update slash commands very quickly
    await client.guilds.cache.get(client.config.serverId)?.commands.set(data);

    client.user.setPresence({ activities: [{ name: client.config.presence.name, type: client.config.presence.type }], status: client.config.presence.status });
    client.logger.ready(`Client loaded.`)
}
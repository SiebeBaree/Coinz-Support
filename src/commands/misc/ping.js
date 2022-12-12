import Command from "../../structures/Command.js"
import { msToTime } from "../../lib/helpers.js"

export default class extends Command {
    info = {
        name: "ping",
        description: "Get the time between the bot and discord in milliseconds.",
        options: [],
        category: "misc",
        extraFields: [],
        enabled: true,
        deferReply: true
    };

    constructor(...args) {
        super(...args);
    }

    async run(interaction) {
        const dateNow = Date.now();
        await interaction.editReply({ content: `:ping_pong: **Ping:** ${bot.ws.ping} ms\n:speech_balloon: **Responds Time:** ${dateNow - interaction.createdTimestamp} ms\n:white_check_mark: **Uptime:** ${msToTime(bot.uptime)}` });
    }
}
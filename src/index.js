import dotenv from "dotenv";
dotenv.config();

import Bot from "./structures/Bot.js"
import { ActivityType, GatewayIntentBits, Partials } from "discord.js"
import mongoose from "mongoose"
const { connect } = mongoose;

const bot = global.bot = new Bot({
    partials: [Partials.GuildMember],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions],
    presence: {
        activities: [{
            name: "coinzbot.xyz",
            type: ActivityType.Playing
        }], status: "online"
    }
});

// Connect to MongoDB Database
connect(process.env.DATABASE_URI, {
    dbName: "coinz",
    useNewUrlParser: true,
    maxPoolSize: 100,
    minPoolSize: 5,
    family: 4,
    heartbeatFrequencyMS: 30000,
    keepAlive: true,
    keepAliveInitialDelay: 300000
}).then(() => bot.logger.ready('Connected to MongoDB'));

bot.login(process.env.DISCORD_TOKEN);
bot.rest.on('rateLimit', rateLimitData => {
    bot.logger.warn(`RATELIMITED for ${Math.floor(rateLimitData.timeout / 1000)} seconds | Limit: ${rateLimitData.limit} requests | Global? ${rateLimitData.global ? "yes" : "no"}`);
});

// Global Error Handler
const ignoredErrors = ["DiscordAPIError[10008]: Unknown Message"];
process.on('uncaughtException', (err) => {
    if (!ignoredErrors.includes(`${err.name}: ${err.message}`)) {
        bot.logger.error(err.stack);
    }
});

process.on('unhandledRejection', (err) => {
    if (!ignoredErrors.includes(`${err.name}: ${err.message}`)) {
        bot.logger.error(err.stack);
    }
});
/**
 * This is the main file for the bot. This file will essenaially initialize EVERYTHING in the bot.
 */

// IMPORTS
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { configVars } from "./utilities/Config";
import { handleError } from "./utilities/HandleError";
import mongoose from "mongoose";
import path from "path";
import { Log } from "./utilities/Logging";
import { initializeModules } from "./ModuleHandler";

export const client = new Client({
	intents: [
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
	],
	partials: [
		Partials.Message,
	]
});

// Initializes the entire bot.
initializeModules();

// ERROR HANDLING
process.on('unhandledRejection', async (err: Error) => await handleError(err, path.basename(__filename)));
process.on('uncaughtException', async (err: Error) => await handleError(err, path.basename(__filename)));
client.on("error", async (err: Error) => await handleError(err, path.basename(__filename)));
mongoose.connection.on("error", async (err: Error) => { await handleError(err, path.basename(__filename)); process.exit(500); });
mongoose.connection.on("connected", async () => { Log.debug("Mongoose has connected successfully."); });

client.login(configVars.token);
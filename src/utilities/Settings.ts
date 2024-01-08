import { Guild } from "discord.js";
import GuildSettings from "../schemas/GuildSettings";

export async function getSettings(guild: Guild) {
	let settings = await GuildSettings.findOne({
		guildID: guild!.id,
	});
	if (!settings) return null;
	return settings;
}
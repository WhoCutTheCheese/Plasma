import { Events, Guild } from "discord.js";
import { EventsBuilder } from "../structures/EventClass";
import GuildSettings from "../schemas/GuildSettings";
import UserData from "../schemas/UserData";

export default new EventsBuilder()
	.setEvent(Events.GuildDelete)
	.setOnce(false)
	.setExecutor(async (guild: Guild) => {
		await GuildSettings.deleteMany({
			guildID: guild.id
		});
		await UserData.deleteMany({
			guildID: guild.id
		});
	});
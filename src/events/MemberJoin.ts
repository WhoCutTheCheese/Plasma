import { Events, Guild, GuildMember } from "discord.js";
import { EventsBuilder } from "../structures/EventClass";
import GuildSettings from "../schemas/GuildSettings";
import UserData from "../schemas/UserData";

export default new EventsBuilder()
	.setEvent(Events.GuildMemberAdd)
	.setOnce(false)
	.setExecutor(async (member: GuildMember) => {

	});
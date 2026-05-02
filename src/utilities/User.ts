import { Guild, User } from "discord.js";
import Invites from "../schemas/Invites";
import UserData from "../schemas/UserData";

async function getTotalInvites(user: User, guild: Guild): Promise<number> {
	let total = 0
	const invites = await Invites.find({
		userID: user.id,
		guildID: guild.id
	})
	for (const invite of invites) {
		total += invite.uses
	}
	return total;
}

async function getRealInvites(user: User, guild: Guild): Promise<number> {
	let real = 0
	const invites = await Invites.find({
		userID: user.id,
		guildID: guild.id
	})
	const userData = await UserData.findOne({
		userID: user.id,
		guildID: guild.id
	})
	if (!userData) return 0;
	if (invites.length === 0) return 0;
	for (const invite of invites) {
		real += invite.uses
	}
	return real - (userData.invites?.left || 0) + (userData.invites?.fake || 0);
}

export { getTotalInvites, getRealInvites };
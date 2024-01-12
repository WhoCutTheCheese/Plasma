import { Collection, Events, Guild, GuildMember, Invite } from "discord.js";
import { EventsBuilder } from "../structures/EventClass";
import GuildSettings from "../schemas/GuildSettings";
import UserData from "../schemas/UserData";
import { handleError } from "../utilities/HandleError";
import Invites from "../schemas/Invites";

export default new EventsBuilder()
	.setEvent(Events.GuildMemberAdd)
	.setOnce(false)
	.setExecutor(async (member: GuildMember) => {
		const userData = new UserData({
			userID: member.user.id,
			guildID: member.guild.id
		});
		userData.save().catch((err: Error) => handleError(err, "MemberJoin.ts"));

		const invites = await member.guild.invites.fetch();
		let foundInviter: GuildMember | undefined;

		for (const singleInvite of invites) {
			const invite = singleInvite[1];
			const inviteFile = await Invites.findOne({
				inviteCode: invite.code
			});
			if (inviteFile?.uses! < invite.uses!) {
				foundInviter = await member.guild.members.fetch(inviteFile?.userID!) || undefined;
				break;
			}
		}
		//if() {}
	});
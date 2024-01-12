import { Collection, Events, Guild, GuildMember, Invite, TextChannel, User } from "discord.js";
import { EventsBuilder } from "../structures/EventClass";
import GuildSettings from "../schemas/GuildSettings";
import UserData from "../schemas/UserData";
import { handleError } from "../utilities/HandleError";
import Invites from "../schemas/Invites";
import { client } from "../Index";
import { getSettings } from "../utilities/Settings";
import { configVars } from "../utilities/Config";

export default new EventsBuilder()
	.setEvent(Events.GuildMemberAdd)
	.setOnce(false)
	.setExecutor(async (member: GuildMember) => {
		let settings = await getSettings(member.guild);
		if (!settings) return;
		const userData = new UserData({
			userID: member.user.id,
			guildID: member.guild.id
		});
		userData.save().catch((err: Error) => handleError(err, "MemberJoin.ts"));

		const invites = await member.guild.invites.fetch();
		let foundInviter: User | undefined;

		for (const singleInvite of invites) {
			const invite = singleInvite[1];
			let inviteFile = await Invites.findOne({
				inviteCode: invite.code
			});
			if(!inviteFile) {
				const channel = await member.guild.channels.fetch(settings.inviteTracking?.inviteLogChannel!) as TextChannel
				if(channel) {
					channel.send(`${configVars.warnedEmoji} Warning! <@${member.user.id}> joined with an unknown invite! Please run \`${settings.prefix}import\` to import existing invites!
					If you wish to disable these alerts, use \`${settings.prefix}invitealerts false\``)
				}
				return;
			}
			if (inviteFile?.uses! < invite.uses!) {
				foundInviter = await client.users.fetch(inviteFile?.userID!) || undefined;
				await inviteFile?.updateOne({
					uses: invite.uses
				})
				break;
			}
		}
		if(!foundInviter) {
			await userData.updateOne({
				guildID: member.guild.id,
				userID: member.user.id,
				invitedBy: "Unknown"
			})
			return;
		};
		
		let inviterUserData = await UserData.findOne({
			guildID: member.guild.id,
			userID: foundInviter.id
		})
		if(!inviterUserData) {
			inviterUserData = new UserData({
				guildID: member.guild.id,
				userID: foundInviter.id
			})
		}
		await userData.updateOne({
			guildID: member.guild.id,
			userID: member.user.id,
			invitedBy: foundInviter.id
		})

		const channel = await member.guild.channels.fetch(settings.inviteTracking?.inviteLogChannel!) as TextChannel
		if(channel) {
			channel.send(`<@${member.user.id}> has joined the server! Invited by: **<@${foundInviter.id}> (${inviterUserData.invites?.real || 0} Invites)**`)
		}


	});
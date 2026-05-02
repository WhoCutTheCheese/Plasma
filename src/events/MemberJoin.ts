import { Events, GuildMember, TextChannel, User } from "discord.js";
import { EventsBuilder } from "../structures/EventClass";
import UserData from "../schemas/UserData";
import { handleError } from "../utilities/HandleError";
import Invites from "../schemas/Invites";
import { client } from "../Index";
import { getSettings } from "../utilities/Settings";
import { getRealInvites } from "../utilities/User";

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
		let foundInviter: GuildMember | undefined;
		let inviterID: string | undefined;
		let deletable = true;

		for (const singleInvite of invites) {
			const invite = singleInvite[1];
			let inviteFile = await Invites.findOne({
				inviteCode: invite.code
			});

			if (!invite.deletable) deletable = false;

			if (!inviteFile) {
				inviteFile = new Invites({
					userID: invite.inviter?.id,
					inviteCode: invite.code,
					uses: invite.uses
				});
				inviteFile.save().catch((err: Error) => handleError(err, "MemberJoin.ts"));
			}

			if (inviteFile?.uses! < invite.uses!) {
				foundInviter = await member.guild.members.fetch(inviteFile?.userID!) || undefined;
				inviterID = inviteFile?.userID!;
				await inviteFile?.updateOne({
					uses: invite.uses
				});

			}
			break;
		}

		if (!foundInviter) {
			let invitedBy = "Unknown";
			let message = `<@${member.user.id}> has joined the server! Invited by: **Unknown**\n-# *Psst... This was probably due to an unknown invite, run \`${settings.prefix}import\`!*`;
			const externalInviter = await client.users.fetch(inviterID!).catch(() => null)
			if (externalInviter) {
				message = `<@${member.user.id}> has joined the server! Invited by: **${externalInviter.username}**`;
			}
			if (!deletable) {
				invitedBy = "Vanity URL";
				message = `<@${member.user.id}> has joined the server! Invited by: **Vanity URL**`;
			}
			await userData.updateOne({
				guildID: member.guild.id,
				userID: member.user.id,
				invitedBy: invitedBy
			});
			const channel = await member.guild.channels.fetch(settings.inviteTracking?.inviteLogChannel!) as TextChannel;
			if (channel) {
				channel.send({ content: message }).catch();
			}
			return
		}
		let inviterUserData = await UserData.findOne({
			guildID: member.guild.id,
			userID: foundInviter.id
		});
		if (!inviterUserData) {
			inviterUserData = new UserData({
				guildID: member.guild.id,
				userID: foundInviter.id
			});
			inviterUserData.save();
		}
		if (Date.now() - member.user.createdAt.getTime() < 1000 * 60 * 60 * 7) {

		}
		await userData.updateOne({
			guildID: member.guild.id,
			userID: member.user.id,
			invitedBy: foundInviter.id
		});

		const channel = await member.guild.channels.fetch(settings.inviteTracking?.inviteLogChannel!) as TextChannel;
		if (channel) {
			channel.send(`<@${member.user.id}> has joined the server! Invited by: **<@${foundInviter.id}> (${await getRealInvites(foundInviter.user, member.guild)} Invites)**`);
		}


	});
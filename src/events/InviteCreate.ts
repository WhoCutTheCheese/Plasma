import { Events, Invite } from "discord.js";
import { EventsBuilder } from "../structures/EventClass";
import Invites from "../schemas/Invites";
import { handleError } from "../utilities/HandleError";

export default new EventsBuilder()
	.setEvent(Events.InviteCreate)
	.setOnce(false)
	.setExecutor(async (invite: Invite) => {
		const newInvite = new Invites({
			userID: invite.inviter?.id,
			inviteCode: invite.code,
			uses: invite.uses
		});
		newInvite.save().catch((err: Error) => { handleError(err, "InviteCreate.ts"); });
	});
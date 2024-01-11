import { Events, Invite } from "discord.js";
import Invites from "../schemas/Invites";
import { EventsBuilder } from "../structures/EventClass";
import { handleError } from "../utilities/HandleError";

export default new EventsBuilder()
	.setEvent(Events.InviteDelete)
	.setOnce(false)
	.setExecutor(async (invite: Invite) => {
		await Invites.deleteOne({
			code: invite.code
		});
	});
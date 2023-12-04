import { ActivityType, Events } from "discord.js";
import { EventsBuilder } from "../structures/EventClass";
import { Log } from "../utilities/Logging";
import { client } from "../Index";

export default new EventsBuilder()
	.setEvent(Events.ClientReady)
	.setOnce(true)
	.setExecutor(() => {
		Log.info("Starting this super secret bot...");

		client.user?.setActivity({
			name: "👁 What am I doing here?",
			type: ActivityType.Custom,
		});
	});
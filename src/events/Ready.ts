import { ActivityType, Events } from "discord.js";
import { EventsBuilder } from "../structures/EventClass";
import { Log } from "../utilities/Logging";
import { client } from "../Index";
import mongoose from "mongoose";
import { configVars } from "../utilities/Config";

export default new EventsBuilder()
	.setEvent(Events.ClientReady)
	.setOnce(true)
	.setExecutor(() => {
		client.user?.setActivity({
			name: "👁 What am I doing here?",
			type: ActivityType.Custom,
		});

		mongoose.connect(configVars.mongoURI!);

		Log.info("This secret bot is online.");
	});
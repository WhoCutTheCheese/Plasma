import { ModuleBuilder } from "../structures/ModuleClass";
import path from "path";
import fs from "fs";
import { EventsBuilder } from "../structures/EventClass";
import { client } from "../Index";
import { ClientEvents, Events } from "discord.js";

export default new ModuleBuilder()
	.setModule(async () => {
		const eventPath = path.join(__dirname, "..", "events");
		const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));
		for (const file of eventFiles) {
			const filePath = path.join(eventPath, file);
			const event = (await import(filePath)).default as EventsBuilder;

			const eventName = event.event();
			if (event.once()) {
				client.once(event.event(), (...args: any[]) => { event.execute(...args); });
			}
		}

	});
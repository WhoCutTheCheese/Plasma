import path from "path";
import fs from "fs";
import { client } from "../Index";
import { EventsBuilder } from "../structures/EventClass";
import { EmbedBuilder } from "discord.js";

export async function load(): Promise<void> {
	const eventPath = path.join(__dirname, "..", "events");
	const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".ts"));
	for (const file of eventFiles) {
		const filePath = path.join(eventPath, file);
		const event = (await import(filePath)).default as EventsBuilder;

		if (event.once()) {
			client.once(event.event(), (...args: any[]) => { event.execute(...args); });
		} else {
			client.on(event.event(), (...args: any[]) => { event.execute(...args); });
		}
	}
}

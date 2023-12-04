import { Client } from "discord.js";
import { CommandBuilder } from "../structures/CommandClass";
import { Log } from "./Logging";

export async function loadCommand(client: Client, commandpath: string): Promise<boolean> {
	try {
		const option: CommandBuilder = (await import(commandpath)).default as CommandBuilder;

		delete require.cache[require.resolve(commandpath)];

		const name = option.name();
		const aliases = option.aliases();

		client.legacyCommands.set(name.toLowerCase(), option);
		client.legacyCommandFilepath.set(name.toLowerCase(), commandpath);

		if (aliases) {
			for (const alias of aliases) {
				client.legacyCommandAlias.set(alias.toLowerCase(), name.toLowerCase());
				Log.info(`[Alias]  | Command Alias | ${alias}`);
			}
		}

		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
}
import { Collection } from "discord.js";
import { CommandBuilder } from "../structures/CommandClass";
import { client } from "../Index";
import fs from "fs";
import path from "path";
import { Log } from "../utilities/Logging";
import { loadCommand } from "../utilities/LoadCommand";

declare module "discord.js" {
	export interface Client {
		legacyCommands: Collection<string, CommandBuilder>;
		legacyCommandAlias: Collection<string, string>,
		legacyCommandFilepath: Collection<string, string>,
	}
}
export async function load() {
	client.legacyCommands = new Collection();
	client.legacyCommandAlias = new Collection();
	client.legacyCommandFilepath = new Collection();

	const readCommands = async (dir: string) => {
		const files = fs.readdirSync(path.join(__dirname, dir));
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file));
			if (stat.isDirectory()) {
				readCommands(path.join(dir, file));
			} else {
				Log.info(`[Loading] | Legacy Command | ${file}`);
				let loaded = await loadCommand(client, path.join(__dirname, dir, file));
				if (loaded) Log.info(`[Loaded]  | Legacy Command | ${file}`);
				else Log.error(`There was an error loading ${file}`);
			}
		}
	};

	readCommands(`../commands`);
}
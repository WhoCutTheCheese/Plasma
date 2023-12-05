import { load as loadEvents } from "./modules/EventHandler";
import { load as loadMongoose } from "./modules/Mongoose";
import { load as loadCommands } from "./modules/CommandHandler";
import { handleError } from "./utilities/HandleError";
import { Log } from "./utilities/Logging";
import path from "path";

export async function initializeModules(): Promise<void> {
	loadEvents().then(() => { Log.info("Events loaded."); }).catch((err: Error) => { handleError(err, path.basename(__filename)); });
	loadCommands().then(() => { Log.info("Events loaded."); }).catch((err: Error) => { handleError(err, path.basename(__filename)); });
	loadMongoose().catch((err: Error) => { handleError(err, path.basename(__filename)); });
}
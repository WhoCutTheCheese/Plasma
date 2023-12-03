import path from "path";
import fs from "fs";
import { ModuleBuilder } from "./structures/ModuleClass";
import { Log } from "./utilities/Logging";
import { handleError } from "./utilities/HandleError";

export async function initializeModules(): Promise<void> {

	const modulesPath = path.join(__dirname, "modules");
	const moduleFiles = fs.readdirSync(modulesPath).filter(file => file.endsWith(".js"));
	for (const file of moduleFiles) {
		const module = (await import(`${modulesPath}/${file}`)).default as ModuleBuilder;

		await module.execute().catch((err: Error) => {
			handleError(err, path.basename(__filename));
		});

	}
}
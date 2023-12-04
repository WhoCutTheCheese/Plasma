import configImport from "../Config.json";
import dotENV from "dotenv";
dotENV.config();

interface ConfigType {
	supportServerID: string;
	passedEmoji: string;
	deniedEmoji: string;
	warnedEmoji: string;
	loadingEmoji: string;
	bulletPoint: string;
	arrowRight: string;
	devs: string[];
	mongoURI?: string;
	token?: string;
}

export const configVars: ConfigType = configImport;

if (process.env.MONGO_URI && process.env.TOKEN) {
	configVars.mongoURI = process.env.MONGO_URI;
	configVars.token = process.env.TOKEN;
} else {
	throw new Error("No Mongo URI or token set. Unable to proceed.");
}
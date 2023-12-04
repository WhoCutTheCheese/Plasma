import mongoose from "mongoose";
import { configVars } from "../utilities/Config";

export async function load(): Promise<void> {
	await mongoose.connect(configVars.mongoURI!);
}

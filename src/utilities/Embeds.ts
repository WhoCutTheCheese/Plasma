import { EmbedBuilder } from "discord.js";
import { configVars } from "./Config";

export function errorEmbed(text: string, persists?: boolean): EmbedBuilder {
	if (persists) {
		text = text + `\n${configVars.warnedEmoji} If this error persists, please join our support server.`;
	}
	const errEmbed = new EmbedBuilder()
		.setDescription(`${configVars.deniedEmoji} ${text}`)
		.setColor("Red");
	return errEmbed;
}
import { Channel, ChannelType, EmbedBuilder, Interaction, Message, TextChannel } from "discord.js";
import { client } from "../Index";
import { configVars } from "./Config";
import { Log } from "./Logging";

/**
 * This function handles all errors within the bot.
 * @param err An error type
 * @param file The file name, a string.
 * @param interaction An interaction type
 * @param message A message type
 * @param editReply Whether or not the function should try to edit an interaction
 * @param updateInteraction Whether or not the function should try to update an interaction
 * @returns {void}
 */
export async function handleError(err: Error, file: string, interaction?: Interaction, message?: Message, editReply?: boolean, updateInteraction?: boolean): Promise<void> {
	const supportServer = client.guilds.cache.get(configVars.supportServerID);
	if (!supportServer) return;
	const errorChannel = supportServer.channels.cache.find((c: Channel) => {
		if (c.type === ChannelType.GuildText) {
			//@ts-ignore
			if (c.name === "bot-errors") {
				return c;
			}
		}
	}) as TextChannel;
	if (!errorChannel) return;

	const errorWebhook = await errorChannel.createWebhook({
		name: "Errors",
		avatar: "https://cdn.discordapp.com/attachments/1161823765882216579/1180768067878408243/Z.png?ex=657e9ef4&is=656c29f4&hm=bc56d50aaf5b89bc56018e02ba1485fbf3f7358d8f1268c8f350ae7d6acff655&"
	});
	let description = `**File:** ${file}`;

	if (message || interaction) {
		description = description + `\n**Guild:** ${(interaction || message)?.guild?.name}`;
	}

	const errorEmbed = new EmbedBuilder()
		.setAuthor({ name: `An Error Occurred`, iconURL: (interaction || message)?.guild?.iconURL() || undefined })
		.setColor("Red")
		.setDescription(description)
		.addFields(
			{ name: "Error", value: `\`\`\`${err.message}\`\`\`` }
		)
		.setTimestamp()
		.setFooter({ text: "Error caught at", iconURL: supportServer.iconURL() || undefined });
	errorWebhook.send({ embeds: [errorEmbed] });
	Log.error(`An error occurred in ${file}\n\n${err}`);

	await errorWebhook.delete();
}
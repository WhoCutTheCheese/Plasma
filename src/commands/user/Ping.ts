import { CommandBuilder } from "../../structures/CommandClass";
import { configVars } from "../../utilities/Config";
import GuildSettings from "../../schemas/GuildSettings";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import { formatUptime, getMaxRAM, getUsedRAM } from "../../utilities/ClientInfoUtilities";

export default new CommandBuilder()
	.setName("ping")
	.setAliases(["latency"])
	.setDescription("Displays the bot's latency.")
	.setCooldown(3)
	.setMaxArgs(0)
	.setMinArgs(0)
	.setExecutor(async (client, message, args) => {
		const pingMessage = await message.channel.send({ content: `${configVars.loadingEmoji} Calculating...` });
		const ping = pingMessage.createdTimestamp - message.createdTimestamp;
		const uptime = formatUptime(client.readyAt);

		let pingMoji = "<:lowping:1181657537028829304>";
		const averagePing = (ping + client.ws.ping) / 2;

		if (averagePing > 250) {
			pingMoji = "<:highping:1181657499162648727>";
		} else if (averagePing > 150) {
			pingMoji = "<:mediumping:1181657516845838376>";
		}

		let settings = await GuildSettings.findOne({
			guildID: message.guild!.id,
		});
		if (!settings) return;

		const pingEmbed = new EmbedBuilder()
			.setDescription(`${configVars.arrowRight} **Bot Latency:** ${ping}ms\n${configVars.arrowRight} **API Latency:** ${client.ws.ping}\n${configVars.arrowRight} **Uptime:** ${uptime}\n${configVars.arrowRight} **Ram Usage:** ${getUsedRAM()}/${getMaxRAM()}`)
			.setColor(settings.embedColor as ColorResolvable || "Aqua");
		pingMessage.edit({ content: `${pingMoji} __Bot Statistics__`, embeds: [pingEmbed] });

	});
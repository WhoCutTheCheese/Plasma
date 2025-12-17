import { CommandBuilder } from "../../structures/CommandClass";
import { configVars } from "../../utilities/Config";
import { ChannelType, ColorResolvable, EmbedBuilder } from "discord.js";
import { formatUptime, getMaxRAM, getUsedRAM } from "../../utilities/ClientInfoUtilities";
import { errorEmbed } from "../../utilities/Embeds";

export default new CommandBuilder()
	.setName("ping")
	.setAliases(["latency"])
	.setDescription("Displays the bot's latency.")
	.setCooldown(3)
	.setMaxArgs(0)
	.setMinArgs(0)
	.setExecutor(async (client, message, args, settings) => {
		if (!message.guild || message.channel.type !== ChannelType.GuildText) {
			message.reply({ embeds: [errorEmbed("Unable to find valid guild.", true)] });
			return;
		}
		const pingMessage = await message.channel.send({ content: `${configVars.loadingEmoji} Calculating...` });
		const ping = pingMessage.createdTimestamp - message.createdTimestamp;
		const uptime = formatUptime(client.readyAt);

		let pingMoji = "<:lowping:1448536363119935620>";
		const averagePing = (ping + client.ws.ping) / 2;

		if (averagePing > 250) {
			pingMoji = "<:highping:1448536364487282729>";
		} else if (averagePing > 150) {
			pingMoji = "<:medping:1448536365850558665>";
		}

		const pingEmbed = new EmbedBuilder()
			.setDescription(`${configVars.arrowRight} **Bot Latency:** ${ping}ms\n${configVars.arrowRight} **API Latency:** ${client.ws.ping}\n${configVars.arrowRight} **Uptime:** ${uptime}\n${configVars.arrowRight} **Ram Usage:** ${getUsedRAM()}/${getMaxRAM()}`)
			.setColor(settings.embedColor as ColorResolvable || "Aqua");
		pingMessage.edit({ content: `${pingMoji} __Bot Statistics__`, embeds: [pingEmbed] });

	});
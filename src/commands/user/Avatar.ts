import { CommandBuilder } from "../../structures/CommandClass";
import { configVars } from "../../utilities/Config";
import GuildSettings from "../../schemas/GuildSettings";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import { formatUptime, getMaxRAM, getUsedRAM } from "../../utilities/ClientInfoUtilities";
import { getSettings } from "../../utilities/Settings";

export default new CommandBuilder()
	.setName("avatar")
	.setAliases(["av", "pfp", "icon"])
	.setDescription("Display a larger version of one's avatar.")
	.setCooldown(3)
	.setExpectedArgs("(@User/ID)")
	.setMaxArgs(1)
	.setMinArgs(0)
	.setExecutor(async (client, message, args) => {
		if (!message.guild) {
			message.channel.send({ content: "Unable to find a valid guild." });
			return;
		} const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => { return null; }) || message.author;
		const msg = await message.channel.send({ content: `${configVars.loadingEmoji} Fetching that avatar...` });

		let settings = await getSettings(message.guild);
		if (!settings) return;

		let avatarEmbed = new EmbedBuilder()
			.setAuthor({ name: `${user.tag}'s Avatar`, iconURL: user.displayAvatarURL() || undefined })
			.setColor(settings.embedColor as ColorResolvable || "Aqua")
			.setImage(user.displayAvatarURL({ size: 512 }) || null)
			.setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() || undefined });
		await msg.edit({ content: "", embeds: [avatarEmbed] });
	});
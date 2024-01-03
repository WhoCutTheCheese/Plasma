import { CommandBuilder } from "../../structures/CommandClass";
import { configVars } from "../../utilities/Config";
import GuildSettings from "../../schemas/GuildSettings";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import { formatUptime, getMaxRAM, getUsedRAM } from "../../utilities/ClientInfoUtilities";

export default new CommandBuilder()
	.setName("avatar")
	.setAliases(["av", "pfp", "icon"])
	.setDescription("Display a larger version of one's avatar.")
	.setCooldown(3)
	.setExpectedArgs("(@User/ID)")
	.setMaxArgs(1)
	.setMinArgs(0)
	.setExecutor(async (client, message, args) => {
		const user = message.mentions.users.first() || await client.users.fetch(args[0]) || message.author;
		const msg = await message.channel.send({ content: `${configVars.loadingEmoji} Fetching that avatar...` });

		let settings = await GuildSettings.findOne({
			guildID: message.guild!.id,
		});
		if (!settings) return;

		let avatarEmbed = new EmbedBuilder()
			.setAuthor({ name: `${user.tag}'s Avatar`, iconURL: user.displayAvatarURL() || undefined })
			.setColor(settings.embedColor as ColorResolvable || "Aqua")
			.setImage(user.displayAvatarURL({ size: 512 }) || null)
			.setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() || undefined });
		await msg.edit({ content: "", embeds: [avatarEmbed] });
	});
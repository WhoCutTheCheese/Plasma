import { CommandBuilder } from "../../structures/CommandClass";
import { configVars } from "../../utilities/Config";
import { ChannelType, ColorResolvable, EmbedBuilder } from "discord.js";
import { errorEmbed } from "../../utilities/Embeds";

export default new CommandBuilder()
	.setName("avatar")
	.setAliases(["av", "pfp", "icon"])
	.setDescription("Display a larger version of one's avatar.")
	.setCooldown(3)
	.setExpectedArgs("(@User/ID)")
	.setMaxArgs(1)
	.setMinArgs(0)
	.setExecutor(async (client, message, args, settings) => {
		if (!message.guild || message.channel.type !== ChannelType.GuildText) {
			message.reply({ embeds: [errorEmbed("Unable to find valid guild.", true)] });
			return;
		}
		const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => { return null; }) || message.author;
		const msg = await message.channel.send({ content: `${configVars.loadingEmoji} Fetching that avatar...` });

		let avatarEmbed = new EmbedBuilder()
			.setAuthor({ name: `${user.tag}'s Avatar`, iconURL: user.displayAvatarURL() || undefined })
			.setColor(settings.embedColor as ColorResolvable || "Aqua")
			.setImage(user.displayAvatarURL({ size: 512 }) || null)
			.setFooter({ text: `Requested by ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() || undefined });
		await msg.edit({ content: "", embeds: [avatarEmbed] });
	});
import { CommandBuilder } from "../../structures/CommandClass";
import { configVars } from "../../utilities/Config";
import { ChannelType, ColorResolvable, EmbedBuilder, PermissionsBitField } from "discord.js";
import { errorEmbed } from "../../utilities/Embeds";
import Invites from "../../schemas/Invites";
import { handleError } from "../../utilities/HandleError";

export default new CommandBuilder()
	.setName("import")
	.setDescription("Import pre-existing invites.")
	.setBasePermission([PermissionsBitField.Flags.ManageGuild])
	.setCooldown(5)
	.setMaxArgs(0)
	.setMinArgs(0)
	.setExecutor(async (client, message) => {
		if (!message.guild || message.channel.type !== ChannelType.GuildText) {
			message.reply({ embeds: [errorEmbed("Unable to find valid guild.", true)] });
			return;
		}
		const msg = await message.channel.send({ content: `${configVars.loadingEmoji} Importing invites...` });
		let invites = await message.guild.invites.fetch();
		let fixedInvites: string[] = [];

		for (let invite of invites) {
			let inviteData = await Invites.findOne({
				inviteCode: invite[1].code
			});
			if (!inviteData) {
				const newInvite = new Invites({
					userID: message.guild.id,
					inviteCode: invite[1].code,
					uses: invite[1].uses || 0,
				});
				await newInvite.save().catch((err: Error) => handleError(err, "Import.ts"));
				fixedInvites.push(invite[1].code);
			}
		}
		let inviteText = `\`\`\`${fixedInvites.join(",\n").slice(0, 10)} plus ${fixedInvites.length - 10} more...\`\`\``;
		if (fixedInvites.length < 10) {
			inviteText = `\`\`\`${fixedInvites.join(",\n")}\`\`\``;
		}
		if (fixedInvites.length === 0) inviteText = "No new invites were found to import.";
		const embed = new EmbedBuilder()
			.setDescription(`${configVars.arrowRight} **Imported invites:** \n${inviteText}`)
			.setColor("Random");
		await msg.edit({ content: `${configVars.passedEmoji} Import complete!`, embeds: [embed] });

	});
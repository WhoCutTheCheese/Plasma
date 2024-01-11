import { CommandBuilder } from "../../structures/CommandClass";
import { configVars } from "../../utilities/Config";
import { EmbedBuilder } from "discord.js";
import { loadCommand } from "../../utilities/LoadCommand";
import { Log } from "../../utilities/Logging";
import { getSettings } from "../../utilities/Settings";
import { errorEmbed } from "../../utilities/Embeds";

export default new CommandBuilder()
	.setName("reload")
	.setAliases(["rl"])
	.setDescription("Reload a command within the bot.")
	.setCooldown(3)
	.setMaxArgs(1)
	.setMinArgs(1)
	.setDevOnly(true)
	.setExpectedArgs("[Command/Alias]")
	.setHidden(true)
	.setExecutor(async (client, message, args) => {
		if (!message.guild) {
			message.channel.send({ embeds: [errorEmbed("Unable to find valid guild.", true)] });
			return;
		}
		let settings = await getSettings(message.guild);
		if (!settings) return;

		if (args.length === 0) {
			message.channel.send({ embeds: [errorEmbed(`Invalid syntax! Use \`${settings.prefix} reload [Command/Alias]\``)] });
		}

		const commandName = args[0].trim().toLowerCase();
		let commandpath = client.legacyCommandFilepath.get(commandName)! || client.legacyCommandFilepath.get(client.legacyCommandAlias.get(commandName)!)!;
		if (!commandpath) {
			message.channel.send({ embeds: [errorEmbed("Unknown command!")] });
		}

		let command = client.legacyCommands.get(commandName)! || client.legacyCommands.get(client.legacyCommandAlias.get(commandName)!)!;

		Log.info(`[Loading] | Legacy Command | ${command.command_data().name}`);

		let loaded = await loadCommand(client, commandpath);

		if (loaded) {
			Log.info(`[Loaded]  | Legacy Command | ${command.command_data().name}`);
			const invalidSyntax = new EmbedBuilder()
				.setDescription(`${configVars.passedEmoji} Successfully reloaded \`${command.command_data().name}\``)
				.setColor("Green");
			message.channel.send({ embeds: [invalidSyntax] });
		} else {
			Log.error(`There was an error loading ${command.command_data().name}`);
			const invalidSyntax = new EmbedBuilder()
				.setDescription(`${configVars.deniedEmoji} Uh oh! An error occurred. If this persists please contact a developer.`)
				.setColor("Red");
			message.channel.send({ embeds: [invalidSyntax] });
			return;

		}
	});
import { Collection, ColorResolvable, EmbedBuilder, Events, Message, PermissionsBitField, TextChannel } from "discord.js";
import { CommandBuilder } from "../structures/CommandClass";
import { configVars } from "../utilities/Config";
import { client } from "../Index";
import { EventsBuilder } from "../structures/EventClass";
import { Log } from "../utilities/Logging";
import GuildSettings from "../schemas/GuildSettings";
import Maintenance from "../schemas/Maintenance";

declare module "discord.js" {
	export interface Client {
		legacyCommands: Collection<string, CommandBuilder>;
		legacyCommandAlias: Collection<string, string>,
		legacyCommandFilepath: Collection<string, string>,
	}
}

const cooldowns: Map<string, Map<string, number>> = new Map();

export default new EventsBuilder()
	.setEvent(Events.MessageCreate)
	.setOnce(false)
	.setExecutor(async (message: Message) => {
		try {
			if (!message.inGuild) return;
			if (!message.guild?.members.me?.permissions.has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks])) return;
			if (!(message.channel as TextChannel).permissionsFor(message.guild?.members.me!)?.has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks])) return;

			let settings = await GuildSettings.findOne({
				guildID: message.guild.id,
			});
			if (!settings) {
				settings = new GuildSettings({
					guildID: message.guild.id
				});
				settings.save();
			}

			const args = message.content.split(/[ ]+/);
			const name = args.shift()!.toLowerCase();

			const prefix = settings.prefix || ".";


			if (message.content.startsWith(`<@1180763823158861946>`)) {
				const myPrefixIsEmbed = new EmbedBuilder()
					.setDescription(`My current prefix is \`${prefix}\`!`)
					.setColor(settings.embedColor as ColorResolvable || "Aqua");
				message.reply({ embeds: [myPrefixIsEmbed] });
				return;
			}

			if (!name.startsWith(prefix)) return;

			const maintenance = await Maintenance.findOne({
				clientID: client.user?.id
			});
			if (maintenance && maintenance.maintenance == true && !configVars.devs.includes(message.author.id)) {
				const inMaintenanceEmbed = new EmbedBuilder()
					.setDescription(`I am currently in maintenance mode!\n**Reason:** ${maintenance.reason}`)
					.setColor(settings.embedColor as ColorResolvable || "Aqua");
				message.channel.send({ embeds: [inMaintenanceEmbed] });
				return;
			}

			const commandName = name.replace(prefix, '');
			let command: CommandBuilder = client.legacyCommands.get(commandName)! || client.legacyCommands.get(client.legacyCommandAlias.get(commandName)!)!;
			if (!command) return;



		} catch {
			Log.error("An error occurred in the CommandBase.js file.");
		}
	});
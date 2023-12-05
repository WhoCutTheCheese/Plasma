import { Collection, ColorResolvable, EmbedBuilder, Events, Message, PermissionsBitField, TextChannel } from "discord.js";
import { CommandBuilder } from "../structures/CommandClass";
import { configVars } from "../utilities/Config";
import { client } from "../Index";
import { EventsBuilder } from "../structures/EventClass";
import { Log } from "../utilities/Logging";
import GuildSettings from "../schemas/GuildSettings";
import Maintenance from "../schemas/Maintenance";
import { handleError } from "../utilities/HandleError";
import path from "path";

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
			let command: CommandBuilder = client.legacyCommands.get(commandName) || client.legacyCommands.get(client.legacyCommandAlias.get(commandName)!)!;
			if (!command) return;

			let {
				minimum_args,
				maximum_args,
				expected_args,
				cooldown,
				base_permission,
				bot_permission,
				dev_only
			} = command.command_data();

			if (dev_only == true) {
				if (!configVars.devs.includes(message.author.id)) {
					const noPermsEmbed = new EmbedBuilder()
						.setDescription(`${configVars.deniedEmoji} You do not have permission to use this command.`)
						.setColor("Red");
					message.channel.send({ embeds: [noPermsEmbed] });
					return;
				}
			}

			if ((bot_permission as Array<PermissionsBitField>).length > 0) {

				let missingPerm: Boolean = false;

				for (let perm of bot_permission) {

					if (!message.guild?.members?.me?.permissions.has(perm, true)) {
						missingPerm = true;
					}

					if (!(message.channel as TextChannel).permissionsFor(message.guild?.members.me!)?.has(perm, true)) {
						missingPerm = true;
					};
				}

				if (missingPerm) {
					const noPermsEmbed = new EmbedBuilder()
						.setDescription(`${configVars.deniedEmoji} I do not have permission to execute this command.`)
						.setColor("Red");
					message.channel.send({ embeds: [noPermsEmbed] });
					return;
				}
			}

			if ((base_permission as Array<PermissionsBitField>).length > 0) {

				let missingPerm: Boolean = false;

				for (let perm of base_permission) {

					if (!message.member?.permissions.has(perm, true)) {
						missingPerm = true;
					}

					if (!(message.channel as TextChannel).permissionsFor(message.member!)?.has(perm, true)) {
						missingPerm = true;
					};
				}

				if (missingPerm) {
					const noPermsEmbed = new EmbedBuilder()
						.setDescription(`${configVars.deniedEmoji} You do not have permission to use this command.`)
						.setColor("Red");
					message.channel.send({ embeds: [noPermsEmbed] });
					return;
				}

			}

			if (minimum_args && maximum_args && args.length < minimum_args || maximum_args && (maximum_args !== null && args.length > maximum_args)) {
				const invalidSyntax = new EmbedBuilder()
					.setDescription(`${configVars.deniedEmoji} Invalid syntax! Use \`${prefix}${name} ${expected_args}\``)
					.setColor("Red");
				message.channel.send({ embeds: [invalidSyntax] });
				return;
			}

			if (cooldown && cooldown > 0) {
				let userId = message.author.id;

				if (!cooldowns.has(commandName)) {
					cooldowns.set(commandName, new Map());
				}

				const now = Math.floor(Date.now() / 1000);
				const timestamps = cooldowns.get(commandName)!;
				if (timestamps.get(userId)) {
					let remainingTime = timestamps.get(userId)! + cooldown - now;

					if (remainingTime > 0) {
						const onCooldownEmbed = new EmbedBuilder()
							.setDescription(`${configVars.deniedEmoji} Slow down! You are on cooldown for ${remainingTime} second(s).`)
							.setColor("Red");
						message.channel.send({ embeds: [onCooldownEmbed] });
						return;
					} else {
						timestamps!.set(userId, now);
					}
				} else {
					timestamps!.set(userId, now);
				}
			}

			command.execute(client, message, args);


		} catch (err) {
			handleError(err as Error, path.basename(__filename));
		}
	});
import { ChannelType, EmbedBuilder, GuildMember } from "discord.js";
import { CommandBuilder } from "../../structures/CommandClass";
import { configVars } from "../../utilities/Config";
import { errorEmbed } from "../../utilities/Embeds";

export default new CommandBuilder()
	.setName("whois")
	.setAliases(["userinfo", "user", "memberinfo", "member"])
	.setDescription("Displays information about a given member.")
	.setCooldown(3)
	.setMaxArgs(1)
	.setMinArgs(0)
	.setExecutor(async (client, message, args) => {
		if (!message.guild || message.channel.type !== ChannelType.GuildText) {
			message.reply({ embeds: [errorEmbed("Unable to find valid guild.", true)] });
			return;
		}
		const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => { return null; }) || message.author;
		const msg = await message.channel.send({ content: `${configVars.loadingEmoji} Fetching user information...` });
		let member: GuildMember | undefined;

		let nickname;
		let joinedAt;
		let highestRole;
		if (message.guild.members.cache.has(user.id)) {
			member = message.guild.members.cache.get(user.id)!;
			nickname = member.nickname || member.user.displayName;
			joinedAt = `<t:${Math.floor(member.joinedAt?.getTime()! / 1000)}:D> (<t:${Math.floor(member.joinedAt?.getTime()! / 1000)}:R>)`;
			highestRole = `<@&${member.roles.highest.id}> (${member.roles.highest.position})`;
		} else {
			nickname = user.globalName;
			joinedAt = "Not Cached/Not in Server";
			highestRole = "Not Cached/ Not in Server";
		}
		const fetchedFlags = user.flags?.toArray() || [];

		let badges: string[] = [];
		for (const badge of fetchedFlags) {
			if (fetchedFlags.length == 0) {
				badges.push("None...");
			}
			if (badge == "Staff") badges.push(" <:staff:996115760579620974>");
			if (badge == "Partner") badges.push(" <:PartneredServerOwner:1044190723198697493>");
			if (badge == "Hypesquad") badges.push(" <:HypesquadEvents:1044190722292711464>");
			if (badge == "BugHunterLevel1") badges.push(" <:BugHunterLv1:1044190721197998100>");
			if (badge == "BugHunterLevel2") badges.push(" <:BugHunderLv2:1044190719943913502>");
			if (badge == "HypeSquadOnlineHouse1") badges.push(" <:Bravery:1044190718719164476>");
			if (badge == "HypeSquadOnlineHouse2") badges.push(" <:Brilliance:1044190717876117545>");
			if (badge == "HypeSquadOnlineHouse3") badges.push(" <:Balance:1044190716735275008>");
			if (badge == "PremiumEarlySupporter") badges.push(" <:EarlySupporter:1044190715195957258>");
			if (badge == "VerifiedBot") badges.push(" <:VerifiedBot:1044190727174897726>");
			if (badge == "VerifiedDeveloper") badges.push(" <:EarlyVerifiedBotDeveloper:1044190725237129216>");
			if (badge == "CertifiedModerator") badges.push(" <:CertifiedModerator:1044190723798478870>");
		}
		if (badges.length <= 0) {
			badges.push("None...");
		}

		let userInfoEmbed = new EmbedBuilder()
			.setAuthor({ name: `Who is ${user.tag}`, iconURL: user.displayAvatarURL() || undefined })
			.setThumbnail(user.displayAvatarURL() || null)
			.setColor("Random")
			.addFields(
				{ name: "Name:", value: `${user.tag}`, inline: true },
				{ name: "Badges:", value: `${badges}`, inline: true },
				{
					name: "General Information:", value: `**Mention:** <@${user.id}>
					**ID:** ${user.id}
					**Is Bot:** ${user.bot}
					**Highest Role:** ${highestRole}
					**Avatar:** [View Here](${user.displayAvatarURL({ size: 512 })})
					**Display Name:** ${nickname}`, inline: false
				},
				{ name: "📆 Created:", value: `<t:${Math.floor(user.createdAt?.getTime()! / 1000)}:D> (<t:${Math.floor(user.createdAt?.getTime()! / 1000)}:R>)`, inline: true },
				{ name: "📆 Joined:", value: `${joinedAt}`, inline: true }
			)
			.setFooter({ text: `Requested by ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() || undefined });
		msg.edit({ embeds: [userInfoEmbed], content: "" });

	});
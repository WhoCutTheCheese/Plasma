import { Client, Message, MessageCreateOptions, PermissionsBitField } from "discord.js";
import { promisify } from "node:util";

type Executor = (client: Client, message: Message, args: string[]) => Promise<void> | void;

/** The results of checking user permissions. */
interface PermissionsResult extends MessageCreateOptions {
	success: boolean;
}

interface CommandData {
	name: string;
	aliases: string[];
	description: string;
	minimum_args: number | undefined;
	maximum_args: number | undefined;
	expected_args: string | undefined;
	cooldown: number | undefined;
	base_permission: PermissionsBitField[];
	bot_permission: PermissionsBitField[];
	dev_only: boolean | undefined;
	hidden: boolean | undefined;
	executor: Executor;
}

export class CommandBuilder {
	#name: string;
	#aliases: string[];
	#description: string;
	#minimum_args: number | undefined;
	#maximum_args: number | undefined;
	#expected_args: string | undefined;
	#cooldown: number | undefined;
	#base_permission: PermissionsBitField[];
	#bot_permission: PermissionsBitField[];
	#dev_only: boolean | undefined;
	#hidden: boolean | undefined;
	#executor: Executor;

	constructor() {
		this.#executor = function () {
			throw new Error('Command executor unimplemented (call setExecutor before exporting commands)');
		};
		this.#description = "No descrition set... PLEASE YELL AT A DEV.";
		this.#aliases = [];
		this.#name = "None set, idiot";
		this.#base_permission = [];
		this.#bot_permission = [];
	}

	/**
	 * Sets the {@link #name}. The command name.
	 * @param name Input a string.
	 * @returns {CommandBuilder}
	*/
	setName(name: string): CommandBuilder {
		this.#name = name;
		return this;
	}

	setAliases(aliases: string[]): CommandBuilder {
		this.#aliases = aliases;
		return this;
	}

	setDescription(desc: string): CommandBuilder {
		this.#description = desc;
		return this;
	}

	setMinArgs(min: number): CommandBuilder {
		this.#minimum_args = min;
		return this;
	}

	setMaxArgs(max: number): CommandBuilder {
		this.#maximum_args = max;
		return this;
	}

	setExpectedArgs(expectedArgs: string): CommandBuilder {
		this.#expected_args = expectedArgs;
		return this;
	}

	setCooldown(cooldown: number): CommandBuilder {
		this.#cooldown = cooldown;
		return this;
	}

	setBasePermission(perm: PermissionsBitField[]): CommandBuilder {
		this.#base_permission = perm;
		return this;
	}

	setBotPermission(perm: PermissionsBitField[]): CommandBuilder {
		this.#bot_permission = perm;
		return this;
	}

	setDevOnly(devOnly: boolean): CommandBuilder {
		this.#dev_only = devOnly;
		return this;
	}

	setHidden(hidden: boolean): CommandBuilder {
		this.#hidden = hidden;
		return this;
	}

	/**
	 * Sets the {@link executor}.
	 * @param executor The actual executor.
	 * @returns {CommandBuilder}
	*/
	setExecutor(executor: Executor): CommandBuilder {
		this.#executor = executor;
		return this;
	}

	command_data(): CommandData {
		return {
			name: this.#name,
			aliases: this.#aliases,
			description: this.#description,
			minimum_args: this.#minimum_args,
			maximum_args: this.#maximum_args,
			expected_args: this.#expected_args,
			cooldown: this.#cooldown,
			base_permission: this.#base_permission,
			bot_permission: this.#bot_permission,
			dev_only: this.#dev_only,
			hidden: this.#hidden,
			executor: this.#executor,
		};
	}

	/** Runs the current {@link Executor}. */
	execute(client: Client, message: Message, args: string[]): Promise<unknown> {
		return promisify(this.#executor)(client, message, args);
	}
}
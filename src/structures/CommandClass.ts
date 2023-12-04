import { Client, Message, MessageCreateOptions, PermissionsBitField } from "discord.js";
import { promisify } from "node:util";

type Executor = (client: Client, message: Message, args: string[]) => Promise<void> | void;

/** The results of checking user permissions. */
interface PermissionsResult extends MessageCreateOptions {
	success: boolean;
}

export class CommandBuilder {
	#name: string;
	#aliases: string[];
	#description: string;
	#minimum_args: number | undefined;
	#maximum_args: number | undefined;
	#expected_args: string | undefined;
	#cooldown: number | undefined;
	#base_permission: PermissionsBitField | undefined;
	#dev_only: boolean | undefined;
	#executor: Executor;

	constructor() {
		this.#executor = function () {
			throw new Error('Command executor unimplemented (call setExecutor before exporting commands)');
		};
		this.#description = "No descrition set... PLEASE YELL AT A DEV.";
		this.#aliases = [];
		this.#name = "None set, idiot";
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

	setBasePermission(perm: PermissionsBitField): CommandBuilder {
		this.#base_permission = perm;
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

	name(): string {
		return this.#name;
	}

	aliases(): string[] {
		return this.#aliases;
	}

	description(): string {
		return this.#description;
	}

	min_args(): number | undefined {
		return this.#minimum_args;
	}

	max_args(): number | undefined {
		return this.#maximum_args;
	}

	expected_args(): string | undefined {
		return this.#expected_args;
	}

	cooldown(): number | undefined {
		return this.#cooldown;
	}

	base_perm(): PermissionsBitField | undefined {
		return this.#base_permission;
	}

	/** Runs the current {@link Executor}. */
	execute(client: Client, message: Message, args: string[]): Promise<unknown> {
		return promisify(this.#executor)(client, message, args);
	}
}
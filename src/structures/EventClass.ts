import { Events } from 'discord.js';
import { promisify } from 'node:util';

type Executor = (...args: any[]) => Promise<void> | void;
export class EventsBuilder {
	#executor: Executor;
	#event: Events;
	#once: boolean;

	constructor() {
		this.#executor = function () {
			throw new Error('Event executor unimplemented (call setModule before exporting commands)');
		};
		this.#event = Events.Error;
		this.#once = false;
	}

	setEvent(event: Events): EventsBuilder {
		this.#event = event;
		return this;
	}

	setOnce(once: boolean): EventsBuilder {
		this.#once = once;
		return this;
	}

	setExecutor(executor: Executor): EventsBuilder {
		this.#executor = executor;
		return this;
	}

	execute(): Promise<unknown> {
		return promisify(this.#executor)();
	}

	event(): Events {
		return this.#event;
	}
}
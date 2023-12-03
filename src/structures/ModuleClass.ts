import { promisify } from 'node:util';

type Executor = () => Promise<void> | void;
export class ModuleBuilder {
	#executor: Executor;

	constructor() {
		this.#executor = function () {
			throw new Error('Module executor unimplemented (call setModule before exporting commands)');
		};
	}


	setModule(executor: Executor): ModuleBuilder {
		this.#executor = executor;
		return this;
	}

	execute(): Promise<unknown> {
		return promisify(this.#executor)();
	}
}
import { ModuleBuilder } from "../structures/ModuleClass";

export default new ModuleBuilder()
	.setModule(() => {
		console.log("This module is functioning.");
	});
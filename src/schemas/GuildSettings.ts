import { Schema, model } from "mongoose";

const schema = new Schema({
	guildID: {
		type: String,
		required: true
	},
	prefix: String,
	premium: Boolean,
	embedColor: String,
});

export default model("settings", schema);
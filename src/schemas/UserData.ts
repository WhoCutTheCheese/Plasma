import { Schema, model } from "mongoose";

const schema = new Schema({
	clientID: {
		type: String,
		required: true
	},
	guildID: {
		type: String,
		required: true
	},
	invitedBy: String,
	messages: Number,
	level: Number,
	exp: Number,
	expCap: Number,
	expMulti: Number,
	invites: {
		real: Number,
		fake: Number,
		left: Number,
	}
});

export default model("userdata", schema);
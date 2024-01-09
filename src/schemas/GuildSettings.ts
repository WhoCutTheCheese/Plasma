import { Schema, model } from "mongoose";

const schema = new Schema({
	guildID: {
		type: String,
		required: true
	},
	prefix: String,
	premium: Boolean,
	premiumUser: String,
	embedColor: String,
	guildTimezone: String,
	levels: {
		enabled: Boolean,

		expMulti: Number,
		autoHappyHour: String,
		happyHourExpMult: Number,
		levelMessage: String,
	},
	messageCounting: {
		enabled: Boolean,

	},
	inviteTracking: {
		enabled: Boolean,

	},

});

export default model("settings", schema);
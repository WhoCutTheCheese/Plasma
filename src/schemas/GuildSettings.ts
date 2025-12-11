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
		// Toggle
		enabled: Boolean,
		// Settings
		expMulti: Number,
		autoHappyHour: String,
		happyHourExpMult: Number,
		levelMessage: String,
		levelBanRoles: Array,
	},
	messageCounting: {
		// Toggle
		enabled: Boolean,
		// Settings
		countingBanRoles: Array,
	},
	inviteTracking: {
		// Toggles
		enabled: Boolean,
		disableAlerts: Boolean,
		// Settings
		inviteBanRoles: Array,
		inviteLogChannel: String,
	},

});

export default model("settings", schema);
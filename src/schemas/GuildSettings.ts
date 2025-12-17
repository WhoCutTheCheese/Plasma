import { Schema, model } from "mongoose";

export interface IGuildSettings {
	guildID: string;
	prefix?: string;
	premium?: boolean;
	premiumUser?: string;
	embedColor?: string;
	guildTimezone?: string;
	levels?: {
		enabled?: boolean;
		expMulti?: number;
		autoHappyHour?: string;
		happyHourExpMult?: number;
		levelMessage?: string;
		levelBanRoles?: string[];
	};
	messageCounting?: {
		enabled?: boolean;
		countingBanRoles?: string[];
	};
	inviteTracking?: {
		enabled?: boolean;
		disableAlerts?: boolean;
		inviteBanRoles?: string[];
		inviteLogChannel?: string;
	};
}

const schema = new Schema<IGuildSettings>({
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

export default model<IGuildSettings>("settings", schema);
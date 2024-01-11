import { Schema, model } from "mongoose";

const schema = new Schema({
	userID: {
		type: String,
		required: true
	},
	guildID: {
		type: String,
		required: true
	},
	inviteCode: {
		type: String,
		required: true,
	},
	uses: {
		type: Number,
		default: 0
	},
});

export default model("invites", schema);
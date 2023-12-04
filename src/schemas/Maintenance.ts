import { Schema, model } from "mongoose";

const schema = new Schema({
	clientID: String,
	maintenance: Boolean,
	reason: String,
});

export default model("maintenance", schema);
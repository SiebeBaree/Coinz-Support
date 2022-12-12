import { Schema, model } from 'mongoose';

const Guild = Schema({
    id: { type: String, required: true, unique: true, index: true },
    joinedAt: { type: Date, default: Date.now },
    banned: { type: Boolean, default: false },
    banReason: { type: String, default: "" }
});

export default model('Guild', Guild, 'guilds');
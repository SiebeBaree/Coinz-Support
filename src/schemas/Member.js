import { Schema, model } from 'mongoose';

const Member = Schema({
    id: { type: String, required: true, unique: true, index: true },
    tickets: { type: Number, default: 0 },
    badges: [{ type: String }]
});

export default model('Member', Member, 'members');
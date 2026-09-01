const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
  guildId: { type: String, required: true, unique: true, index: true },
  language: { type: String, default: 'tr' },
  prefix: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Guild', guildSchema);

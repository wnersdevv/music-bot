const { Schema, model } = require('mongoose');

const historySchema = new Schema({
  userId: { type: String, required: true, index: true },
  guildId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  artist: { type: String, default: null },
  durationMs: { type: Number, default: 0 },
  playedAt: { type: Date, default: Date.now, index: true }
});

module.exports = model('History', historySchema);

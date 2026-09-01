const { Schema, model } = require('mongoose');

const statisticsSchema = new Schema({
  guildId: { type: String, required: true, index: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  tracksPlayed: { type: Number, default: 0 },
  listenMs: { type: Number, default: 0 },
  uniqueListeners: { type: [String], default: [] }
});

statisticsSchema.index({ guildId: 1, date: 1 }, { unique: true });

module.exports = model('Statistics', statisticsSchema);

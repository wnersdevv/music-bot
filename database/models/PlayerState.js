const { Schema, model } = require('mongoose');

const playerStateSchema = new Schema({
  guildId: { type: String, required: true, unique: true, index: true },
  voiceChannelId: { type: String, default: null },
  textChannelId: { type: String, default: null },
  volume: { type: Number, default: 80 },
  loopMode: { type: String, enum: ['off', 'track', 'queue'], default: 'off' },
  queueSnapshot: { type: [Schema.Types.Mixed], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = model('PlayerState', playerStateSchema);

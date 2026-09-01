const { Schema, model } = require('mongoose');

const guildMusicSettingsSchema = new Schema({
  guildId: { type: String, required: true, unique: true, index: true },
  djRoleId: { type: String, default: null },
  musicChannelId: { type: String, default: null },
  commandChannelId: { type: String, default: null },
  requestChannelId: { type: String, default: null },
  announceChannelId: { type: String, default: null },
  defaultVolume: { type: Number, default: 80 },
  autoplay: { type: Boolean, default: false },
  loopMode: { type: String, enum: ['off', 'track', 'queue'], default: 'off' },
  twentyFourSeven: { type: Boolean, default: false },
  skipVoteEnabled: { type: Boolean, default: true },
  skipVoteRatio: { type: Number, default: 0.5 },
  maxQueueSize: { type: Number, default: 500 },
  requestMode: { type: String, enum: ['anyone', 'dj-only'], default: 'anyone' }
}, { timestamps: true });

module.exports = model('GuildMusicSettings', guildMusicSettingsSchema);

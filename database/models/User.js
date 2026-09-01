const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true, index: true },
  totalListenMs: { type: Number, default: 0 },
  totalTracksPlayed: { type: Number, default: 0 },
  preferences: {
    language: { type: String, default: null }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('User', userSchema);

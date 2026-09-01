const { Schema, model } = require('mongoose');

const trackSchema = new Schema({
  title: String,
  url: String,
  duration: String,
  thumbnail: String
}, { _id: false });

const playlistSchema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  tracks: { type: [trackSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

playlistSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = model('Playlist', playlistSchema);

const { Schema, model } = require('mongoose');

const favoriteSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: String, default: null },
  thumbnail: { type: String, default: null },
  addedAt: { type: Date, default: Date.now }
});

favoriteSchema.index({ userId: 1, url: 1 }, { unique: true });

module.exports = model('Favorite', favoriteSchema);

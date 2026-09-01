const { Schema, model } = require('mongoose');

const searchHistorySchema = new Schema({
  userId: { type: String, required: true, index: true },
  query: { type: String, required: true },
  source: { type: String, enum: ['search', 'ai'], default: 'search' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('SearchHistory', searchHistorySchema);

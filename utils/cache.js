const { LRUCache } = require('lru-cache');
const config = require('../config/config');

const searchCache = new LRUCache({ max: 500, ttl: config.cacheTTL });
const metadataCache = new LRUCache({ max: 1000, ttl: config.cacheTTL });
const settingsCache = new LRUCache({ max: 300, ttl: 1000 * 60 * 5 });

module.exports = { searchCache, metadataCache, settingsCache };

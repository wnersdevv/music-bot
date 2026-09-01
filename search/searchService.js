const { useMainPlayer, QueryType } = require('discord-player');
const { searchCache } = require('../utils/cache');

async function search(query, { requestedBy, limit = 10 } = {}) {
  const cacheKey = `${query.toLowerCase()}:${limit}`;
  if (searchCache.has(cacheKey)) return searchCache.get(cacheKey);

  const player = useMainPlayer();
  const result = await player.search(query, {
    requestedBy,
    searchEngine: QueryType.AUTO
  });

  const tracks = result.tracks.slice(0, limit);
  searchCache.set(cacheKey, tracks);
  return tracks;
}

module.exports = { search };

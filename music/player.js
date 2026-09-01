const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('@discord-player/extractor');
const logger = require('../utils/logger');

let playerInstance = null;

async function initPlayer(client) {
  playerInstance = new Player(client, {
    skipFFmpeg: false
  });

  await playerInstance.extractors.register(YoutubeiExtractor, {});
  await playerInstance.extractors.loadDefault((ext) => ext !== 'YoutubeExtractor');

  logger.success('Player', 'Müzik motoru başlatıldı.');
  return playerInstance;
}

function getPlayer() {
  if (!playerInstance) throw new Error('Player henüz başlatılmadı.');
  return playerInstance;
}

module.exports = { initPlayer, getPlayer };

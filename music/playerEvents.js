const { useMainPlayer } = require('discord-player');
const { ContainerBuilder } = require('discord.js');
const { buildNowPlayingPanel } = require('../components/nowPlayingPanel');
const History = require('../database/models/History');
const Statistics = require('../database/models/Statistics');
const logger = require('../utils/logger');

function registerPlayerEvents(client) {
  const player = useMainPlayer();

  player.events.on('playerStart', async (queue, track) => {
    try {
      const panel = buildNowPlayingPanel(track, queue);
      await queue.metadata?.channel?.send({ components: [panel], flags: 1 << 15 });

      History.create({
        userId: track.requestedBy?.id || 'unknown',
        guildId: queue.guild.id,
        title: track.title,
        url: track.url,
        artist: track.author,
        durationMs: track.durationMS
      }).catch(() => {});

      const today = new Date().toISOString().slice(0, 10);
      Statistics.findOneAndUpdate(
        { guildId: queue.guild.id, date: today },
        { $inc: { tracksPlayed: 1 }, $addToSet: { uniqueListeners: track.requestedBy?.id } },
        { upsert: true }
      ).catch(() => {});
    } catch (err) {
      logger.error('PlayerEvents', err.stack);
    }
  });

  player.events.on('emptyQueue', async (queue) => {
    await queue.metadata?.channel?.send('📭 Kuyruk bitti, ses kanalından çıkılıyor.').catch(() => {});
  });

  player.events.on('playerError', (queue, error) => {
    logger.error('PlayerError', error.message);
  });

  player.events.on('error', (queue, error) => {
    logger.error('QueueError', error.message);
  });
}

module.exports = { registerPlayerEvents };

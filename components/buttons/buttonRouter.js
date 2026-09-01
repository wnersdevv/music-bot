const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const Favorite = require('../../database/models/Favorite');

async function handleButton(interaction) {
  const [scope, action] = interaction.customId.split(':');
  if (scope !== 'player') return;

  const queue = useQueue(interaction.guildId);
  if (!queue || !queue.currentTrack) {
    return interaction.reply({ embeds: [errorEmbed('Şu an aktif bir çalma yok.')], ephemeral: true });
  }

  if (interaction.member.voice.channelId !== queue.channel?.id) {
    return interaction.reply({
      embeds: [errorEmbed('Bu paneli kullanmak için botla aynı ses kanalında olmalısın.')],
      ephemeral: true
    });
  }

  switch (action) {
    case 'pauseresume':
      queue.node.setPaused(!queue.node.isPaused());
      return interaction.reply({ content: queue.node.isPaused() ? '⏸️ Duraklatıldı' : '▶️ Devam ediyor', ephemeral: true });
    case 'skip':
      queue.node.skip();
      return interaction.reply({ content: '⏭️ Geçildi', ephemeral: true });
    case 'stop':
      queue.delete();
      return interaction.reply({ content: '⏹️ Durduruldu', ephemeral: true });
    case 'shuffle':
      queue.tracks.shuffle();
      return interaction.reply({ content: '🔀 Kuyruk karıştırıldı', ephemeral: true });
    case 'volup': {
      const vol = Math.min(100, queue.node.volume + 10);
      queue.node.setVolume(vol);
      return interaction.reply({ content: `🔊 Ses: %${vol}`, ephemeral: true });
    }
    case 'voldown': {
      const vol = Math.max(0, queue.node.volume - 10);
      queue.node.setVolume(vol);
      return interaction.reply({ content: `🔉 Ses: %${vol}`, ephemeral: true });
    }
    case 'loop': {
      const modes = [0, 1, 2];
      const next = modes[(modes.indexOf(queue.repeatMode) + 1) % modes.length];
      queue.setRepeatMode(next);
      return interaction.reply({ content: `🔁 Döngü modu: ${next}`, ephemeral: true });
    }
    case 'queue': {
      const list = queue.tracks.toArray().slice(0, 10).map((t, i) => `${i + 1}. ${t.title}`).join('\n') || 'Kuyruk boş';
      return interaction.reply({ content: list, ephemeral: true });
    }
    case 'favorite': {
      const track = queue.currentTrack;
      await Favorite.findOneAndUpdate(
        { userId: interaction.user.id, url: track.url },
        { title: track.title, url: track.url, duration: track.duration, thumbnail: track.thumbnail },
        { upsert: true }
      );
      return interaction.reply({ embeds: [successEmbed('Favorilere eklendi.')], ephemeral: true });
    }
    default:
      return interaction.reply({ embeds: [errorEmbed('Bilinmeyen işlem.')], ephemeral: true });
  }
}

module.exports = { handleButton };

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('şarkı-bilgi').setDescription('Çalan şarkının detaylarını gösterir'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const track = queue.currentTrack;
    const embed = baseEmbed()
      .setTitle(track.title)
      .setThumbnail(track.thumbnail)
      .setDescription(
        `🎤 Sanatçı: **${track.author || 'Bilinmiyor'}**\n` +
        `⏱️ Süre: **${track.duration}**\n` +
        `🔗 Kaynak: **${track.source}**\n` +
        `👤 İsteyen: **${track.requestedBy?.username || 'Bilinmiyor'}**\n` +
        `🔗 [Şarkı Linki](${track.url})`
      );

    await interaction.reply({ embeds: [embed] });
  }
};

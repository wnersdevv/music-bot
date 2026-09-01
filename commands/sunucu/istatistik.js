const { SlashCommandBuilder } = require('discord.js');
const Statistics = require('../../database/models/Statistics');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('istatistik').setDescription('Sunucu müzik istatistiklerini gösterir'),

  async execute(interaction) {
    const stats = await Statistics.aggregate([
      { $match: { guildId: interaction.guildId } },
      {
        $group: {
          _id: null,
          totalTracks: { $sum: '$tracksPlayed' },
          totalListenMs: { $sum: '$listenMs' }
        }
      }
    ]);

    if (!stats.length) {
      return interaction.reply({ embeds: [errorEmbed('Bu sunucu için henüz istatistik yok.')], ephemeral: true });
    }

    const { totalTracks, totalListenMs } = stats[0];
    const embed = baseEmbed()
      .setTitle('📊 Sunucu İstatistikleri')
      .setDescription(`🎵 Toplam çalınan şarkı: **${totalTracks}**\n⏱️ Toplam dinleme süresi: **${Math.round(totalListenMs / 60000)} dakika**`);

    await interaction.reply({ embeds: [embed] });
  }
};

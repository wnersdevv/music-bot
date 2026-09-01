const { SlashCommandBuilder } = require('discord.js');
const Statistics = require('../../database/models/Statistics');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('haftalık-istatistik').setDescription('Son 7 günün istatistiklerini gösterir'),

  async execute(interaction) {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const stats = await Statistics.aggregate([
      { $match: { guildId: interaction.guildId, date: { $gte: since } } },
      { $group: { _id: null, totalTracks: { $sum: '$tracksPlayed' }, totalListenMs: { $sum: '$listenMs' } } }
    ]);

    if (!stats.length) {
      return interaction.reply({ embeds: [errorEmbed('Bu hafta için istatistik yok.')], ephemeral: true });
    }

    const { totalTracks, totalListenMs } = stats[0];
    const embed = baseEmbed()
      .setTitle('📊 Haftalık İstatistik')
      .setDescription(`🎵 Çalınan şarkı: **${totalTracks}**\n⏱️ Dinleme süresi: **${Math.round(totalListenMs / 60000)} dakika**`);

    await interaction.reply({ embeds: [embed] });
  }
};

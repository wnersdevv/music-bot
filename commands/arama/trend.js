const { SlashCommandBuilder } = require('discord.js');
const History = require('../../database/models/History');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('trend').setDescription('Bu sunucuda son 7 günün trend şarkılarını gösterir'),

  async execute(interaction) {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const results = await History.aggregate([
      { $match: { guildId: interaction.guildId, playedAt: { $gte: since } } },
      { $group: { _id: '$title', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    if (!results.length) {
      return interaction.reply({ embeds: [errorEmbed('Son 7 günde yeterli veri yok.')], ephemeral: true });
    }

    const list = results.map((r, i) => `**${i + 1}.** ${r._id} — ${r.count} kez`).join('\n');
    await interaction.reply({ embeds: [baseEmbed().setTitle('📈 Son 7 Günün Trendleri').setDescription(list)] });
  }
};

const { SlashCommandBuilder } = require('discord.js');
const History = require('../../database/models/History');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('haftanın-şarkısı').setDescription('Bu sunucuda haftanın en çok çalınan şarkısını gösterir'),

  async execute(interaction) {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const results = await History.aggregate([
      { $match: { guildId: interaction.guildId, playedAt: { $gte: since } } },
      { $group: { _id: '$title', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    if (!results.length) {
      return interaction.reply({ embeds: [errorEmbed('Bu hafta için yeterli veri yok.')], ephemeral: true });
    }

    await interaction.reply({
      embeds: [baseEmbed().setTitle('🗓️ Haftanın Şarkısı').setDescription(`**${results[0]._id}** — ${results[0].count} kez çalındı`)]
    });
  }
};

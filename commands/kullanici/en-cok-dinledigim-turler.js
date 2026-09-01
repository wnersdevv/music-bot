const { SlashCommandBuilder } = require('discord.js');
const History = require('../../database/models/History');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('en-çok-dinlediğim-türler').setDescription('En çok dinlediğin sanatçılara göre tür özetini gösterir'),

  async execute(interaction) {
    const results = await History.aggregate([
      { $match: { userId: interaction.user.id, artist: { $ne: null } } },
      { $group: { _id: '$artist', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    if (!results.length) {
      return interaction.reply({ embeds: [errorEmbed('Henüz dinleme geçmişin yok.')], ephemeral: true });
    }

    const list = results.map((r, i) => `**${i + 1}.** ${r._id} ağırlıklı dinlemeler — ${r.count} şarkı`).join('\n');
    await interaction.reply({
      embeds: [baseEmbed().setTitle('🎼 Dinleme Eğilimlerin').setDescription(list).setFooter({ text: 'wnersdev • sanatçı bazlı özet' })],
      ephemeral: true
    });
  }
};

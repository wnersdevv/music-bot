const { SlashCommandBuilder } = require('discord.js');
const History = require('../../database/models/History');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('top-kullanıcılar').setDescription('Sunucudaki en aktif dinleyicileri gösterir'),

  async execute(interaction) {
    const results = await History.aggregate([
      { $match: { guildId: interaction.guildId } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    if (!results.length) {
      return interaction.reply({ embeds: [errorEmbed('Henüz yeterli veri yok.')], ephemeral: true });
    }

    const list = results.map((r, i) => `**${i + 1}.** <@${r._id}> — ${r.count} şarkı`).join('\n');
    await interaction.reply({ embeds: [baseEmbed().setTitle('👑 En Aktif Dinleyiciler').setDescription(list)] });
  }
};

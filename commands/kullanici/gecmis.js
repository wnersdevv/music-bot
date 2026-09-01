const { SlashCommandBuilder } = require('discord.js');
const History = require('../../database/models/History');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('geçmiş').setDescription('Son dinlediğin şarkıları gösterir'),

  async execute(interaction) {
    const history = await History.find({ userId: interaction.user.id }).sort({ playedAt: -1 }).limit(15).lean();

    if (!history.length) {
      return interaction.reply({ embeds: [errorEmbed('Dinleme geçmişin boş.')], ephemeral: true });
    }

    const list = history.map((h, i) => `**${i + 1}.** ${h.title}`).join('\n');
    await interaction.reply({ embeds: [baseEmbed().setTitle('📜 Dinleme Geçmişin').setDescription(list)], ephemeral: true });
  }
};

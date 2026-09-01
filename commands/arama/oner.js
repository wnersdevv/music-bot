const { SlashCommandBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');
const History = require('../../database/models/History');

module.exports = {
  data: new SlashCommandBuilder().setName('öner').setDescription('Geçmişine göre şarkı önerir'),

  async execute(interaction) {
    await interaction.deferReply();

    const lastPlayed = await History.find({ userId: interaction.user.id }).sort({ playedAt: -1 }).limit(1).lean();
    if (!lastPlayed.length) {
      return interaction.editReply({ embeds: [errorEmbed('Öneri üretmek için önce biraz müzik dinlemelisin.')] });
    }

    const seed = lastPlayed[0];
    const tracks = await search(`${seed.artist || seed.title} benzer şarkılar`, {
      requestedBy: interaction.user,
      limit: 5
    });

    const list = tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n') || 'Öneri bulunamadı.';
    const embed = baseEmbed().setTitle('✨ Senin İçin Önerilenler').setDescription(list);
    await interaction.editReply({ embeds: [embed] });
  }
};

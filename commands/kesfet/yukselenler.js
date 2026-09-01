const { SlashCommandBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('yükselenler').setDescription('Yükselen şarkı ve sanatçıları gösterir'),

  async execute(interaction) {
    await interaction.deferReply();
    const tracks = await search('yükselen trend şarkılar 2026', { requestedBy: interaction.user, limit: 8 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Sonuç bulunamadı.')] });

    const list = tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n');
    await interaction.editReply({ embeds: [baseEmbed().setTitle('📈 Yükselenler').setDescription(list)] });
  }
};

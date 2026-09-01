const { SlashCommandBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yeni-çıkan')
    .setDescription('Yeni çıkan şarkıları arar')
    .addStringOption((o) => o.setName('tür').setDescription('Müzik türü (opsiyonel)').setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply();
    const genre = interaction.options.getString('tür') || '';
    const tracks = await search(`${genre} 2026 yeni çıkan şarkılar`.trim(), { requestedBy: interaction.user, limit: 8 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Sonuç bulunamadı.')] });

    const list = tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n');
    await interaction.editReply({ embeds: [baseEmbed().setTitle('🆕 Yeni Çıkanlar').setDescription(list)] });
  }
};

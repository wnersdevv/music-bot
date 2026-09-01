const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');
const SearchHistory = require('../../database/models/SearchHistory');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ara')
    .setDescription('Şarkı arar ve seçim menüsü gösterir')
    .addStringOption((opt) => opt.setName('sorgu').setDescription('Aranacak şarkı').setRequired(true)),

  async execute(interaction) {
    const query = interaction.options.getString('sorgu');
    await interaction.deferReply();

    const tracks = await search(query, { requestedBy: interaction.user, limit: 10 });
    if (!tracks.length) {
      return interaction.editReply({ embeds: [errorEmbed('Sonuç bulunamadı.')] });
    }

    SearchHistory.create({ userId: interaction.user.id, query, source: 'search' }).catch(() => {});

    const select = new StringSelectMenuBuilder()
      .setCustomId('search:select')
      .setPlaceholder('Bir şarkı seç')
      .addOptions(
        tracks.map((t) => ({
          label: t.title.slice(0, 90),
          description: `${t.author ?? ''} • ${t.duration ?? ''}`.slice(0, 90),
          value: t.url.slice(0, 100)
        }))
      );

    const embed = baseEmbed().setTitle(`🔎 "${query}" için sonuçlar`).setDescription('Aşağıdaki menüden bir şarkı seç.');
    await interaction.editReply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(select)] });
  }
};

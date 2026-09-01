const { SlashCommandBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

const pools = ['gizli hazine şarkılar', 'az bilinen iyi şarkılar', 'keşfedilmeyi bekleyen sanatçılar'];

module.exports = {
  data: new SlashCommandBuilder().setName('keşfet').setDescription('Yeni ve az bilinen şarkılar keşfeder'),

  async execute(interaction) {
    await interaction.deferReply();
    const seed = pools[Math.floor(Math.random() * pools.length)];
    const tracks = await search(seed, { requestedBy: interaction.user, limit: 8 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Keşfedilecek şarkı bulunamadı.')] });

    const list = tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n');
    await interaction.editReply({ embeds: [baseEmbed().setTitle('🧭 Keşfet').setDescription(list)] });
  }
};

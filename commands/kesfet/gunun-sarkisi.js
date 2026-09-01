const { SlashCommandBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

const pool = ['günün en iyi şarkısı', 'popüler günlük şarkı önerisi', 'bugünün trend şarkısı'];

module.exports = {
  data: new SlashCommandBuilder().setName('günün-şarkısı').setDescription('Günün önerilen şarkısını gösterir'),

  async execute(interaction) {
    await interaction.deferReply();
    const dayIndex = new Date().getDate() % pool.length;
    const tracks = await search(pool[dayIndex], { requestedBy: interaction.user, limit: 1 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Bugün için öneri bulunamadı.')] });

    const track = tracks[0];
    await interaction.editReply({
      embeds: [baseEmbed().setTitle('☀️ Günün Şarkısı').setThumbnail(track.thumbnail).setDescription(`**${track.title}**\n${track.url}`)]
    });
  }
};

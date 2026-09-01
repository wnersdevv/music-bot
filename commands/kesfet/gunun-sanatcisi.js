const { SlashCommandBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

const artists = ['popüler dünya sanatçısı', 'yükselen sanatçı', 'klasik efsane sanatçı'];

module.exports = {
  data: new SlashCommandBuilder().setName('günün-sanatçısı').setDescription('Günün önerilen sanatçısını gösterir'),

  async execute(interaction) {
    await interaction.deferReply();
    const dayIndex = new Date().getDate() % artists.length;
    const tracks = await search(artists[dayIndex], { requestedBy: interaction.user, limit: 1 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Bugün için öneri bulunamadı.')] });

    const track = tracks[0];
    await interaction.editReply({
      embeds: [baseEmbed().setTitle('🌟 Günün Sanatçısı').setThumbnail(track.thumbnail).setDescription(`**${track.author || track.title}**`)]
    });
  }
};

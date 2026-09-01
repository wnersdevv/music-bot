const { SlashCommandBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sanatçı')
    .setDescription('Bir sanatçı hakkında genel bilgi ve popüler şarkılarını gösterir')
    .addStringOption((o) => o.setName('isim').setDescription('Sanatçı adı').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const artist = interaction.options.getString('isim');
    const tracks = await search(`${artist} popüler şarkılar`, { requestedBy: interaction.user, limit: 5 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Sanatçı bulunamadı.')] });

    const list = tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n');
    const embed = baseEmbed()
      .setTitle(`🎤 ${artist}`)
      .setThumbnail(tracks[0].thumbnail)
      .setDescription(`**Popüler Şarkılar:**\n${list}`);

    await interaction.editReply({ embeds: [embed] });
  }
};

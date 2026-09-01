const { SlashCommandBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sanatçı-ara')
    .setDescription('Bir sanatçının popüler şarkılarını arar')
    .addStringOption((opt) => opt.setName('sanatçı').setDescription('Sanatçı adı').setRequired(true)),

  async execute(interaction) {
    const artist = interaction.options.getString('sanatçı');
    await interaction.deferReply();

    const tracks = await search(`${artist} en popüler şarkılar`, { requestedBy: interaction.user, limit: 8 });
    if (!tracks.length) {
      return interaction.editReply({ embeds: [errorEmbed('Sanatçı için sonuç bulunamadı.')] });
    }

    const list = tracks.map((t, i) => `**${i + 1}.** ${t.title} — \`${t.duration}\``).join('\n');
    const embed = baseEmbed().setTitle(`🎤 ${artist}`).setDescription(list);
    await interaction.editReply({ embeds: [embed] });
  }
};

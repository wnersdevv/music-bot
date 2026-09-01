const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('benzer').setDescription('Şu an çalan şarkıya benzer şarkılar bulur'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    await interaction.deferReply();
    const track = queue.currentTrack;
    const tracks = await search(`${track.author || track.title} benzer şarkılar`, { requestedBy: interaction.user, limit: 8 });

    const list = tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n') || 'Benzer şarkı bulunamadı.';
    await interaction.editReply({ embeds: [baseEmbed().setTitle(`🔁 "${track.title}" Benzerleri`).setDescription(list)] });
  }
};

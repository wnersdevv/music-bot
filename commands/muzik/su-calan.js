const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed } = require('../../utils/embeds');
const { buildNowPlayingPanel } = require('../../components/nowPlayingPanel');

module.exports = {
  data: new SlashCommandBuilder().setName('şu-çalan').setDescription('Şu an çalan şarkıyı gösterir'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const panel = buildNowPlayingPanel(queue.currentTrack, queue);
    await interaction.reply({ components: [panel], flags: 1 << 15 });
  }
};

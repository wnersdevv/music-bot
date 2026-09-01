const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('duraklat').setDescription('Çalan şarkıyı duraklatır'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    queue.node.setPaused(true);
    await interaction.reply({ embeds: [successEmbed('Müzik duraklatıldı.')] });
  }
};

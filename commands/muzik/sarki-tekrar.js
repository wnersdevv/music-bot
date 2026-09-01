const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('şarkı-tekrar').setDescription('Çalan şarkıyı bir kez daha kuyruğa ekler'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const track = queue.currentTrack;
    queue.insertTrack(track, 0);
    await interaction.reply({ embeds: [successEmbed(`**${track.title}** tekrar sıraya eklendi.`)] });
  }
};

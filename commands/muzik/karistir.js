const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('karıştır').setDescription('Kuyruğu karıştırır'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.tracks?.size) {
      return interaction.reply({ embeds: [errorEmbed('Kuyrukta karıştırılacak şarkı yok.')], ephemeral: true });
    }

    queue.tracks.shuffle();
    await interaction.reply({ embeds: [successEmbed('Kuyruk karıştırıldı.')] });
  }
};

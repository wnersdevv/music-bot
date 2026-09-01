const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('kuyruk-temizle').setDescription('Kuyruktaki tüm şarkıları temizler'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.tracks?.size) {
      return interaction.reply({ embeds: [errorEmbed('Kuyruk zaten boş.')], ephemeral: true });
    }
    queue.tracks.clear();
    await interaction.reply({ embeds: [successEmbed('Kuyruk temizlendi.')] });
  }
};

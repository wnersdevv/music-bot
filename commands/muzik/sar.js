const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sar')
    .setDescription('Şarkıda belirli bir saniyeye sarar')
    .addIntegerOption((o) => o.setName('saniye').setDescription('Sarılacak saniye').setRequired(true).setMinValue(0)),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const seconds = interaction.options.getInteger('saniye');
    await queue.node.seek(seconds * 1000);
    await interaction.reply({ embeds: [successEmbed(`⏩ ${seconds}. saniyeye sarıldı.`)] });
  }
};

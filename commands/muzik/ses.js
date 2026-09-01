const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ses')
    .setDescription('Ses seviyesini ayarlar')
    .addIntegerOption((opt) =>
      opt.setName('seviye').setDescription('0-100 arası ses seviyesi').setMinValue(0).setMaxValue(100).setRequired(true)
    ),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const level = interaction.options.getInteger('seviye');
    queue.node.setVolume(level);
    await interaction.reply({ embeds: [successEmbed(`Ses seviyesi %${level} olarak ayarlandı.`)] });
  }
};

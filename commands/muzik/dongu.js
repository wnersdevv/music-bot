const { SlashCommandBuilder } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

const modeMap = {
  kapalı: QueueRepeatMode.OFF,
  şarkı: QueueRepeatMode.TRACK,
  kuyruk: QueueRepeatMode.QUEUE
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('döngü')
    .setDescription('Döngü modunu ayarlar')
    .addStringOption((opt) =>
      opt
        .setName('mod')
        .setDescription('Döngü modu')
        .setRequired(true)
        .addChoices(
          { name: 'Kapalı', value: 'kapalı' },
          { name: 'Şarkı', value: 'şarkı' },
          { name: 'Kuyruk', value: 'kuyruk' }
        )
    ),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const mode = interaction.options.getString('mod');
    queue.setRepeatMode(modeMap[mode]);
    await interaction.reply({ embeds: [successEmbed(`Döngü modu: **${mode}**`)] });
  }
};

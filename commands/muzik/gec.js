const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('geç').setDescription('Şu an çalan şarkıyı geçer'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const skipped = queue.currentTrack.title;
    queue.node.skip();
    await interaction.reply({ embeds: [successEmbed(`**${skipped}** geçildi.`)] });
  }
};

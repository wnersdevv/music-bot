const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const config = require('../../config/config');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('player-sıfırla').setDescription('Geliştirici: bu sunucudaki player durumunu sıfırlar'),

  async execute(interaction) {
    if (!config.devIds.includes(interaction.user.id)) {
      return interaction.reply({ embeds: [errorEmbed('Bu komutu kullanma yetkin yok.')], ephemeral: true });
    }

    const queue = useQueue(interaction.guildId);
    if (queue) queue.delete();

    await interaction.reply({ embeds: [successEmbed('Player durumu sıfırlandı.')], ephemeral: true });
  }
};

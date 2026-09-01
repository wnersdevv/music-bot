const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('radyo-durdur').setDescription('Radyo yayınını durdurur'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue) return interaction.reply({ embeds: [errorEmbed('Aktif bir radyo yayını yok.')], ephemeral: true });

    queue.setRepeatMode(0);
    queue.delete();
    await interaction.reply({ embeds: [successEmbed('📻 Radyo yayını durduruldu.')] });
  }
};

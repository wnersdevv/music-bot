const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kuyrukta-başa-al')
    .setDescription('Bir şarkıyı kuyruğun başına alır')
    .addIntegerOption((o) => o.setName('sıra').setDescription('Şarkının mevcut sırası').setRequired(true).setMinValue(1)),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    const index = interaction.options.getInteger('sıra') - 1;
    const track = queue?.tracks?.at(index);

    if (!track) {
      return interaction.reply({ embeds: [errorEmbed('Bu sırada bir şarkı yok.')], ephemeral: true });
    }

    queue.node.move(index, 0);
    await interaction.reply({ embeds: [successEmbed(`**${track.title}** kuyruğun başına alındı.`)] });
  }
};

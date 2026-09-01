const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kuyruktan-çıkar')
    .setDescription('Kuyruktan belirli bir şarkıyı çıkarır')
    .addIntegerOption((o) => o.setName('sıra').setDescription('Şarkının sıra numarası').setRequired(true).setMinValue(1)),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    const index = interaction.options.getInteger('sıra') - 1;
    const track = queue?.tracks?.at(index);

    if (!track) {
      return interaction.reply({ embeds: [errorEmbed('Bu sırada bir şarkı bulunamadı.')], ephemeral: true });
    }

    queue.node.remove(index);
    await interaction.reply({ embeds: [successEmbed(`**${track.title}** kuyruktan çıkarıldı.`)] });
  }
};

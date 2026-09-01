const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kuyrukta-taşı')
    .setDescription('Kuyrukta bir şarkıyı başka bir sıraya taşır')
    .addIntegerOption((o) => o.setName('kaynak').setDescription('Taşınacak şarkının sırası').setRequired(true).setMinValue(1))
    .addIntegerOption((o) => o.setName('hedef').setDescription('Yeni sıra numarası').setRequired(true).setMinValue(1)),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    const from = interaction.options.getInteger('kaynak') - 1;
    const to = interaction.options.getInteger('hedef') - 1;

    if (!queue?.tracks?.at(from)) {
      return interaction.reply({ embeds: [errorEmbed('Kaynak sırada şarkı bulunamadı.')], ephemeral: true });
    }

    queue.node.move(from, to);
    await interaction.reply({ embeds: [successEmbed(`Şarkı **${from + 1}** → **${to + 1}** sırasına taşındı.`)] });
  }
};

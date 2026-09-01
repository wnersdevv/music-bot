const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kuyrukta-atla')
    .setDescription('Kuyrukta belirtilen şarkıya atlar')
    .addIntegerOption((o) => o.setName('sıra').setDescription('Atlanacak şarkının sırası').setRequired(true).setMinValue(1)),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    const index = interaction.options.getInteger('sıra') - 1;
    const track = queue?.tracks?.at(index);

    if (!track) {
      return interaction.reply({ embeds: [errorEmbed('Bu sırada bir şarkı yok.')], ephemeral: true });
    }

    queue.node.skipTo(index);
    await interaction.reply({ embeds: [successEmbed(`**${track.title}** şarkısına atlandı.`)] });
  }
};

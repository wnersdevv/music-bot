const { useMainPlayer } = require('discord-player');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { buildHelpPanel } = require('./helpMenuData');

async function handleMenu(interaction) {
  const [scope] = interaction.customId.split(':');

  if (scope === 'search') {
    return handleSearchSelect(interaction);
  }

  if (scope === 'help') {
    const category = interaction.values[0];
    const panel = buildHelpPanel(category);
    return interaction.update({ components: [panel] });
  }
}

async function handleSearchSelect(interaction) {
  const player = useMainPlayer();
  const url = interaction.values[0];

  if (!interaction.member.voice.channelId) {
    return interaction.reply({ embeds: [errorEmbed('Önce bir ses kanalına katılmalısın.')], ephemeral: true });
  }

  await interaction.deferUpdate();

  const { track } = await player.play(interaction.member.voice.channel, url, {
    nodeOptions: {
      metadata: { channel: interaction.channel },
      volume: 80,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 60_000,
      leaveOnEnd: false
    },
    requestedBy: interaction.user
  });

  await interaction.editReply({
    embeds: [successEmbed(`**${track.title}** kuyruğa eklendi.`)],
    components: []
  });
}

module.exports = { handleMenu };

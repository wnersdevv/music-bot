const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('çal')
    .setDescription('Bir şarkı, video veya playlist çal')
    .addStringOption((opt) =>
      opt.setName('sorgu').setDescription('Şarkı adı, YouTube linki veya playlist linki').setRequired(true)
    ),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) {
      return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });
    }

    await interaction.deferReply();

    const player = useMainPlayer();
    const query = interaction.options.getString('sorgu');

    try {
      const { track, queue } = await player.play(interaction.member.voice.channel, query, {
        nodeOptions: {
          metadata: { channel: interaction.channel },
          volume: 80,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 60_000,
          leaveOnEnd: false
        },
        requestedBy: interaction.user
      });

      const positionText = queue.tracks.size > 0 ? ` (Sırada #${queue.tracks.size})` : '';
      await interaction.editReply({
        embeds: [successEmbed(`**${track.title}** kuyruğa eklendi.${positionText}`)]
      });
    } catch (err) {
      await interaction.editReply({ embeds: [errorEmbed('Şarkı bulunamadı veya oynatılamadı.')] });
    }
  }
};

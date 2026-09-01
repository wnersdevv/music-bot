const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { recommendByMood } = require('../../ai/aiService');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('radyo-mood')
    .setDescription('AI ile ruh haline uygun radyo başlatır')
    .addStringOption((o) => o.setName('mood').setDescription('Ruh halin').setRequired(true)),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    await interaction.deferReply();
    const mood = interaction.options.getString('mood');

    try {
      const tracks = await recommendByMood(mood, interaction.user);
      if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Uygun şarkı bulunamadı.')] });

      const player = useMainPlayer();
      for (const track of tracks) {
        await player.play(interaction.member.voice.channel, track.url, {
          nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: false, repeatMode: 2 },
          requestedBy: interaction.user
        }).catch(() => {});
      }

      await interaction.editReply({ embeds: [successEmbed(`📻 AI Radyo başlatıldı: **${mood}**`)] });
    } catch {
      await interaction.editReply({ embeds: [errorEmbed('AI servisine ulaşılamadı.')] });
    }
  }
};

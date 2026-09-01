const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { recommendByMood } = require('../../ai/aiService');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');
const SearchHistory = require('../../database/models/SearchHistory');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai-mood')
    .setDescription('Ruh haline göre AI destekli müzik önerisi alır ve çalar')
    .addStringOption((opt) => opt.setName('mood').setDescription('Örn: gece yolculuğu, enerjik sabah').setRequired(true)),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    await interaction.deferReply();
    const mood = interaction.options.getString('mood');

    try {
      const tracks = await recommendByMood(mood, interaction.user);
      if (!tracks.length) {
        return interaction.editReply({ embeds: [errorEmbed('AI için uygun şarkı bulunamadı.')] });
      }

      SearchHistory.create({ userId: interaction.user.id, query: mood, source: 'ai' }).catch(() => {});

      const player = useMainPlayer();
      for (const track of tracks) {
        await player.play(interaction.member.voice.channel, track.url, {
          nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: true },
          requestedBy: interaction.user
        }).catch(() => {});
      }

      const list = tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n');
      await interaction.editReply({ embeds: [successEmbed(`**"${mood}"** için önerilen şarkılar kuyruğa eklendi:\n\n${list}`)] });
    } catch (err) {
      await interaction.editReply({ embeds: [errorEmbed('AI servisine ulaşılamadı. AI_API_KEY tanımlı mı kontrol et.')] });
    }
  }
};

const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { search } = require('../../search/searchService');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

const seeds = ['pop hit', 'rock klasik', 'türkçe rap', 'lo-fi', 'arabesk', '90lar hit', 'k-pop', 'jazz klasik'];

module.exports = {
  data: new SlashCommandBuilder().setName('müzik-ruleti').setDescription('Rastgele bir şarkı çekip kuyruğa ekler'),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    await interaction.deferReply();
    const seed = seeds[Math.floor(Math.random() * seeds.length)];
    const tracks = await search(seed, { requestedBy: interaction.user, limit: 10 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Ruletten şarkı çıkmadı, tekrar dene.')] });

    const track = tracks[Math.floor(Math.random() * tracks.length)];
    const player = useMainPlayer();
    await player.play(interaction.member.voice.channel, track.url, {
      nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: true },
      requestedBy: interaction.user
    });

    await interaction.editReply({ embeds: [successEmbed(`🎰 Rulet sonucu: **${track.title}** kuyruğa eklendi!`)] });
  }
};

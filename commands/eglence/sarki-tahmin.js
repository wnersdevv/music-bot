const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

const seeds = ['pop hit', 'türkçe pop klasik', 'rock klasik'];

module.exports = {
  data: new SlashCommandBuilder().setName('şarkı-tahmin').setDescription('Kısa bir parça çalar, adını tahmin et!'),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    await interaction.deferReply();
    const seed = seeds[Math.floor(Math.random() * seeds.length)];
    const tracks = await search(seed, { requestedBy: interaction.user, limit: 10 });
    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Oyun için şarkı bulunamadı.')] });

    const track = tracks[Math.floor(Math.random() * tracks.length)];
    const player = useMainPlayer();
    await player.play(interaction.member.voice.channel, track.url, {
      nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: true },
      requestedBy: interaction.user
    });

    await interaction.editReply({ embeds: [baseEmbed().setTitle('🎮 Şarkı Tahmin').setDescription('Şarkı çalıyor! 20 saniyen var, adını sohbete yaz.')] });

    const collector = interaction.channel.createMessageCollector({ time: 20_000 });
    collector.on('collect', (msg) => {
      if (track.title.toLowerCase().includes(msg.content.toLowerCase()) && msg.content.length > 3) {
        interaction.followUp({ embeds: [successEmbed(`🎉 **${msg.author.username}** bildi! Cevap: **${track.title}**`)] });
        collector.stop();
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason !== 'user') {
        interaction.followUp({ embeds: [baseEmbed().setTitle('⏰ Süre Doldu').setDescription(`Cevap: **${track.title}**`)] });
      }
    });
  }
};

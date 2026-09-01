const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { search } = require('../../search/searchService');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('radyo-tür')
    .setDescription('Serbest metinle radyo türü belirterek yayın başlatır')
    .addStringOption((o) => o.setName('tür').setDescription('Örn: synthwave, k-pop, jazz').setRequired(true)),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    await interaction.deferReply();
    const genre = interaction.options.getString('tür');
    const tracks = await search(`${genre} müzik karışımı`, { requestedBy: interaction.user, limit: 10 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Bu tür için şarkı bulunamadı.')] });

    const player = useMainPlayer();
    for (const track of tracks) {
      await player.play(interaction.member.voice.channel, track.url, {
        nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: false, repeatMode: 2 },
        requestedBy: interaction.user
      }).catch(() => {});
    }

    await interaction.editReply({ embeds: [successEmbed(`📻 Radyo başlatıldı: **${genre}**`)] });
  }
};

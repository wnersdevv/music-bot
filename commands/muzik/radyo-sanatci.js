const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { search } = require('../../search/searchService');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('radyo-sanatçı')
    .setDescription('Bir sanatçının şarkılarından oluşan radyo başlatır')
    .addStringOption((o) => o.setName('sanatçı').setDescription('Sanatçı adı').setRequired(true)),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    await interaction.deferReply();
    const artist = interaction.options.getString('sanatçı');
    const tracks = await search(`${artist} en iyi şarkılar karışımı`, { requestedBy: interaction.user, limit: 10 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Sanatçı için şarkı bulunamadı.')] });

    const player = useMainPlayer();
    for (const track of tracks) {
      await player.play(interaction.member.voice.channel, track.url, {
        nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: false, repeatMode: 2 },
        requestedBy: interaction.user
      }).catch(() => {});
    }

    await interaction.editReply({ embeds: [successEmbed(`📻 Radyo başlatıldı: **${artist}**`)] });
  }
};

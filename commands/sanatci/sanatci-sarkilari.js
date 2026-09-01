const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { search } = require('../../search/searchService');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sanatçı-şarkıları')
    .setDescription('Bir sanatçının şarkılarını kuyruğa ekler')
    .addStringOption((o) => o.setName('isim').setDescription('Sanatçı adı').setRequired(true)),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    await interaction.deferReply();
    const artist = interaction.options.getString('isim');
    const tracks = await search(`${artist} şarkılar`, { requestedBy: interaction.user, limit: 8 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Şarkı bulunamadı.')] });

    const player = useMainPlayer();
    for (const track of tracks) {
      await player.play(interaction.member.voice.channel, track.url, {
        nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: true },
        requestedBy: interaction.user
      }).catch(() => {});
    }

    await interaction.editReply({ embeds: [successEmbed(`**${artist}** şarkıları kuyruğa eklendi (${tracks.length} şarkı).`)] });
  }
};

const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const Playlist = require('../../database/models/Playlist');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kuyruk-yükle')
    .setDescription('Kayıtlı bir playlisti kuyruğa yükler')
    .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true)),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const playlists = await Playlist.find({ userId: interaction.user.id, name: new RegExp(focused, 'i') }).limit(20).lean();
    await interaction.respond(playlists.map((p) => ({ name: p.name, value: p.name })));
  },

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    const name = interaction.options.getString('isim');
    const playlist = await Playlist.findOne({ userId: interaction.user.id, name }).lean();
    if (!playlist?.tracks?.length) {
      return interaction.reply({ embeds: [errorEmbed('Playlist bulunamadı veya boş.')], ephemeral: true });
    }

    await interaction.deferReply();
    const player = useMainPlayer();
    for (const track of playlist.tracks) {
      await player.play(interaction.member.voice.channel, track.url, {
        nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: true },
        requestedBy: interaction.user
      }).catch(() => {});
    }

    await interaction.editReply({ embeds: [successEmbed(`**${name}** kuyruğa yüklendi (${playlist.tracks.length} şarkı).`)] });
  }
};

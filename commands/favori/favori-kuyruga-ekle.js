const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const Favorite = require('../../database/models/Favorite');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder().setName('favori-kuyruğa-ekle').setDescription('Tüm favorilerini kuyruğa ekler'),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    const favorites = await Favorite.find({ userId: interaction.user.id }).lean();
    if (!favorites.length) {
      return interaction.reply({ embeds: [errorEmbed('Favori listende şarkı yok.')], ephemeral: true });
    }

    await interaction.deferReply();
    const player = useMainPlayer();
    for (const fav of favorites) {
      await player.play(interaction.member.voice.channel, fav.url, {
        nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: true },
        requestedBy: interaction.user
      }).catch(() => {});
    }

    await interaction.editReply({ embeds: [successEmbed(`${favorites.length} favori şarkı kuyruğa eklendi.`)] });
  }
};

const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const Favorite = require('../../database/models/Favorite');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('favori-çal')
    .setDescription('Favorilerinden bir şarkı çalar')
    .addStringOption((opt) =>
      opt.setName('şarkı').setDescription('Çalınacak favori şarkı').setRequired(true).setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const favorites = await Favorite.find({ userId: interaction.user.id, title: new RegExp(focused, 'i') })
      .limit(20)
      .lean();
    await interaction.respond(favorites.map((f) => ({ name: f.title.slice(0, 100), value: f.url.slice(0, 100) })));
  },

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    const url = interaction.options.getString('şarkı');
    await interaction.deferReply();

    const player = useMainPlayer();
    const { track } = await player.play(interaction.member.voice.channel, url, {
      nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: true },
      requestedBy: interaction.user
    });

    await interaction.editReply({ embeds: [successEmbed(`**${track.title}** kuyruğa eklendi.`)] });
  }
};

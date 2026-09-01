const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const History = require('../../database/models/History');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('geçmişten-çal')
    .setDescription('Dinleme geçmişinden bir şarkı çalar')
    .addStringOption((o) => o.setName('şarkı').setDescription('Çalınacak şarkı').setRequired(true).setAutocomplete(true)),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const history = await History.find({ userId: interaction.user.id, title: new RegExp(focused, 'i') })
      .sort({ playedAt: -1 })
      .limit(20)
      .lean();
    const seen = new Set();
    const options = [];
    for (const h of history) {
      if (seen.has(h.url)) continue;
      seen.add(h.url);
      options.push({ name: h.title.slice(0, 100), value: h.url.slice(0, 100) });
    }
    await interaction.respond(options.slice(0, 20));
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

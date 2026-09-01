const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const History = require('../../database/models/History');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('geçmişten-kuyruğa')
    .setDescription('Son dinlediğin 10 şarkıyı kuyruğa ekler'),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    const history = await History.find({ userId: interaction.user.id }).sort({ playedAt: -1 }).limit(10).lean();
    if (!history.length) {
      return interaction.reply({ embeds: [errorEmbed('Dinleme geçmişin boş.')], ephemeral: true });
    }

    await interaction.deferReply();
    const player = useMainPlayer();
    const seen = new Set();
    let added = 0;

    for (const h of history) {
      if (seen.has(h.url)) continue;
      seen.add(h.url);
      await player.play(interaction.member.voice.channel, h.url, {
        nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: true },
        requestedBy: interaction.user
      }).catch(() => {});
      added++;
    }

    await interaction.editReply({ embeds: [successEmbed(`${added} şarkı geçmişinden kuyruğa eklendi.`)] });
  }
};

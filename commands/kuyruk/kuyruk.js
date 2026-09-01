const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('kuyruk').setDescription('Şarkı kuyruğunu gösterir'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Kuyrukta şarkı yok.')], ephemeral: true });
    }

    const upcoming = queue.tracks.toArray().slice(0, 15);
    const list = upcoming.map((t, i) => `**${i + 1}.** ${t.title} — \`${t.duration}\``).join('\n') || 'Sırada başka şarkı yok.';

    const embed = baseEmbed()
      .setTitle('📋 Kuyruk')
      .setDescription(`▶️ Şu an: **${queue.currentTrack.title}**\n\n${list}`)
      .setFooter({ text: `Toplam ${queue.tracks.size} şarkı • wnersdev` });

    await interaction.reply({ embeds: [embed] });
  }
};

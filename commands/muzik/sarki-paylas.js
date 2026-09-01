const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('şarkı-paylaş').setDescription('Çalan şarkıyı kanalda paylaşır'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const track = queue.currentTrack;
    const embed = baseEmbed()
      .setTitle('🔗 Paylaşılan Şarkı')
      .setDescription(`**${interaction.user.username}** şunu paylaştı:\n[${track.title}](${track.url})`)
      .setThumbnail(track.thumbnail);

    await interaction.reply({ embeds: [embed] });
  }
};

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const config = require('../../config/config');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('debug').setDescription('Geliştirici: bu sunucu için debug bilgisi gösterir'),

  async execute(interaction, client) {
    if (!config.devIds.includes(interaction.user.id)) {
      return interaction.reply({ embeds: [errorEmbed('Bu komutu kullanma yetkin yok.')], ephemeral: true });
    }

    const queue = useQueue(interaction.guildId);
    const embed = baseEmbed()
      .setTitle('🐞 Debug Bilgisi')
      .setDescription(
        `**Guild ID:** \`${interaction.guildId}\`\n` +
        `**Queue mevcut:** ${queue ? 'Evet' : 'Hayır'}\n` +
        `**Voice bağlı:** ${queue?.connection ? 'Evet' : 'Hayır'}\n` +
        `**Kuyruk boyutu:** ${queue?.tracks?.size ?? 0}\n` +
        `**Ping:** ${client.ws.ping}ms\n` +
        `**Node.js:** ${process.version}`
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

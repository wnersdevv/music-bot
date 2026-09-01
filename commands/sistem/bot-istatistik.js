const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('bot-istatistik').setDescription('Geliştirici: bot durumunu gösterir'),

  async execute(interaction, client) {
    if (!config.devIds.includes(interaction.user.id)) {
      return interaction.reply({ embeds: [errorEmbed('Bu komutu kullanma yetkin yok.')], ephemeral: true });
    }

    const embed = baseEmbed()
      .setTitle(`🛠️ ${config.brand} — Bot Durumu`)
      .setDescription(
        `🌐 Sunucu sayısı: **${client.guilds.cache.size}**\n` +
        `🎶 Aktif çalma: **${client.commands.size > 0 ? 'Hazır' : 'Yükleniyor'}**\n` +
        `📶 Ping: **${client.ws.ping}ms**\n` +
        `💾 Bellek: **${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB**`
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

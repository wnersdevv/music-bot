const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');
const { searchCache, metadataCache, settingsCache } = require('../../utils/cache');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('cache-temizle').setDescription('Geliştirici: önbelleği temizler'),

  async execute(interaction) {
    if (!config.devIds.includes(interaction.user.id)) {
      return interaction.reply({ embeds: [errorEmbed('Bu komutu kullanma yetkin yok.')], ephemeral: true });
    }

    searchCache.clear();
    metadataCache.clear();
    settingsCache.clear();

    await interaction.reply({ embeds: [successEmbed('Tüm önbellek temizlendi.')], ephemeral: true });
  }
};

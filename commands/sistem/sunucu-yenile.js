const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');
const { settingsCache } = require('../../utils/cache');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { setGuildLanguageCache } = require('../../services/i18n');
const GuildModel = require('../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder().setName('sunucu-yenile').setDescription('Geliştirici: bu sunucunun önbelleğini yeniler'),

  async execute(interaction) {
    if (!config.devIds.includes(interaction.user.id)) {
      return interaction.reply({ embeds: [errorEmbed('Bu komutu kullanma yetkin yok.')], ephemeral: true });
    }

    settingsCache.delete(interaction.guildId);
    const doc = await GuildModel.findOne({ guildId: interaction.guildId }).lean();
    setGuildLanguageCache(interaction.guildId, doc?.language || 'tr');

    await interaction.reply({ embeds: [successEmbed('Sunucu önbelleği yenilendi.')], ephemeral: true });
  }
};

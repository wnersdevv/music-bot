const { SlashCommandBuilder } = require('discord.js');
const Favorite = require('../../database/models/Favorite');
const { baseEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('favoriler').setDescription('Favori şarkılarını listeler'),

  async execute(interaction) {
    const favorites = await Favorite.find({ userId: interaction.user.id }).sort({ addedAt: -1 }).limit(20).lean();

    if (!favorites.length) {
      return interaction.reply({ embeds: [errorEmbed('Henüz favori şarkın yok.')], ephemeral: true });
    }

    const list = favorites.map((f, i) => `**${i + 1}.** ${f.title}`).join('\n');
    const embed = baseEmbed().setTitle(`❤️ ${interaction.user.username} — Favoriler`).setDescription(list);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

const { SlashCommandBuilder } = require('discord.js');
const Favorite = require('../../database/models/Favorite');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('favori-temizle').setDescription('Tüm favorilerini temizler'),

  async execute(interaction) {
    await Favorite.deleteMany({ userId: interaction.user.id });
    await interaction.reply({ embeds: [successEmbed('Tüm favorilerin temizlendi.')], ephemeral: true });
  }
};

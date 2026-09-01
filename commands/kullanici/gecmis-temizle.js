const { SlashCommandBuilder } = require('discord.js');
const History = require('../../database/models/History');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('geçmiş-temizle').setDescription('Dinleme geçmişini temizler'),

  async execute(interaction) {
    await History.deleteMany({ userId: interaction.user.id });
    await interaction.reply({ embeds: [successEmbed('Dinleme geçmişin temizlendi.')], ephemeral: true });
  }
};

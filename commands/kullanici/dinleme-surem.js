const { SlashCommandBuilder } = require('discord.js');
const History = require('../../database/models/History');
const { baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('dinleme-sürem').setDescription('Toplam dinleme sürenizi gösterir'),

  async execute(interaction) {
    const history = await History.find({ userId: interaction.user.id }).lean();
    const totalMs = history.reduce((sum, h) => sum + (h.durationMs || 0), 0);
    const hours = Math.floor(totalMs / 1000 / 60 / 60);
    const minutes = Math.floor((totalMs / 1000 / 60) % 60);

    await interaction.reply({
      embeds: [baseEmbed().setTitle('⏱️ Toplam Dinleme Süren').setDescription(`**${hours}** saat **${minutes}** dakika\n🎵 ${history.length} şarkı çalındı`)],
      ephemeral: true
    });
  }
};

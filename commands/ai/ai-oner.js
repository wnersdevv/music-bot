const { SlashCommandBuilder } = require('discord.js');
const { recommendByMood } = require('../../ai/aiService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai-öner')
    .setDescription('AI\'dan şarkı önerisi ister (otomatik çalmadan)')
    .addStringOption((opt) => opt.setName('konu').setDescription('Ne tür müzik istiyorsun?').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const topic = interaction.options.getString('konu');

    try {
      const tracks = await recommendByMood(topic, interaction.user);
      if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Öneri üretilemedi.')] });

      const list = tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n');
      await interaction.editReply({ embeds: [baseEmbed().setTitle('🤖 AI Önerileri').setDescription(list)] });
    } catch {
      await interaction.editReply({ embeds: [errorEmbed('AI servisine ulaşılamadı.')] });
    }
  }
};

const { SlashCommandBuilder } = require('discord.js');
const { askAI } = require('../../ai/aiService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sanatçı-bilgi')
    .setDescription('Bir sanatçı hakkında kısa bilgi verir (AI destekli)')
    .addStringOption((o) => o.setName('isim').setDescription('Sanatçı adı').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const artist = interaction.options.getString('isim');

    try {
      const info = await askAI(`"${artist}" isimli müzik sanatçısı hakkında 3-4 cümlelik kısa ve doğru bir bilgi ver. Sadece bilgiyi yaz.`);
      await interaction.editReply({ embeds: [baseEmbed().setTitle(`ℹ️ ${artist}`).setDescription(info || 'Bilgi bulunamadı.')] });
    } catch {
      await interaction.editReply({ embeds: [errorEmbed('AI servisine ulaşılamadı.')] });
    }
  }
};

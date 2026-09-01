const { SlashCommandBuilder } = require('discord.js');
const { askAI } = require('../../ai/aiService');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('akıllı-ara')
    .setDescription('Doğal dil ile şarkı arar (örn: "o hüzünlü türkçe şarkı neydi")')
    .addStringOption((opt) => opt.setName('açıklama').setDescription('Şarkıyı tarif et').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const description = interaction.options.getString('açıklama');

    try {
      const raw = await askAI(
        `Kullanıcının tarif ettiği şarkıya en uygun tek bir YouTube arama sorgusu üret. SADECE sorguyu yaz, başka hiçbir şey yazma.\nTarif: "${description}"`
      );
      const query = raw.trim().split('\n')[0];
      const tracks = await search(query, { requestedBy: interaction.user, limit: 5 });

      if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Uygun şarkı bulunamadı.')] });

      const list = tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n');
      await interaction.editReply({ embeds: [baseEmbed().setTitle(`🧠 Akıllı Arama: "${query}"`).setDescription(list)] });
    } catch {
      await interaction.editReply({ embeds: [errorEmbed('AI servisine ulaşılamadı.')] });
    }
  }
};

const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kuyrukta-ara')
    .setDescription('Kuyrukta şarkı arar')
    .addStringOption((o) => o.setName('sorgu').setDescription('Aranacak kelime').setRequired(true)),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    const query = interaction.options.getString('sorgu').toLowerCase();

    if (!queue?.tracks?.size) {
      return interaction.reply({ embeds: [errorEmbed('Kuyruk boş.')], ephemeral: true });
    }

    const matches = queue.tracks.toArray()
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.title.toLowerCase().includes(query));

    if (!matches.length) {
      return interaction.reply({ embeds: [errorEmbed('Eşleşen şarkı bulunamadı.')], ephemeral: true });
    }

    const list = matches.slice(0, 10).map(({ t, i }) => `**${i + 1}.** ${t.title}`).join('\n');
    await interaction.reply({ embeds: [baseEmbed().setTitle(`🔎 Kuyrukta "${query}" sonuçları`).setDescription(list)], ephemeral: true });
  }
};

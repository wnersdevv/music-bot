const { SlashCommandBuilder } = require('discord.js');
const { search } = require('../../search/searchService');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

const seeds = ['pop hit', 'rock klasikleri', 'türkçe rap', 'lo-fi chill', '2000ler hit', 'arabesk klasik'];

module.exports = {
  data: new SlashCommandBuilder().setName('rastgele').setDescription('Rastgele bir şarkı önerir'),

  async execute(interaction) {
    await interaction.deferReply();
    const seed = seeds[Math.floor(Math.random() * seeds.length)];
    const tracks = await search(seed, { requestedBy: interaction.user, limit: 10 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Şarkı bulunamadı.')] });

    const track = tracks[Math.floor(Math.random() * tracks.length)];
    await interaction.editReply({ embeds: [baseEmbed().setTitle('🎲 Rastgele Şarkı').setDescription(`**${track.title}**\n${track.url}`)] });
  }
};

const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embeds');

const artists = ['Sezen Aksu', 'Tarkan', 'MFÖ', 'Duman', 'Mor ve Ötesi', 'Ajda Pekkan', 'Barış Manço', 'Teoman', 'Sertab Erener'];

module.exports = {
  data: new SlashCommandBuilder().setName('rastgele-sanatçı').setDescription('Rastgele bir sanatçı önerir'),

  async execute(interaction) {
    const artist = artists[Math.floor(Math.random() * artists.length)];
    await interaction.reply({ embeds: [baseEmbed().setTitle('🎤 Rastgele Sanatçı').setDescription(`**${artist}**`)] });
  }
};

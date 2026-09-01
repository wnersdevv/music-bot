const { SlashCommandBuilder } = require('discord.js');
const GuildMusicSettings = require('../../database/models/GuildMusicSettings');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('24-7')
    .setDescription('7/24 modunu açar/kapatır')
    .addBooleanOption((o) => o.setName('durum').setDescription('Açık/Kapalı').setRequired(true)),

  async execute(interaction) {
    const state = interaction.options.getBoolean('durum');
    await GuildMusicSettings.updateOne({ guildId: interaction.guildId }, { twentyFourSeven: state }, { upsert: true });
    await interaction.reply({ embeds: [successEmbed(`7/24 modu ${state ? 'açıldı' : 'kapatıldı'}.`)] });
  }
};

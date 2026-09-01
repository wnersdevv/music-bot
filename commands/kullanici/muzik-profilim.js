const { SlashCommandBuilder } = require('discord.js');
const profilCommand = require('./profil');

module.exports = {
  data: new SlashCommandBuilder().setName('müzik-profilim').setDescription('Müzik profilini gösterir (profil ile aynı)'),
  execute: profilCommand.execute
};

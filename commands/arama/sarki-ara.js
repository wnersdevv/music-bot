const { SlashCommandBuilder } = require('discord.js');
const araCommand = require('./ara');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('şarkı-ara')
    .setDescription('Belirli bir şarkı adı ile arama yapar')
    .addStringOption((opt) => opt.setName('sorgu').setDescription('Şarkı adı').setRequired(true)),

  execute: araCommand.execute
};

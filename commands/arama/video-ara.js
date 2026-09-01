const { SlashCommandBuilder } = require('discord.js');
const araCommand = require('./ara');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('video-ara')
    .setDescription('YouTube video araması yapar')
    .addStringOption((opt) => opt.setName('sorgu').setDescription('Video adı veya konu').setRequired(true)),

  execute: araCommand.execute
};

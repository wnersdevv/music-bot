const { SlashCommandBuilder } = require('discord.js');
const gecmisCommand = require('./gecmis');

module.exports = {
  data: new SlashCommandBuilder().setName('geçmişim').setDescription('Dinleme geçmişini gösterir (/geçmiş ile aynı)'),
  execute: gecmisCommand.execute
};

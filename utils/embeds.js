const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');
const emojis = require('../emojis');

function baseEmbed() {
  return new EmbedBuilder().setColor(config.colors.primary).setFooter({ text: config.brand });
}

function successEmbed(description) {
  return baseEmbed().setColor(config.colors.success).setDescription(`${emojis.success} ${description}`);
}

function errorEmbed(description) {
  return baseEmbed().setColor(config.colors.error).setDescription(`${emojis.error} ${description}`);
}

function warningEmbed(description) {
  return baseEmbed().setColor(config.colors.warning).setDescription(`${emojis.warning} ${description}`);
}

module.exports = { baseEmbed, successEmbed, errorEmbed, warningEmbed };

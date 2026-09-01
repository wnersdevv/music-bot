const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const GuildMusicSettings = require('../../database/models/GuildMusicSettings');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otomatik-oynat')
    .setDescription('Otomatik oynatmayı bu oturum için anlık açar/kapatır')
    .addBooleanOption((o) => o.setName('durum').setDescription('Açık/Kapalı').setRequired(true)),

  async execute(interaction) {
    const state = interaction.options.getBoolean('durum');
    const queue = useQueue(interaction.guildId);
    if (queue) queue.setRepeatMode(state ? 3 : 0); // AUTOPLAY = 3 (discord-player)

    await GuildMusicSettings.updateOne({ guildId: interaction.guildId }, { autoplay: state }, { upsert: true });
    await interaction.reply({ embeds: [successEmbed(`Otomatik oynatma ${state ? 'açıldı' : 'kapatıldı'}.`)] });
  }
};

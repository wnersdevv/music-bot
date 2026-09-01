const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const GuildMusicSettings = require('../../database/models/GuildMusicSettings');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('müzik-kanalı')
    .setDescription('Müzik komutlarının kullanılacağı kanalı ayarlar')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((o) => o.setName('kanal').setDescription('Metin kanalı').addChannelTypes(ChannelType.GuildText).setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');
    await GuildMusicSettings.updateOne({ guildId: interaction.guildId }, { musicChannelId: channel.id }, { upsert: true });
    await interaction.reply({ embeds: [successEmbed(`Müzik kanalı ${channel} olarak ayarlandı.`)], ephemeral: true });
  }
};
